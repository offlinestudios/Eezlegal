from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import os

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "EezLegal Backend Running", "status": "ok"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "eezlegal-backend"}

@app.get("/api/config")
async def config():
    return {
        "oauth_configured": True,
        "google_client_id": os.getenv("GOOGLE_CLIENT_ID", "not-set"),
        "frontend_url": os.getenv("FRONTEND_URL", "https://www.eezlegal.com")
    }

@app.get("/auth/google")
async def google_auth():
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    frontend_url = os.getenv("FRONTEND_URL", "https://www.eezlegal.com")
    
    if not client_id:
        return {"error": "Google OAuth not configured"}
    
    # Simple redirect to Google OAuth
    google_url = f"https://accounts.google.com/o/oauth2/auth?client_id={client_id}&redirect_uri=https://eezlegal-production.up.railway.app/auth/callback&response_type=code&scope=openid email profile"
    
    return RedirectResponse(url=google_url)

@app.get("/auth/callback")
async def auth_callback(code: str = None):
    frontend_url = os.getenv("FRONTEND_URL", "https://www.eezlegal.com")
    
    if code:
        # In a real app, exchange code for token here
        # For now, just redirect to dashboard with a dummy token
        return RedirectResponse(url=f"{frontend_url}/dashboard/?token=dummy_token_123")
    else:
        return RedirectResponse(url=f"{frontend_url}/login/?error=oauth_failed")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
