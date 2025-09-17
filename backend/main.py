from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from authlib.integrations.starlette_client import OAuth
from starlette.middleware.sessions import SessionMiddleware
import os
from dotenv import load_dotenv
import httpx
from jose import JWTError, jwt
from datetime import datetime, timedelta
import secrets

# Load environment variables
load_dotenv()

app = FastAPI(title="EezLegal Backend API", version="1.0.0")

# Session middleware for OAuth
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY", secrets.token_urlsafe(32)))

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app",
        "https://eezlegal-git-main-julian-ross-projects.vercel.app",
        "*"  # Allow all for now
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth setup
oauth = OAuth()
oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid_configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_urlsafe(32))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()

# Helper functions
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# REQUIRED: Health check endpoint for Railway
@app.get("/health")
def health():
    return {"ok": True, "service": "eezlegal-backend", "status": "healthy"}

# API info endpoint
@app.get("/api")
def api_info():
    return {
        "service": "EezLegal Backend API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "chat": "/api/chat",
            "auth": "/api/auth"
        }
    }

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "EezLegal Backend API is running",
        "health": "/health",
        "api": "/api"
    }

# OAuth endpoints
@app.get("/auth/google")
async def google_auth(request: Request):
    """Initiate Google OAuth flow"""
    redirect_uri = request.url_for('google_callback')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@app.get("/auth/google/callback")
async def google_callback(request: Request):
    """Handle Google OAuth callback"""
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        
        if user_info:
            # Create JWT token
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": user_info['email'], "name": user_info['name']},
                expires_delta=access_token_expires
            )
            
            # Redirect to frontend with token
            frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
            return RedirectResponse(url=f"{frontend_url}?token={access_token}")
        else:
            raise HTTPException(status_code=400, detail="Failed to get user info from Google")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"OAuth error: {str(e)}")

@app.post("/api/auth/verify")
async def verify_auth(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token"""
    payload = verify_token(credentials)
    return {"valid": True, "user": {"email": payload.get("sub"), "name": payload.get("name")}}

# Chat endpoint (placeholder)
@app.post("/api/chat")
def chat_endpoint(message: dict, user: dict = Depends(verify_token)):
    return {
        "response": f"Hello {user.get('name', 'User')}, you said: {message.get('message', 'No message')}",
        "status": "success"
    }

# Auth endpoints (placeholders)
@app.post("/api/auth/login")
def login():
    return {"message": "Use /auth/google for OAuth login", "status": "redirect"}

@app.post("/api/auth/signup")
def signup():
    return {"message": "Use /auth/google for OAuth signup", "status": "redirect"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    print(f"🚀 Starting EezLegal Backend on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
else:
    # For Railway deployment
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    print(f"🚀 EezLegal Backend configured for port {port}")

# Export app for Railway
application = app

