import os
from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Create FastAPI app
app = FastAPI(title="EezLegal Backend", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID', '')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET', '')
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://www.eezlegal.com")

# Get the correct backend URL for Railway
BACKEND_URL = os.getenv("RAILWAY_PUBLIC_DOMAIN")
if BACKEND_URL:
    if not BACKEND_URL.startswith("https://"):
        BACKEND_URL = f"https://{BACKEND_URL}"
else:
    BACKEND_URL = "https://eezlegal-production.up.railway.app"

print(f"🚀 Starting EezLegal Backend")
print(f"📍 Backend URL: {BACKEND_URL}")
print(f"🌐 Frontend URL: {FRONTEND_URL}")
print(f"🔑 OAuth configured: {bool(GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET)}")

# Health check endpoint - REQUIRED for Railway
@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "eezlegal-backend",
        "port": os.getenv("PORT", "8000"),
        "backend_url": BACKEND_URL
    }

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "EezLegal Backend is running",
        "status": "active",
        "health": "/health",
        "oauth_configured": bool(GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET),
        "backend_url": BACKEND_URL,
        "frontend_url": FRONTEND_URL
    }

# Configuration check endpoint
@app.get("/api/config")
def config_check():
    return {
        "backend_url": BACKEND_URL,
        "frontend_url": FRONTEND_URL,
        "google_client_id": GOOGLE_CLIENT_ID[:10] + "..." if GOOGLE_CLIENT_ID else "Not configured",
        "google_client_secret": "Configured" if GOOGLE_CLIENT_SECRET else "Not configured",
        "oauth_callback_url": f"{BACKEND_URL}/auth/callback",
        "status": "ready" if (GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET) else "needs_configuration"
    }

# Google OAuth initiation
@app.get("/auth/google")
def google_auth():
    if not GOOGLE_CLIENT_ID:
        print("❌ Google Client ID not configured")
        return RedirectResponse(url=f"{FRONTEND_URL}/login/?error=oauth_not_configured")
    
    # IMPORTANT: This must match exactly what's in Google Console
    redirect_uri = f"{BACKEND_URL}/auth/callback"
    
    oauth_url = (
        f"https://accounts.google.com/o/oauth2/auth?"
        f"client_id={GOOGLE_CLIENT_ID}&"
        f"redirect_uri={redirect_uri}&"
        f"scope=openid email profile&"
        f"response_type=code&"
        f"access_type=offline"
    )
    
    print(f"🔄 Redirecting to Google OAuth: {oauth_url}")
    print(f"📍 Callback URL: {redirect_uri}")
    
    return RedirectResponse(url=oauth_url)

# Google OAuth callback - MUST match Google Console exactly
@app.get("/auth/callback")
def google_callback(code: str = None, error: str = None):
    print(f"📥 OAuth callback received - Code: {'✅' if code else '❌'}, Error: {error}")
    
    if error:
        print(f"❌ OAuth error: {error}")
        return RedirectResponse(url=f"{FRONTEND_URL}/login/?error={error}")
    
    if not code:
        print("❌ No authorization code received")
        return RedirectResponse(url=f"{FRONTEND_URL}/login/?error=no_code")
    
    # For now, create a simple test token
    # In production, exchange code for real token here
    test_token = f"auth_token_{code[:10]}"
    
    print(f"✅ OAuth successful, redirecting to dashboard with token")
    return RedirectResponse(url=f"{FRONTEND_URL}/dashboard/?token={test_token}")

# Simple chat endpoint
@app.post("/api/chat")
def chat(data: dict):
    message = data.get("message", "No message")
    response = f"Thank you for your legal question: '{message}'. This is a test response from EezLegal API."
    
    return {
        "response": response,
        "status": "success"
    }

# Test endpoint
@app.get("/api/test")
def test():
    return {
        "message": "API is working",
        "status": "success",
        "oauth_configured": bool(GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET),
        "backend_url": BACKEND_URL
    }

# For Railway deployment
if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)
