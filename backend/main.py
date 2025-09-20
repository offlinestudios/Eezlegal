from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from authlib.integrations.starlette_client import OAuth
from starlette.middleware.sessions import SessionMiddleware
import jwt
import sqlite3
import json
import os
from datetime import datetime, timedelta
import httpx
from openai import AsyncOpenAI
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add session middleware
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY", "your-secret-key-here"))

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.eezlegal.com", "https://eezlegal.com", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth setup
oauth = OAuth()
oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid_configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

# OpenAI setup
openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# JWT settings
JWT_SECRET = os.getenv("JWT_SECRET", "your-jwt-secret-key")
JWT_ALGORITHM = "HS256"

# Security
security = HTTPBearer()

# Database setup
def init_db():
    conn = sqlite3.connect('eezlegal.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            google_id TEXT UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT,
            messages TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database
init_db()

def create_jwt_token(user_data):
    payload = {
        "user_id": user_data["id"],
        "email": user_data["email"],
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_jwt_token(token: str):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_jwt_token(token)
    return payload

@app.get("/")
async def root():
    return {"message": "EezLegal API is running", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.get("/auth/google")
async def google_auth(request: Request):
    try:
        redirect_uri = f"{request.base_url}auth/callback"
        return await oauth.google.authorize_redirect(request, redirect_uri)
    except Exception as e:
        logger.error(f"Google auth error: {e}")
        raise HTTPException(status_code=500, detail="Authentication failed")

@app.get("/auth/callback")
async def google_callback(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')
        
        if not user_info:
            raise HTTPException(status_code=400, detail="Failed to get user info")
        
        # Store or update user in database
        conn = sqlite3.connect('eezlegal.db')
        cursor = conn.cursor()
        
        cursor.execute(
            "INSERT OR REPLACE INTO users (email, name, google_id) VALUES (?, ?, ?)",
            (user_info['email'], user_info['name'], user_info['sub'])
        )
        
        cursor.execute("SELECT id, email, name FROM users WHERE email = ?", (user_info['email'],))
        user = cursor.fetchone()
        conn.commit()
        conn.close()
        
        if not user:
            raise HTTPException(status_code=500, detail="Failed to create user")
        
        user_data = {"id": user[0], "email": user[1], "name": user[2]}
        jwt_token = create_jwt_token(user_data)
        
        # Redirect to dashboard with token
        frontend_url = os.getenv("FRONTEND_URL", "https://www.eezlegal.com")
        return RedirectResponse(url=f"{frontend_url}/dashboard/?token={jwt_token}")
        
    except Exception as e:
        logger.error(f"Callback error: {e}")
        frontend_url = os.getenv("FRONTEND_URL", "https://www.eezlegal.com")
        return RedirectResponse(url=f"{frontend_url}/login/?error=auth_failed")

@app.post("/api/chat")
async def chat_endpoint(request: Request, current_user: dict = Depends(get_current_user)):
    try:
        data = await request.json()
        message = data.get("message", "").strip()
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        # Get AI response
        try:
            response = await openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful legal assistant. Provide professional legal guidance while noting that this is not formal legal advice and users should consult with qualified attorneys for specific legal matters."},
                    {"role": "user", "content": message}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content
            
        except Exception as openai_error:
            logger.error(f"OpenAI error: {openai_error}")
            ai_response = "I apologize, but I'm currently experiencing technical difficulties. Please try again in a moment, or contact support if the issue persists."
        
        # Store chat in database
        try:
            conn = sqlite3.connect('eezlegal.db')
            cursor = conn.cursor()
            
            chat_messages = [
                {"role": "user", "content": message, "timestamp": datetime.utcnow().isoformat()},
                {"role": "assistant", "content": ai_response, "timestamp": datetime.utcnow().isoformat()}
            ]
            
            cursor.execute(
                "INSERT INTO chats (user_id, title, messages) VALUES (?, ?, ?)",
                (current_user["user_id"], message[:50] + "..." if len(message) > 50 else message, json.dumps(chat_messages))
            )
            
            conn.commit()
            conn.close()
            
        except Exception as db_error:
            logger.error(f"Database error: {db_error}")
            # Continue even if database fails
        
        return JSONResponse({
            "response": ai_response,
            "status": "success"
        })
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process chat message")

@app.get("/api/chats")
async def get_chats(current_user: dict = Depends(get_current_user)):
    try:
        conn = sqlite3.connect('eezlegal.db')
        cursor = conn.cursor()
        
        cursor.execute(
            "SELECT id, title, created_at FROM chats WHERE user_id = ? ORDER BY updated_at DESC",
            (current_user["user_id"],)
        )
        
        chats = []
        for row in cursor.fetchall():
            chats.append({
                "id": row[0],
                "title": row[1],
                "created_at": row[2]
            })
        
        conn.close()
        return JSONResponse({"chats": chats})
        
    except Exception as e:
        logger.error(f"Get chats error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve chats")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
