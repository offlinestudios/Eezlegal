import os
from fastapi import FastAPI
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

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
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://www.eezlegal.com")

# Health check endpoint - REQUIRED for Railway
@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "eezlegal-backend",
        "port": os.getenv("PORT", "unknown")
    }

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "EezLegal Backend is running",
        "status": "active",
        "health": "/health"
    }

# Google OAuth initiation
@app.get("/auth/google")
def google_auth():
    if not GOOGLE_CLIENT_ID:
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
    
    return RedirectResponse(url=oauth_url)

# Google OAuth callback
@app.get("/auth/callback")
def google_callback(code: str = None, error: str = None):
    if error:
        return RedirectResponse(url=f"{FRONTEND_URL}/login/?error={error}")
    
    if not code:
        return RedirectResponse(url=f"{FRONTEND_URL}/login/?error=no_code")
    
    # For now, just redirect with a test token
    # In production, you would exchange the code for a real token
    test_token = "test_auth_token_123"
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
        "oauth_configured": bool(GOOGLE_CLIENT_ID)
    }

# For Railway deployment
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)
