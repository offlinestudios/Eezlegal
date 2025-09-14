from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from werkzeug.security import generate_password_hash, check_password_hash
from src.models.user import User
import re

auth = Blueprint('auth', __name__)

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
        
        if not email or not password:
            return render_template('login.html', error='Please fill in all fields')
        
        if not is_valid_email(email):
            return render_template('login.html', error='Please enter a valid email address')
        
        # Check if user exists and password is correct
        user = User.get_by_email(email)
        if user and check_password_hash(user.password_hash, password):
            # Login successful
            session['user_id'] = user.id
            session['user_name'] = user.name
            session['user_email'] = user.email
            
            # Redirect to dashboard or intended page
            next_page = request.args.get('next')
            return redirect(next_page or url_for('main.dashboard'))
        else:
            return render_template('login.html', error='Invalid email or password')
    
    # If user is already logged in, redirect to dashboard
    if 'user_id' in session:
        return redirect(url_for('main.dashboard'))
    
    return render_template('login.html')

@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')
        
        # Validation
        if not all([name, email, password, confirm_password]):
            return render_template('signup.html', error='Please fill in all fields')
        
        if not is_valid_email(email):
            return render_template('signup.html', error='Please enter a valid email address')
        
        if not is_valid_password(password):
            return render_template('signup.html', error='Password must be at least 8 characters long')
        
        if password != confirm_password:
            return render_template('signup.html', error='Passwords do not match')
        
        # Check if user already exists
        if User.get_by_email(email):
            return render_template('signup.html', error='An account with this email already exists')
        
        # Create new user
        try:
            password_hash = generate_password_hash(password)
            user = User.create(name=name, email=email, password_hash=password_hash)
            
            # Login the user
            session['user_id'] = user.id
            session['user_name'] = user.name
            session['user_email'] = user.email
            
            flash('Account created successfully!', 'success')
            return redirect(url_for('main.dashboard'))
            
        except Exception as e:
            return render_template('signup.html', error='An error occurred while creating your account')
    
    # If user is already logged in, redirect to dashboard
    if 'user_id' in session:
        return redirect(url_for('main.dashboard'))
    
    return render_template('signup.html')

@auth.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out successfully', 'info')
    return redirect(url_for('main.index'))

def login_required(f):
    """Decorator to require login for routes"""
    from functools import wraps
    
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('auth.login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

