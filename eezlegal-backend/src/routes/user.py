from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError
from src.models.user import User, db
user_bp = Blueprint('user', __name__)
@user_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])
