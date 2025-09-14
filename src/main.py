import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, render_template, session, redirect, url_for
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp
from src.routes.simple_chat import simple_chat_bp
from src.routes.auth import auth, login_required
import datetime

app = Flask(__name__, 
           static_folder=os.path.join(os.path.dirname(__file__), 'static'),
           template_folder=os.path.join(os.path.dirname(__file__), 'templates'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Enable CORS for all routes
CORS(app)

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(simple_chat_bp, url_prefix='/api')
app.register_blueprint(auth)

# uncomment if you need to use database
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
with app.app_context():
    db.create_all()

@app.route('/dashboard')
@login_required
def dashboard():
    user = {
        'id': session['user_id'],
        'name': session['user_name'],
        'email': session['user_email']
    }
    
    # Get recent chats for this user (placeholder for now)
    recent_chats = []
    
    # Get current chat messages (placeholder for now)
    chat_messages = []
    
    return render_template('dashboard.html', 
                         user=user,
                         recent_chats=recent_chats,
                         chat_messages=chat_messages,
                         current_chat_id=None,
                         current_year=datetime.datetime.now().year)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # Handle auth routes first
    if path in ['login', 'signup']:
        return redirect(url_for(f'auth.{path}'))
    
    # If user is logged in and accessing root, redirect to dashboard
    if path == '' and 'user_id' in session:
        return redirect(url_for('dashboard'))
    
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

