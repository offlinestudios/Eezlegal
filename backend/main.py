from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
import os
import logging
import httpx
import jwt
from datetime import datetime, timedelta
from urllib.parse import urlencode

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="EezLegal Backend with OAuth", version="1.0.0")

# Environment variables
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
SECRET_KEY = os.environ.get("SECRET_KEY")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "https://www.eezlegal.com")

# Railway URL detection
def get_railway_url():
    """Get the correct Railway URL for OAuth callbacks"""
    # Try multiple Railway environment variables
    railway_url = (
        os.environ.get("RAILWAY_STATIC_URL") or
        os.environ.get("RAILWAY_PUBLIC_DOMAIN") or
        os.environ.get("PUBLIC_DOMAIN") or
        "https://eezlegal-production.up.railway.app"
    )
    
    # Ensure it starts with https://
    if not railway_url.startswith("http"):
        railway_url = f"https://{railway_url}"
    
    logger.info(f"🔗 Using Railway URL: {railway_url}")
    return railway_url

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    message: str
    token: str = None

class TokenVerification(BaseModel):
    token: str

@app.get("/")
async def root():
    return {"message": "EezLegal Backend API with OAuth", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "eezlegal-backend"}

@app.get("/api")
async def api_info():
    oauth_configured = bool(GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET and SECRET_KEY)
    railway_url = get_railway_url()
    return {
        "service": "EezLegal Backend",
        "version": "1.0.0",
        "oauth_configured": oauth_configured,
        "railway_url": railway_url,
        "redirect_uri": f"{railway_url}/auth/google/callback",
        "endpoints": [
            "/",
            "/health", 
            "/api",
            "/api/chat",
            "/auth/google",
            "/auth/google/callback",
            "/api/auth/verify"
        ]
    }

# OAuth Routes
@app.get("/auth/google")
async def google_auth():
    """Initiate Google OAuth flow"""
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="OAuth not configured")
    
    railway_url = get_railway_url()
    redirect_uri = f"{railway_url}/auth/google/callback"
    
    logger.info(f"🔐 Starting OAuth with redirect_uri: {redirect_uri}")
    
    # Google OAuth URL
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": redirect_uri,
        "scope": "openid email profile",
        "response_type": "code",
        "access_type": "offline",
        "prompt": "consent"
    }
    
    auth_url = f"https://accounts.google.com/o/oauth2/auth?{urlencode(params)}"
    logger.info(f"🔗 Generated auth URL: {auth_url}")
    
    return {"auth_url": auth_url}

@app.get("/auth/google/callback")
async def google_callback(code: str = None, error: str = None):
    """Handle Google OAuth callback"""
    railway_url = get_railway_url()
    redirect_uri = f"{railway_url}/auth/google/callback"
    
    logger.info(f"📥 OAuth callback received - code: {'✅' if code else '❌'}, error: {error}")
    logger.info(f"🔗 Using redirect_uri: {redirect_uri}")
    
    if error:
        logger.error(f"OAuth error: {error}")
        return RedirectResponse(url=f"{FRONTEND_URL}/login/?error={error}")
    
    if not code:
        logger.error("No authorization code received")
        return RedirectResponse(url=f"{FRONTEND_URL}/login/?error=no_code")
    
    try:
        # Exchange code for tokens
        async with httpx.AsyncClient() as client:
            token_data = {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": redirect_uri,
            }
            
            logger.info(f"🔄 Exchanging code for tokens with redirect_uri: {redirect_uri}")
            
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data=token_data
            )
            
            if token_response.status_code != 200:
                logger.error(f"Token exchange failed: {token_response.status_code} - {token_response.text}")
                return RedirectResponse(url=f"{FRONTEND_URL}/login/?error=token_exchange_failed")
            
            tokens = token_response.json()
            access_token = tokens.get("access_token")
            
            if not access_token:
                logger.error("No access token received")
                return RedirectResponse(url=f"{FRONTEND_URL}/login/?error=no_access_token")
            
            # Get user info from Google
            user_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if user_response.status_code != 200:
                logger.error(f"User info fetch failed: {user_response.status_code} - {user_response.text}")
                return RedirectResponse(url=f"{FRONTEND_URL}/login/?error=user_info_failed")
            
            user_info = user_response.json()
            logger.info(f"✅ User authenticated: {user_info.get('email')}")
            
            # Create JWT token
            jwt_payload = {
                "user_id": user_info["id"],
                "email": user_info["email"],
                "name": user_info["name"],
                "picture": user_info.get("picture"),
                "exp": datetime.utcnow() + timedelta(days=7)
            }
            
            jwt_token = jwt.encode(jwt_payload, SECRET_KEY, algorithm="HS256")
            
            # Redirect to frontend with token
            success_url = f"{FRONTEND_URL}/login/?token={jwt_token}"
            logger.info(f"🎉 OAuth successful, redirecting to: {FRONTEND_URL}/login/")
            
            return RedirectResponse(url=success_url)
            
    except Exception as e:
        logger.error(f"OAuth callback error: {str(e)}")
        return RedirectResponse(url=f"{FRONTEND_URL}/login/?error=oauth_failed")

@app.post("/api/auth/verify")
async def verify_token(token_data: TokenVerification):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token_data.token, SECRET_KEY, algorithms=["HS256"])
        return {
            "valid": True,
            "user": {
                "id": payload["user_id"],
                "email": payload["email"],
                "name": payload["name"],
                "picture": payload.get("picture")
            }
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/api/chat")
async def chat(message: ChatMessage):
    """
    Chat endpoint with optional authentication
    """
    try:
        user_context = ""
        
        # If token provided, verify and get user context
        if message.token:
            try:
                payload = jwt.decode(message.token, SECRET_KEY, algorithms=["HS256"])
                user_context = f" (User: {payload['name']})"
            except:
                # Token invalid, but continue without user context
                pass
        
        # Simple echo response for now
        response = f"Hello{user_context}! I received your message: '{message.message}'. This is a placeholder response from EezLegal AI."
        
        return {
            "response": response,
            "status": "success"
        }
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    
    logger.info("🚀 Starting EezLegal Backend with OAuth")
    logger.info(f"📍 Port: {port}")
    logger.info(f"🌐 Host: 0.0.0.0")
    logger.info(f"🔧 Environment: {os.environ.get('ENVIRONMENT', 'production')}")
    logger.info(f"🔑 OAuth configured: {bool(GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET and SECRET_KEY)}")
    logger.info(f"🔗 Railway URL: {get_railway_url()}")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        log_level="info"
    )

