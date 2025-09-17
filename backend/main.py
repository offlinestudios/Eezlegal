import os
from flask import Flask, jsonify
from flask_cors import CORS

# Import local modules (fixed paths)
try:
    from models.user import db
    from routes.user import user_bp
    from routes.simple_chat import simple_chat_bp
    from routes.auth import auth
except ImportError:
    # Fallback for different import structure
    import sys
    sys.path.append(os.path.dirname(__file__))
    from models.user import db
    from routes.user import user_bp
    from routes.simple_chat import simple_chat_bp
    from routes.auth import auth

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'eezlegal-default-secret-key')

# Enable CORS for frontend domains
CORS(app, origins=[
    "http://localhost:3000",  # Local development
    "https://*.vercel.app",   # All Vercel deployments
    "https://eezlegal-git-main-julian-ross-projects.vercel.app",  # Specific Vercel domain
    "*"  # Allow all origins for now (can restrict later)
])

# Register API blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(simple_chat_bp, url_prefix='/api')
app.register_blueprint(auth)

# Database configuration
database_url = os.environ.get('DATABASE_URL')
if database_url:
    # Production database (PostgreSQL on Railway)
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    # Local development database (SQLite)
    db_path = os.path.join(os.path.dirname(__file__), 'database', 'app.db')
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db.init_app(app)

with app.app_context():
    try:
        db.create_all()
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"❌ Database initialization error: {e}")

# Health check endpoint (Railway requirement)
@app.route('/health')
def health_check():
    try:
        # Test database connection
        with app.app_context():
            db.engine.execute('SELECT 1')
        return jsonify({
            "status": "healthy", 
            "service": "eezlegal-backend",
            "database": "connected"
        }), 200
    except Exception as e:
        return jsonify({
            "status": "unhealthy", 
            "service": "eezlegal-backend",
            "error": str(e)
        }), 500

# API info endpoint
@app.route('/api')
def api_info():
    return jsonify({
        "service": "EezLegal Backend API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "chat": "/api/chat",
            "auth": "/api/auth",
            "user": "/api/user"
        }
    })

# Root endpoint
@app.route('/')
def root():
    return jsonify({
        "message": "EezLegal Backend API",
        "status": "running",
        "health_check": "/health",
        "api_info": "/api"
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    print(f"🚀 Starting EezLegal Backend on port {port}")
    print(f"🔧 Debug mode: {debug}")
    print(f"💾 Database: {'PostgreSQL (Railway)' if database_url else 'SQLite (Local)'}")
    
    app.run(
        host='0.0.0.0',  # Required for Railway
        port=port,
        debug=debug
    )

