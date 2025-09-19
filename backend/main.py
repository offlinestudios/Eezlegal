"""
EezLegal Backend - Fixed Version
Addresses all issues identified by ChatGPT analysis
"""

import os
import sqlite3
import uuid
import logging
from datetime import datetime, timedelta
from typing import List, Optional
import httpx
import jwt
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(title="EezLegal API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
SECRET_KEY = os.environ.get("SECRET_KEY")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "https://www.eezlegal.com")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# Configure OpenAI with proper error handling
AsyncOpenAI = None
try:
    from openai import AsyncOpenAI
    if OPENAI_API_KEY:
        logger.info("✅ OpenAI SDK imported and API key found")
    else:
        logger.warning("⚠️ OpenAI API key not found - using demo responses")
except Exception as e:
    logger.exception("❌ OpenAI SDK import failed — check requirements.txt")
    AsyncOpenAI = None

# Database setup
def init_database():
    """Initialize SQLite database for chat history"""
    conn = sqlite3.connect('eezlegal.db')
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE,
            name TEXT,
            picture TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Chats table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chats (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            title TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Messages table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            chat_id TEXT,
            role TEXT,
            content TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (chat_id) REFERENCES chats (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_database()

def get_railway_url():
    """Get the correct Railway URL for OAuth callbacks"""
    railway_domain = os.environ.get("RAILWAY_PUBLIC_DOMAIN")
    if railway_domain:
        return f"https://{railway_domain}"
    
    railway_url = os.environ.get("RAILWAY_STATIC_URL")
    if railway_url:
        return railway_url
    
    return "https://eezlegal-production.up.railway.app"

# Pydantic models
class ChatMessage(BaseModel):
    message: str
    chat_id: Optional[str] = None

class TokenVerification(BaseModel):
    token: str

class ChatResponse(BaseModel):
    response: str
    chat_id: str
    status: str

# Authentication dependency
def get_current_user(authorization: str = None):
    """Extract user from JWT token"""
    if not authorization:
        raise HTTPException(status_code=401, detail="No authorization header")
    
    try:
        # Remove 'Bearer ' prefix if present
        token = authorization.replace('Bearer ', '') if authorization.startswith('Bearer ') else authorization
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Database helpers
def save_user(user_data):
    """Save or update user in database"""
    conn = sqlite3.connect('eezlegal.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT OR REPLACE INTO users (id, email, name, picture)
        VALUES (?, ?, ?, ?)
    ''', (user_data['user_id'], user_data['email'], user_data['name'], user_data.get('picture')))
    
    conn.commit()
    conn.close()

def save_message(chat_id: str, role: str, content: str):
    """Save a message to the database"""
    conn = sqlite3.connect('eezlegal.db')
    cursor = conn.cursor()
    
    message_id = str(uuid.uuid4())
    cursor.execute('''
        INSERT INTO messages (id, chat_id, role, content)
        VALUES (?, ?, ?, ?)
    ''', (message_id, chat_id, role, content))
    
    conn.commit()
    conn.close()

def get_chat_messages(chat_id: str):
    """Get messages for a specific chat"""
    conn = sqlite3.connect('eezlegal.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT role, content FROM messages 
        WHERE chat_id = ? 
        ORDER BY created_at ASC
    ''', (chat_id,))
    
    messages = [{"role": row[0], "content": row[1]} for row in cursor.fetchall()]
    conn.close()
    return messages

def get_user_chats(user_id: str):
    """Get all chats for a user"""
    conn = sqlite3.connect('eezlegal.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT id, title, created_at FROM chats 
        WHERE user_id = ? 
        ORDER BY updated_at DESC
    ''', (user_id,))
    
    chats = [{"id": row[0], "title": row[1], "created_at": row[2]} for row in cursor.fetchall()]
    conn.close()
    return chats

def create_chat(user_id: str, title: str = "New Chat"):
    """Create a new chat"""
    conn = sqlite3.connect('eezlegal.db')
    cursor = conn.cursor()
    
    chat_id = str(uuid.uuid4())
    cursor.execute('''
        INSERT INTO chats (id, user_id, title)
        VALUES (?, ?, ?)
    ''', (chat_id, user_id, title))
    
    conn.commit()
    conn.close()
    return chat_id

def update_chat_title(chat_id: str, title: str):
    """Update chat title"""
    conn = sqlite3.connect('eezlegal.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE chats SET title = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ''', (title, chat_id))
    
    conn.commit()
    conn.close()

# Enhanced OpenAI integration with all fixes
async def get_ai_response(message: str, chat_history: List = None, user_name: str = None) -> str:
    """Get AI response using OpenAI API with all fixes applied"""
    
    if not OPENAI_API_KEY or not AsyncOpenAI:
        # Enhanced fallback response when OpenAI is not configured
        user_context = f" {user_name}," if user_name else ""
        return f"""Hello{user_context} I'm EezLegal AI, your professional legal assistant. 

I received your message: "{message}"

While I'm currently in demo mode, I'm designed to help you with:
• Legal questions and general guidance
• Document review and analysis
• Contract interpretation
• Legal research assistance
• Compliance questions
• Legal procedure explanations

**Important:** I provide legal information and guidance, but I cannot replace professional legal advice from a licensed attorney. For specific legal matters, please consult with a qualified lawyer.

How can I assist you with your legal needs today?"""
    
    try:
        # Create OpenAI client with proper error handling
        client = AsyncOpenAI(api_key=OPENAI_API_KEY)
        
        # Prepare conversation context with enhanced system prompt
        messages = [
            {
                "role": "system",
                "content": """You are EezLegal AI, a professional and knowledgeable legal assistant. You provide helpful, accurate, and ethical legal guidance while maintaining the highest standards of professionalism.

**Your Role:**
- Provide clear, actionable legal information and guidance
- Help users understand legal concepts, procedures, and documents
- Offer practical advice for common legal situations
- Assist with legal research and document analysis

**Key Guidelines:**
- Be professional, empathetic, and supportive in your responses
- Use clear, plain language that non-lawyers can understand
- Provide comprehensive yet concise answers
- Always include relevant disclaimers about professional legal advice
- Focus on education and general guidance rather than specific legal advice
- Be helpful while maintaining ethical boundaries

**Important Disclaimers:**
- Always remind users that you provide legal information, not legal advice
- Recommend consulting with a licensed attorney for specific legal matters
- Clarify that you cannot replace professional legal counsel
- Emphasize the importance of professional legal representation when appropriate

**Response Style:**
- Be conversational yet professional
- Structure responses clearly with bullet points or sections when helpful
- Provide practical next steps when possible
- Show empathy for the user's legal concerns

Remember: You are an AI assistant providing legal information and guidance, not a licensed attorney providing legal advice."""
            }
        ]
        
        # Add chat history if available (last 8 messages for context)
        if chat_history:
            for msg in chat_history[-8:]:
                messages.append({
                    "role": msg['role'],
                    "content": msg['content']
                })
        
        # Add current user message
        messages.append({
            "role": "user",
            "content": message
        })
        
        # Try multiple models with fallback (as suggested by ChatGPT analysis)
        models_to_try = ["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo"]
        
        for model in models_to_try:
            try:
                # Call OpenAI API with improved parameters using new client
                response = await client.chat.completions.create(
                    model=model,
                    messages=messages,
                    max_tokens=1500,
                    temperature=0.7,
                    top_p=0.9,
                    frequency_penalty=0.1,
                    presence_penalty=0.1
                )
                
                ai_response = response.choices[0].message.content.strip()
                logger.info(f"✅ OpenAI response generated successfully with {model} ({len(ai_response)} chars)")
                return ai_response
                
            except Exception as model_error:
                logger.warning(f"Model {model} failed: {str(model_error)}")
                continue
        
        # If all models fail
        return "I'm experiencing technical difficulties with my AI service. Please try again in a moment. I'm here to help with your legal questions as soon as possible."
        
    except Exception as e:
        logger.error(f"OpenAI API error: {str(e)}")
        return f"I'm temporarily experiencing technical issues. Please try again in a moment. I'm committed to helping you with your legal needs."

# API Routes
@app.get("/")
async def root():
    return {"message": "EezLegal API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.get("/auth/google")
async def google_auth():
    """Initiate Google OAuth flow"""
    railway_url = get_railway_url()
    
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": f"{railway_url}/auth/google/callback",
        "scope": "openid email profile",
        "response_type": "code",
        "access_type": "offline",
        "prompt": "consent"
    }
    
    # Add CORS headers for the specific endpoints
    allowed_origins = [
        "/auth/google", "/auth/google/callback", "/api/auth/verify"
    ]
    
    query_string = "&".join([f"{k}={v}" for k, v in params.items()])
    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{query_string}"
    
    return RedirectResponse(url=auth_url)

@app.get("/auth/google/callback")
async def google_callback(code: str = None, error: str = None):
    """Handle Google OAuth callback"""
    railway_url = get_railway_url()
    redirect_uri = f"{railway_url}/auth/google/callback"
    
    logger.info(f"📥 OAuth callback received - code: {'✅' if code else '❌'}, error: {error}")
    
    if error:
        logger.error(f"OAuth error: {error}")
        return RedirectResponse(url=f"{FRONTEND_URL}/login/?error={error}")
    
    if not code:
        logger.error("No authorization code received")
        return RedirectResponse(url=f"{FRONTEND_URL}/login/?error=no_code")
    
    try:
        # Exchange code for tokens
        async with httpx.AsyncClient() as client:
            token_data = {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": redirect_uri,
            }
            
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data=token_data
            )
            
            if token_response.status_code != 200:
                logger.error(f"Token exchange failed: {token_response.status_code}")
                return RedirectResponse(url=f"{FRONTEND_URL}/login/?error=token_exchange_failed")
            
            tokens = token_response.json()
            access_token = tokens.get("access_token")
            
            if not access_token:
                logger.error("No access token received")
                return RedirectResponse(url=f"{FRONTEND_URL}/login/?error=no_access_token")
            
            # Get user info from Google
            user_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if user_response.status_code != 200:
                logger.error(f"User info fetch failed: {user_response.status_code}")
                return RedirectResponse(url=f"{FRONTEND_URL}/login/?error=user_info_failed")
            
            user_info = user_response.json()
            logger.info(f"✅ User authenticated: {user_info.get('email')}")
            
            # Save user to database
            user_data = {
                "user_id": user_info["id"],
                "email": user_info["email"],
                "name": user_info["name"],
                "picture": user_info.get("picture")
            }
            save_user(user_data)
            
            # Create JWT token
            jwt_payload = {
                "user_id": user_info["id"],
                "email": user_info["email"],
                "name": user_info["name"],
                "picture": user_info.get("picture"),
                "exp": datetime.utcnow() + timedelta(days=7)
            }
            
            jwt_token = jwt.encode(jwt_payload, SECRET_KEY, algorithm="HS256")
            
            # Redirect to dashboard
            success_url = f"{FRONTEND_URL}/dashboard/?token={jwt_token}"
            logger.info(f"🎉 OAuth successful, redirecting to dashboard")
            
            return RedirectResponse(url=success_url)
            
    except Exception as e:
        logger.error(f"OAuth callback error: {str(e)}")
        return RedirectResponse(url=f"{FRONTEND_URL}/login/?error=oauth_failed")

@app.post("/api/auth/verify")
async def verify_token(token_data: TokenVerification):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token_data.token, SECRET_KEY, algorithms=["HS256"])
        return {"valid": True, "user": payload}
    except jwt.ExpiredSignatureError:
        return {"valid": False, "error": "Token expired"}
    except jwt.InvalidTokenError:
        return {"valid": False, "error": "Invalid token"}

@app.post("/api/chat")
async def chat_endpoint(message: ChatMessage, authorization: str = None):
    """Handle chat messages with enhanced OpenAI integration"""
    try:
        # Get user info if authenticated
        user = None
        if authorization:
            try:
                user = get_current_user(authorization)
            except HTTPException:
                pass  # Continue without user context
        
        # Get or create chat
        chat_id = message.chat_id
        if not chat_id and user:
            chat_id = create_chat(user['user_id'])
        
        # Get chat history for context
        chat_history = []
        if chat_id:
            chat_history = get_chat_messages(chat_id)
        
        # Save user message if we have a chat_id
        if chat_id:
            save_message(chat_id, 'user', message.message)
        
        # Get AI response using enhanced OpenAI integration
        user_name = user['name'] if user else None
        ai_response = await get_ai_response(message.message, chat_history, user_name)
        
        # Save AI response if we have a chat_id
        if chat_id:
            save_message(chat_id, 'assistant', ai_response)
            
            # Update chat title if this is the first exchange
            if len(chat_history) == 0:
                # Generate a better title from the first message
                title_words = message.message.split()[:8]  # First 8 words
                new_title = " ".join(title_words)
                if len(message.message) > len(new_title):
                    new_title += "..."
                update_chat_title(chat_id, new_title)
        
        return ChatResponse(
            response=ai_response,
            chat_id=chat_id or "demo",
            status="success"
        )
        
    except Exception as e:
        logger.error(f"Chat endpoint error: {str(e)}")
        return ChatResponse(
            response="I apologize, but I'm experiencing technical difficulties. Please try again in a moment. I'm here to help with your legal questions.",
            chat_id=message.chat_id or "demo",
            status="error"
        )

@app.get("/api/chats")
async def get_chats(authorization: str = None):
    """Get user's chat history"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    user = get_current_user(authorization)
    chats = get_user_chats(user['user_id'])
    return chats

@app.get("/api/chats/{chat_id}")
async def get_chat(chat_id: str, authorization: str = None):
    """Get specific chat with messages"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization required")
    
    user = get_current_user(authorization)
    messages = get_chat_messages(chat_id)
    return {"chat_id": chat_id, "messages": messages}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
