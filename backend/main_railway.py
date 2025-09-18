import os
import logging
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, JSONResponse
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="EezLegal Backend API", 
    version="1.0.0",
    description="EezLegal AI Legal Assistant Backend"
)

# CORS middleware - Railway-optimized
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for Railway
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("🚀 EezLegal Backend starting up...")
    logger.info(f"Port: {os.getenv('PORT', '8000')}")
    logger.info(f"Environment: {os.getenv('RAILWAY_ENVIRONMENT', 'development')}")

# Health check endpoint - REQUIRED for Railway
@app.get("/health")
async def health_check():
    """Health check endpoint for Railway deployment"""
    return {
        "status": "healthy",
        "service": "eezlegal-backend",
        "version": "1.0.0",
        "port": os.getenv("PORT", "8000"),
        "environment": os.getenv("RAILWAY_ENVIRONMENT", "development")
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "EezLegal Backend API is running",
        "status": "active",
        "health_check": "/health",
        "api_docs": "/docs"
    }

# API info endpoint
@app.get("/api")
async def api_info():
    """API information endpoint"""
    return {
        "service": "EezLegal Backend API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "chat": "/api/chat",
            "auth": "/api/auth",
            "docs": "/docs"
        }
    }

# Simple chat endpoint
@app.post("/api/chat")
async def chat_endpoint(request: Request):
    """Simple chat endpoint"""
    try:
        body = await request.json()
        message = body.get("message", "No message provided")
        
        return {
            "response": f"Echo: {message}",
            "status": "success",
            "timestamp": "2024-01-01T00:00:00Z"
        }
    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        return JSONResponse(
            status_code=400,
            content={"error": "Invalid request", "status": "error"}
        )

# OAuth placeholder endpoints
@app.get("/auth/google")
async def google_auth():
    """Google OAuth placeholder"""
    return {
        "message": "Google OAuth endpoint - configure credentials",
        "status": "placeholder",
        "redirect": "Configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET"
    }

@app.get("/auth/google/callback")
async def google_callback():
    """Google OAuth callback placeholder"""
    return {
        "message": "Google OAuth callback - configure credentials",
        "status": "placeholder"
    }

# Auth API endpoints
@app.post("/api/auth/login")
async def login():
    """Login endpoint"""
    return {
        "message": "Use /auth/google for OAuth login",
        "status": "redirect"
    }

@app.post("/api/auth/signup")
async def signup():
    """Signup endpoint"""
    return {
        "message": "Use /auth/google for OAuth signup",
        "status": "redirect"
    }

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=404,
        content={
            "error": "Endpoint not found",
            "path": str(request.url.path),
            "available_endpoints": ["/", "/health", "/api", "/docs"]
        }
    )

@app.exception_handler(500)
async def internal_error_handler(request: Request, exc: HTTPException):
    logger.error(f"Internal server error: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "status": "error"
        }
    )

# Railway-specific startup
if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    logger.info(f"🚀 Starting EezLegal Backend on port {port}")
    uvicorn.run(
        "main_railway:app",
        host="0.0.0.0",
        port=port,
        log_level="info",
        access_log=True
    )

