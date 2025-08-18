import os
import sys
from flask import Flask, send_from_directory
from flask_cors import CORS

# Make 'src' importable
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.models.user import db
from src.routes.user import user_bp
from src.routes.chat import chat_bp
from src.routes.files import files_bp
from src.routes.health import health_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), "static"))
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "change-me")

# Database (fallback to sqlite so boot never fails)
db_url = os.environ.get("DATABASE_URL") or "sqlite:////tmp/eezlegal.db"
app.config["SQLALCHEMY_DATABASE_URI"] = db_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

CORS(app, origins="*")

with app.app_context():
    db.init_app(app)
    try:
        db.create_all()
    except Exception as e:
        print(f"[boot] WARNING: failed to create tables: {e}")

# APIs
app.register_blueprint(user_bp, url_prefix="/api")
app.register_blueprint(chat_bp, url_prefix="/api")
app.register_blueprint(files_bp, url_prefix="/api")
app.register_blueprint(health_bp, url_prefix="/api")

# Serve SPA
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path: str):
    static_folder_path = app.static_folder
    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    index_path = os.path.join(static_folder_path, "index.html")
    if os.path.exists(index_path):
        return send_from_directory(static_folder_path, "index.html")
    return "index.html not found", 404

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"[boot] starting on 0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)
