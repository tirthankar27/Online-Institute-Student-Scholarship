from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.extensions import db, jwt
import os


# Import blueprints
from app.modules.auth.routes.routes import auth_bp
from app.modules.scholarship.routes.routes import scholarship_bp
from app.modules.application.routes.routes import application_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # Initialize extensions
    CORS(app)
    db.init_app(app)
    jwt.init_app(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(scholarship_bp, url_prefix="/api/scholarships")
    app.register_blueprint(application_bp, url_prefix="/api/applications")

    @app.route("/api", methods=["GET"])
    def home():
        return {"message": "Scholarship API Running!"}

    return app