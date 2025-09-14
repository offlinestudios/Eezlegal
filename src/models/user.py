from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=True)  # Nullable for OAuth users
    oauth_provider = db.Column(db.String(50), nullable=True)  # 'google', 'facebook', etc.
    oauth_id = db.Column(db.String(100), nullable=True)  # OAuth provider user ID
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<User {self.email}>'

    @classmethod
    def create(cls, name, email, password_hash=None, oauth_provider=None, oauth_id=None):
        """Create a new user"""
        try:
            user = cls(
                name=name,
                email=email,
                password_hash=password_hash,
                oauth_provider=oauth_provider,
                oauth_id=oauth_id
            )
            db.session.add(user)
            db.session.commit()
            return user
        except Exception as e:
            db.session.rollback()
            print(f"Error creating user: {e}")
            return None

    @classmethod
    def get_by_email(cls, email):
        """Get user by email"""
        return cls.query.filter_by(email=email).first()

    @classmethod
    def get_by_id(cls, user_id):
        """Get user by ID"""
        return cls.query.get(user_id)

    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'oauth_provider': self.oauth_provider,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

