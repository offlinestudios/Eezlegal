import os
from fastapi import FastAPI
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

# API info endpoint
@app.get("/api")
def api_info():
    return {
        "service": "EezLegal Backend",
        "version": "1.0.0",
        "status": "running"
    }

# Simple chat endpoint
@app.post("/api/chat")
def chat(data: dict):
    message = data.get("message", "No message")
    return {
        "response": f"Echo: {message}",
        "status": "success"
    }

# OAuth placeholder endpoints
@app.get("/auth/google")
def google_auth():
    return {"message": "Google OAuth placeholder", "status": "placeholder"}

@app.get("/auth/google/callback")
def google_callback():
    return {"message": "Google OAuth callback placeholder", "status": "placeholder"}

@app.post("/api/auth/login")
def login():
    return {"message": "Login placeholder", "status": "placeholder"}

@app.post("/api/auth/signup")
def signup():
    return {"message": "Signup placeholder", "status": "placeholder"}

# For local testing
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)

