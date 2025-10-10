from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
import os
import json
from typing import List, Optional
import httpx
from datetime import datetime

app = FastAPI(title="EezLegal API", version="2.0.0")

# CORS middleware - Updated for Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",  # Development
        "https://eezlegal.vercel.app",  # Vercel deployment
        "https://www.eezlegal.com",  # Custom domain
        "*"  # Allow all for development - restrict in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ChatMessage(BaseModel):
    message: str
    history: Optional[List[dict]] = []
    user_id: Optional[str] = None

class AuthRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class PhoneVerificationRequest(BaseModel):
    phoneNumber: str

class PhoneVerifyRequest(BaseModel):
    phoneNumber: str
    verificationCode: str

class StripeCheckoutRequest(BaseModel):
    priceId: str
    userId: str
    userEmail: str
    successUrl: str
    cancelUrl: str

# Health and config endpoints
@app.get("/")
async def root():
    return {"message": "EezLegal Backend Running", "status": "ok", "version": "2.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "eezlegal-backend", "timestamp": datetime.now().isoformat()}

@app.get("/api/config")
async def config():
    return {
        "oauth_configured": True,
        "google_client_id": os.getenv("GOOGLE_CLIENT_ID", "not-set"),
        "microsoft_client_id": os.getenv("MICROSOFT_CLIENT_ID", "not-set"),
        "apple_client_id": os.getenv("APPLE_CLIENT_ID", "not-set"),
        "frontend_url": os.getenv("FRONTEND_URL", "https://eezlegal.vercel.app"),
        "stripe_configured": bool(os.getenv("STRIPE_SECRET_KEY")),
        "openai_configured": bool(os.getenv("OPENAI_API_KEY"))
    }

# Authentication endpoints
@app.post("/api/auth/login")
async def login(auth_request: AuthRequest):
    # TODO: Implement actual authentication logic
    # For now, return a mock response
    return {
        "success": True,
        "token": "mock_jwt_token_123",
        "user": {
            "id": "user_123",
            "name": "Test User",
            "email": auth_request.email,
            "subscription": "free"
        }
    }

@app.post("/api/auth/signup")
async def signup(signup_request: SignupRequest):
    # TODO: Implement actual signup logic
    return {
        "success": True,
        "token": "mock_jwt_token_123",
        "user": {
            "id": "user_123",
            "name": signup_request.name,
            "email": signup_request.email,
            "subscription": "free"
        }
    }

@app.get("/api/auth/verify")
async def verify_token():
    # TODO: Implement token verification
    return {
        "success": True,
        "user": {
            "id": "user_123",
            "name": "Test User",
            "email": "test@example.com",
            "subscription": "free"
        }
    }

@app.post("/api/auth/logout")
async def logout():
    return {"success": True, "message": "Logged out successfully"}

# Phone authentication
@app.post("/api/auth/phone/send")
async def send_phone_verification(request: PhoneVerificationRequest):
    # TODO: Implement SMS sending logic
    return {"success": True, "message": "Verification code sent"}

@app.post("/api/auth/phone/verify")
async def verify_phone_code(request: PhoneVerifyRequest):
    # TODO: Implement phone verification logic
    return {
        "success": True,
        "token": "mock_jwt_token_123",
        "user": {
            "id": "user_123",
            "name": "Phone User",
            "phone": request.phoneNumber,
            "subscription": "free"
        }
    }

# OAuth endpoints
@app.get("/auth/google")
async def google_auth():
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    frontend_url = os.getenv("FRONTEND_URL", "https://eezlegal.vercel.app")
    
    if not client_id:
        return {"error": "Google OAuth not configured"}
    
    google_url = f"https://accounts.google.com/o/oauth2/auth?client_id={client_id}&redirect_uri={os.getenv('BACKEND_URL', 'https://your-railway-app.railway.app')}/auth/callback&response_type=code&scope=openid email profile"
    
    return RedirectResponse(url=google_url)

@app.get("/auth/microsoft")
async def microsoft_auth():
    client_id = os.getenv("MICROSOFT_CLIENT_ID")
    if not client_id:
        return {"error": "Microsoft OAuth not configured"}
    
    microsoft_url = f"https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id={client_id}&response_type=code&scope=openid email profile"
    return RedirectResponse(url=microsoft_url)

@app.get("/auth/apple")
async def apple_auth():
    client_id = os.getenv("APPLE_CLIENT_ID")
    if not client_id:
        return {"error": "Apple OAuth not configured"}
    
    apple_url = f"https://appleid.apple.com/auth/authorize?client_id={client_id}&response_type=code&scope=name email"
    return RedirectResponse(url=apple_url)

@app.get("/auth/callback")
async def auth_callback(code: str = None):
    frontend_url = os.getenv("FRONTEND_URL", "https://eezlegal.vercel.app")
    
    if code:
        # TODO: Exchange code for token
        return RedirectResponse(url=f"{frontend_url}/?token=mock_oauth_token_123")
    else:
        return RedirectResponse(url=f"{frontend_url}/?error=oauth_failed")

# Chat endpoint with OpenAI integration
@app.post("/api/chat")
async def chat(chat_request: ChatMessage):
    try:
        openai_api_key = os.getenv("OPENAI_API_KEY")
        
        if not openai_api_key:
            return {
                "success": False,
                "error": "OpenAI API not configured",
                "fallback": True
            }
        
        # Build messages for OpenAI
        messages = [
            {
                "role": "system",
                "content": """You are EezLegal, a helpful AI legal assistant. Provide responses in this exact format:

**TL;DR:**
[Concise summary in 1-2 sentences]

**What this means:**
• [Key point 1]
• [Key point 2]
• [Key point 3]

**Risks & gotchas:**
• [Risk 1]
• [Risk 2]
• [Risk 3]

**Next steps:**
1. [Action item 1]
2. [Action item 2]
3. [Action item 3]
4. [Consider consulting with a qualified attorney]

**Ready to dive deeper?**
Create a free account to save your conversations and get unlimited legal assistance.

*I'm an AI legal assistant, not a lawyer. This is general info, not legal advice.*"""
            }
        ]
        
        # Add chat history
        for msg in chat_request.history:
            messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", "")
            })
        
        # Add current message
        messages.append({
            "role": "user",
            "content": chat_request.message
        })
        
        # Call OpenAI API
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {openai_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4o-mini",
                    "messages": messages,
                    "max_tokens": 1000,
                    "temperature": 0.7
                },
                timeout=30.0
            )
        
        if response.status_code == 200:
            result = response.json()
            return {
                "success": True,
                "message": result["choices"][0]["message"]["content"],
                "usage": result.get("usage", {})
            }
        else:
            return {
                "success": False,
                "error": "OpenAI API error",
                "fallback": True
            }
            
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "fallback": True
        }

# Stripe endpoints
@app.post("/api/stripe/create-checkout-session")
async def create_checkout_session(request: StripeCheckoutRequest):
    # TODO: Implement Stripe checkout session creation
    return {
        "success": True,
        "sessionId": "mock_stripe_session_123"
    }

@app.get("/api/stripe/subscription-status/{user_id}")
async def get_subscription_status(user_id: str):
    # TODO: Implement subscription status check
    return {
        "success": True,
        "subscription": {
            "status": "active",
            "plan": "free",
            "expires_at": None
        }
    }

@app.post("/api/stripe/cancel-subscription")
async def cancel_subscription():
    # TODO: Implement subscription cancellation
    return {"success": True, "message": "Subscription cancelled"}

# User endpoints
@app.get("/api/user/{user_id}")
async def get_user_profile(user_id: str):
    # TODO: Implement user profile retrieval
    return {
        "success": True,
        "user": {
            "id": user_id,
            "name": "Test User",
            "email": "test@example.com",
            "subscription": "free"
        }
    }

@app.put("/api/user/{user_id}")
async def update_user_profile(user_id: str):
    # TODO: Implement user profile update
    return {"success": True, "message": "Profile updated"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
