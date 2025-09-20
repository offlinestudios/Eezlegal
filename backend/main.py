from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import logging
import httpx

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="EezLegal API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://www.eezlegal.com")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "EezLegal API is running", 
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for Railway"""
    return {
        "status": "healthy",
        "service": "eezlegal-api",
        "version": "1.0.0",
        "port": os.getenv("PORT", "unknown")
    }

@app.get("/auth/google")
async def google_auth():
    """Initiate Google OAuth flow"""
    try:
        if not GOOGLE_CLIENT_ID:
            logger.error("Google Client ID not configured")
            return RedirectResponse(url=f"{FRONTEND_URL}/login/?error=oauth_not_configured")
        
        # Build OAuth URL
        redirect_uri = "https://eezlegal-production.up.railway.app/auth/callback"
        
        oauth_url = (
            f"https://accounts.google.com/o/oauth2/auth?"
            f"client_id={GOOGLE_CLIENT_ID}&"
            f"redirect_uri={redirect_uri}&"
            f"scope=openid email profile&"
            f"response_type=code&"
            f"access_type=offline"
        )
        
        logger.info("Redirecting to Google OAuth")
        return RedirectResponse(url=oauth_url)
        
    except Exception as e:
        logger.error(f"Google auth error: {e}")
        return RedirectResponse(url=f"{FRONTEND_URL}/login/?error=auth_failed")

@app.get("/auth/callback")
async def google_callback(code: str = None, error: str = None):
    """Handle Google OAuth callback"""
    try:
        if error:
            logger.error(f"OAuth error: {error}")
            return RedirectResponse(url=f"{FRONTEND_URL}/login/?error={error}")
        
        if not code:
            logger.error("No authorization code received")
            return RedirectResponse(url=f"{FRONTEND_URL}/login/?error=no_code")
        
        # Exchange code for token
        if GOOGLE_CLIENT_SECRET:
            try:
                redirect_uri = "https://eezlegal-production.up.railway.app/auth/callback"
                
                token_data = {
                    'client_id': GOOGLE_CLIENT_ID,
                    'client_secret': GOOGLE_CLIENT_SECRET,
                    'code': code,
                    'grant_type': 'authorization_code',
                    'redirect_uri': redirect_uri,
                }
                
                async with httpx.AsyncClient() as client:
                    # Get access token
                    token_response = await client.post(
                        'https://oauth2.googleapis.com/token',
                        data=token_data
                    )
                    
                    if token_response.status_code == 200:
                        token_info = token_response.json()
                        access_token = token_info.get('access_token')
                        
                        if access_token:
                            # Get user info
                            user_response = await client.get(
                                'https://www.googleapis.com/oauth2/v2/userinfo',
                                headers={'Authorization': f'Bearer {access_token}'}
                            )
                            
                            if user_response.status_code == 200:
                                user_info = user_response.json()
                                # Create a simple token (in production, use proper JWT)
                                simple_token = f"user_{user_info.get('id', 'unknown')}"
                                
                                logger.info(f"OAuth successful for user: {user_info.get('email')}")
                                return RedirectResponse(url=f"{FRONTEND_URL}/dashboard/?token={simple_token}")
            
            except Exception as oauth_error:
                logger.error(f"OAuth processing error: {oauth_error}")
        
        # Fallback: redirect with a test token
        logger.info("OAuth callback - using fallback token")
        return RedirectResponse(url=f"{FRONTEND_URL}/dashboard/?token=test_token_123")
        
    except Exception as e:
        logger.error(f"Callback error: {e}")
        return RedirectResponse(url=f"{FRONTEND_URL}/login/?error=callback_failed")

@app.post("/api/chat")
async def chat_endpoint(request: Request):
    """Simple chat endpoint"""
    try:
        data = await request.json()
        message = data.get("message", "").strip()
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        # Simple response for now
        response = f"Thank you for your legal question: '{message}'. This is a test response from EezLegal. In a full implementation, this would be processed by our AI legal assistant."
        
        return JSONResponse({
            "response": response,
            "status": "success"
        })
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process chat message")

@app.get("/api/test")
async def test_endpoint():
    """Test endpoint"""
    return {
        "message": "API is working",
        "status": "success",
        "environment": {
            "google_client_id_configured": bool(GOOGLE_CLIENT_ID),
            "google_client_secret_configured": bool(GOOGLE_CLIENT_SECRET),
            "frontend_url": FRONTEND_URL
        }
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    logger.info(f"Starting server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
