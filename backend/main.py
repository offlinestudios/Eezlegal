import os
from flask import Flask, jsonify
from flask_cors import CORS
from models.user import db
from routes.user import user_bp
from routes.simple_chat import simple_chat_bp
from routes.auth import auth

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'asdf#FGSgvasgf$5$WGT')

# Enable CORS for frontend domain
CORS(app, origins=[
    "http://localhost:3000",  # Local development
    "https://*.vercel.app",   # Vercel deployments
    "https://your-frontend-domain.vercel.app"  # Your specific frontend domain
])

# Register API blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(simple_chat_bp, url_prefix='/api')
app.register_blueprint(auth)

# Database configuration
database_url = os.environ.get('DATABASE_URL')
if database_url:
    # Production database (PostgreSQL on Railway)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    # Local development database (SQLite)
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()

# Health check endpoint
@app.route('/health')
def health_check():
    return jsonify({"status": "healthy", "service": "eezlegal-backend"})

# API info endpoint
@app.route('/api')
def api_info():
    return jsonify({
        "service": "EezLegal Backend API",
        "version": "1.0.0",
        "endpoints": {
            "chat": "/api/chat",
            "auth": "/api/auth",
            "user": "/api/user"
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

