from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import os
from dotenv import load_dotenv
import secrets

# Load environment variables
load_dotenv()

app = FastAPI(title="EezLegal Backend API", version="1.0.0")

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

# Simple OAuth redirect (placeholder for now)
@app.get("/auth/google")
async def google_auth(request: Request):
    """Initiate Google OAuth flow - placeholder"""
    return {"message": "OAuth endpoint - configure Google credentials", "status": "placeholder"}

@app.get("/auth/google/callback")
async def google_callback(request: Request):
    """Handle Google OAuth callback - placeholder"""
    return {"message": "OAuth callback - configure Google credentials", "status": "placeholder"}

# Chat endpoint (placeholder)
@app.post("/api/chat")
def chat_endpoint(message: dict):
    return {
        "response": f"You said: {message.get('message', 'No message')}",
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

