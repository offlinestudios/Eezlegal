from flask import Blueprint, render_template, request, redirect, url_for, flash, session, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from src.models.user import User
import re
import os
from authlib.integrations.flask_client import OAuth
import requests

auth = Blueprint('auth', __name__)

# Initialize OAuth
oauth = OAuth()

def init_oauth(app):
    """Initialize OAuth with the Flask app"""
    oauth.init_app(app)
    
    # Configure Google OAuth
    google = oauth.register(
        name='google',
        client_id=os.getenv('GOOGLE_CLIENT_ID'),
        client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
        server_metadata_url='https://accounts.google.com/.well-known/openid_configuration',
        client_kwargs={
            'scope': 'openid email profile'
        }
    )
    return google

def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def is_valid_password(password):
    return len(password) >= 8

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        
        if not email:
            return render_template('login.html', error='Please enter your email address')
        
        if not is_valid_email(email):
            return render_template('login.html', error='Please enter a valid email address')
        
        # Check if user exists
        user = User.get_by_email(email)
        
        if not password:
            # First step: email provided, check if user exists
            if user:
                # User exists, they need to provide password
                return render_template('login.html', error='Please enter your password', email=email)
            else:
                # User doesn't exist, redirect to signup
                return redirect(url_for('auth.signup') + f'?email={email}')
        
        # Second step: both email and password provided
        if user and check_password_hash(user.password_hash, password):
            # Login successful
            session['user_id'] = user.id
            session['user_email'] = user.email
            session['user_name'] = user.name
            return redirect(url_for('auth.dashboard'))
        else:
            return render_template('login.html', error='Invalid email or password', email=email)
    
    return render_template('login.html')

@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    # Get email from query parameter if redirected from login
    prefilled_email = request.args.get('email', '')
    
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')
        name = request.form.get('name', '').strip()
        
        # If name is empty, generate from email
        if not name and email:
            name = email.split('@')[0].replace('.', ' ').replace('_', ' ').title()
        
        # Validation
        if not email:
            return render_template('signup.html', error='Please enter your email address', email=prefilled_email)
        
        if not is_valid_email(email):
            return render_template('signup.html', error='Please enter a valid email address', email=email)
        
        # Check if user already exists
        if User.get_by_email(email):
            return render_template('signup.html', error='An account with this email already exists. Try logging in instead.', email=email)
        
        if not password:
            # First step: email provided, show password fields
            return render_template('signup.html', email=email, show_password=True)
        
        # Second step: validate passwords
        if not is_valid_password(password):
            return render_template('signup.html', error='Password must be at least 8 characters long', email=email, show_password=True)
        
        if password != confirm_password:
            return render_template('signup.html', error='Passwords do not match', email=email, show_password=True)
        
        # Create new user
        password_hash = generate_password_hash(password)
        user = User.create(name=name, email=email, password_hash=password_hash)
        
        if user:
            # Auto-login after successful signup
            session['user_id'] = user.id
            session['user_email'] = user.email
            session['user_name'] = user.name
            return redirect(url_for('auth.dashboard'))
        else:
            return render_template('signup.html', error='Failed to create account. Please try again.', email=email, show_password=True)
    
    return render_template('signup.html', email=prefilled_email)

@auth.route('/auth/google')
def google_auth():
    """Initiate Google OAuth"""
    google = oauth.google
    redirect_uri = url_for('auth.google_callback', _external=True)
    return google.authorize_redirect(redirect_uri)

@auth.route('/auth/google/callback')
def google_callback():
    """Handle Google OAuth callback"""
    try:
        google = oauth.google
        token = google.authorize_access_token()
        user_info = token.get('userinfo')
        
        if user_info:
            email = user_info.get('email')
            name = user_info.get('name')
            
            if not email:
                flash('Failed to get email from Google account', 'error')
                return redirect(url_for('auth.login'))
            
            # Check if user exists
            user = User.get_by_email(email)
            
            if not user:
                # Create new user with Google account
                user = User.create(
                    name=name or email.split('@')[0],
                    email=email,
                    password_hash=None,  # No password for OAuth users
                    oauth_provider='google',
                    oauth_id=user_info.get('sub')
                )
            
            if user:
                # Login the user
                session['user_id'] = user.id
                session['user_email'] = user.email
                session['user_name'] = user.name
                return redirect(url_for('auth.dashboard'))
            else:
                flash('Failed to create account', 'error')
                return redirect(url_for('auth.login'))
        else:
            flash('Failed to get user information from Google', 'error')
            return redirect(url_for('auth.login'))
            
    except Exception as e:
        print(f"Google OAuth error: {e}")
        flash('Authentication failed', 'error')
        return redirect(url_for('auth.login'))

@auth.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('auth.login'))
    
    return render_template('dashboard.html', 
                         user_name=session.get('user_name'),
                         user_email=session.get('user_email'))

@auth.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('auth.login'))

