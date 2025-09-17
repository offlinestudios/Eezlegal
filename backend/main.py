from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

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
    return {"message": "Login endpoint", "status": "placeholder"}

@app.post("/api/auth/signup")
def signup():
    return {"message": "Signup endpoint", "status": "placeholder"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    print(f"🚀 Starting EezLegal Backend on port {port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port)

