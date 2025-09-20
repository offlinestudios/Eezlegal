import os
import uvicorn
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
import jwt
import sqlite3
import json
from datetime import datetime, timedelta
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="EezLegal API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://www.eezlegal.com")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Database setup
def init_db():
    conn = sqlite3.connect('eezlegal.db')
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            picture TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Chats table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chats (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Messages table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chat_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (chat_id) REFERENCES chats (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database
init_db()

# Pydantic models
class ChatMessage(BaseModel):
    message: str
    chat_id: str = None

class TokenRequest(BaseModel):
    token: str

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# Root endpoint
@app.get("/")
async def root():
    return {"message": "EezLegal API is running", "status": "ok"}

# OAuth callback (simplified)
@app.get("/auth/google/callback")
async def google_callback(code: str = None, state: str = None):
    try:
        # For now, create a demo user
        user_data = {
            "id": "demo_user",
            "email": "demo@eezlegal.com", 
            "name": "Demo User",
            "picture": None
        }
        
        # Create JWT token
        token_data = {
            "user_id": user_data["id"],
            "email": user_data["email"],
            "exp": datetime.utcnow() + timedelta(days=30)
        }
        
        token = jwt.encode(token_data, SECRET_KEY, algorithm="HS256")
        
        # Store user in database
        conn = sqlite3.connect('eezlegal.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT OR REPLACE INTO users (id, email, name, picture)
            VALUES (?, ?, ?, ?)
        ''', (user_data["id"], user_data["email"], user_data["name"], user_data["picture"]))
        conn.commit()
        conn.close()
        
        # Redirect to dashboard with token
        return RedirectResponse(url=f"{FRONTEND_URL}/dashboard/?token={token}")
        
    except Exception as e:
        logger.error(f"OAuth callback error: {e}")
        return RedirectResponse(url=f"{FRONTEND_URL}/login/?error=auth_failed")

# Verify token
@app.post("/api/auth/verify")
async def verify_token(request: TokenRequest):
    try:
        payload = jwt.decode(request.token, SECRET_KEY, algorithms=["HS256"])
        
        # Get user from database
        conn = sqlite3.connect('eezlegal.db')
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE id = ?', (payload["user_id"],))
        user_row = cursor.fetchone()
        conn.close()
        
        if user_row:
            user = {
                "id": user_row[0],
                "email": user_row[1], 
                "name": user_row[2],
                "picture": user_row[3]
            }
            return {"valid": True, "user": user}
        else:
            return {"valid": False}
            
    except jwt.ExpiredSignatureError:
        return {"valid": False, "error": "Token expired"}
    except jwt.InvalidTokenError:
        return {"valid": False, "error": "Invalid token"}

# Chat endpoint
@app.post("/api/chat")
async def chat_endpoint(message: ChatMessage, request: Request):
    try:
        # Get user from token (simplified)
        auth_header = request.headers.get("authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
                user_id = payload["user_id"]
            except:
                user_id = "demo_user"
        else:
            user_id = "demo_user"
        
        # Create or get chat
        conn = sqlite3.connect('eezlegal.db')
        cursor = conn.cursor()
        
        if message.chat_id:
            chat_id = message.chat_id
        else:
            # Create new chat
            import uuid
            chat_id = str(uuid.uuid4())
            title = message.message[:50] + "..." if len(message.message) > 50 else message.message
            
            cursor.execute('''
                INSERT INTO chats (id, user_id, title)
                VALUES (?, ?, ?)
            ''', (chat_id, user_id, title))
        
        # Save user message
        cursor.execute('''
            INSERT INTO messages (chat_id, role, content)
            VALUES (?, ?, ?)
        ''', (chat_id, "user", message.message))
        
        # Generate AI response (fallback if OpenAI fails)
        ai_response = "I'm here to help with your legal questions. However, I'm currently experiencing some technical difficulties with my AI service. Please try again in a moment, or contact support if the issue persists."
        
        # Try OpenAI if available
        if OPENAI_API_KEY:
            try:
                import openai
                client = openai.OpenAI(api_key=OPENAI_API_KEY)
                
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": "You are EezLegal, a professional AI legal assistant. Provide helpful, accurate legal guidance while reminding users to consult with qualified attorneys for specific legal matters."},
                        {"role": "user", "content": message.message}
                    ],
                    max_tokens=500,
                    temperature=0.7
                )
                
                ai_response = response.choices[0].message.content
                
            except Exception as e:
                logger.error(f"OpenAI error: {e}")
                # Keep fallback response
        
        # Save AI response
        cursor.execute('''
            INSERT INTO messages (chat_id, role, content)
            VALUES (?, ?, ?)
        ''', (chat_id, "assistant", ai_response))
        
        conn.commit()
        conn.close()
        
        return {
            "status": "success",
            "response": ai_response,
            "chat_id": chat_id
        }
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        return {
            "status": "error",
            "message": "Sorry, I encountered an error. Please try again."
        }

# Get chats
@app.get("/api/chats")
async def get_chats(request: Request):
    try:
        # Get user from token (simplified)
        auth_header = request.headers.get("authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
                user_id = payload["user_id"]
            except:
                user_id = "demo_user"
        else:
            user_id = "demo_user"
        
        conn = sqlite3.connect('eezlegal.db')
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, title, created_at FROM chats 
            WHERE user_id = ? 
            ORDER BY created_at DESC
        ''', (user_id,))
        
        chats = []
        for row in cursor.fetchall():
            chats.append({
                "id": row[0],
                "title": row[1],
                "created_at": row[2]
            })
        
        conn.close()
        return chats
        
    except Exception as e:
        logger.error(f"Get chats error: {e}")
        return []

# Get specific chat
@app.get("/api/chats/{chat_id}")
async def get_chat(chat_id: str, request: Request):
    try:
        conn = sqlite3.connect('eezlegal.db')
        cursor = conn.cursor()
        cursor.execute('''
            SELECT role, content, created_at FROM messages 
            WHERE chat_id = ? 
            ORDER BY created_at ASC
        ''', (chat_id,))
        
        messages = []
        for row in cursor.fetchall():
            messages.append({
                "role": row[0],
                "content": row[1],
                "created_at": row[2]
            })
        
        conn.close()
        return {"messages": messages}
        
    except Exception as e:
        logger.error(f"Get chat error: {e}")
        return {"messages": []}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
