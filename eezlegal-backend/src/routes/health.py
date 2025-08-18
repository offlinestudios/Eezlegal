from flask import Blueprint, jsonify
health_bp=Blueprint('health',__name__)
@health_bp.route('/health')
def h(): return jsonify({'status':'healthy'})
