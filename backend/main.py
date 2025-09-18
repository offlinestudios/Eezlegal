#!/usr/bin/env python3
import os
import sys
import logging
from fastapi import FastAPI

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI()

@app.get("/health")
def health():
    port = os.getenv("PORT", "unknown")
    logger.info(f"Health check called on port {port}")
    return {"status": "healthy", "port": port}

@app.get("/")
def root():
    return {"message": "EezLegal Backend Running", "status": "ok"}

@app.get("/api")
def api():
    return {"api": "working", "version": "1.0"}

@app.post("/api/chat")
def chat(data: dict = None):
    if data is None:
        data = {}
    return {"response": f"Echo: {data.get('message', 'no message')}", "status": "ok"}

# Emergency startup for Railway
if __name__ == "__main__":
    import uvicorn
    
    # Get port from environment
    port = int(os.getenv("PORT", "8000"))
    
    # Log startup info
    logger.info(f"🚀 Starting EezLegal Backend")
    logger.info(f"📍 Port: {port}")
    logger.info(f"🌐 Host: 0.0.0.0")
    logger.info(f"🔧 Environment: {os.getenv('RAILWAY_ENVIRONMENT', 'unknown')}")
    
    # Start uvicorn
    try:
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=port,
            log_level="info",
            access_log=True
        )
    except Exception as e:
        logger.error(f"❌ Failed to start server: {e}")
        sys.exit(1)

