"""
Application Factory - Point d'entrée principal
"""
import logging
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from config import config

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Extensions Flask
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per hour"],
    storage_uri="memory://"
)


def create_app(config_name='default'):
    """
    Factory pattern pour créer l'application Flask
    """
    app = Flask(__name__)
    
    # Charger la configuration
    app.config.from_object(config[config_name])
    
    # Initialiser les extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    limiter.init_app(app)
    
    # Configurer CORS
    CORS(app, 
         origins=[
             "https://ioai.vercel.app",
             "https://ioai1.vercel.app",
             "http://localhost:5173"
         ],
         supports_credentials=True,
         allow_headers=['Content-Type', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'])
    
    @app.after_request
    def after_request(response):
        origin = response.headers.get('Access-Control-Allow-Origin')
        if not origin:
            response.headers['Access-Control-Allow-Origin'] = 'https://ioai1.vercel.app'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response
    
    # === Callbacks JWT ===
    
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'success': False,
            'error': 'Token expiré',
            'code': 'TOKEN_EXPIRED'
        }), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        logger.warning(f"Invalid token: {error}")
        return jsonify({
            'success': False,
            'error': 'Token invalide',
            'code': 'TOKEN_INVALID'
        }), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        logger.warning(f"Missing token: {error}")
        return jsonify({
            'success': False,
            'error': 'Token manquant',
            'code': 'TOKEN_MISSING'
        }), 401
    
    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'success': False,
            'error': 'Token révoqué',
            'code': 'TOKEN_REVOKED'
        }), 401
    
    # === Error Handlers ===
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'success': False,
            'error': 'Requête invalide'
        }), 400
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'error': 'Ressource non trouvée'
        }), 404
    
    @app.errorhandler(429)
    def ratelimit_handler(error):
        return jsonify({
            'success': False,
            'error': 'Trop de requêtes. Veuillez réessayer plus tard.',
            'code': 'RATE_LIMITED'
        }), 429
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': 'Erreur interne du serveur'
        }), 500
    
    # === Routes ===
    
    # Enregistrer les blueprints
    from app.api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api/v1')
    
    # Route de santé (hors API)
    @app.route('/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'Olympiades IA Bénin API v1.0'
        })
    
    # Route pour servir les fichiers uploadés
    from flask import send_from_directory
    import os
    
    @app.route('/uploads/<path:filename>')
    def serve_upload(filename):
        upload_folder = app.config.get('UPLOAD_FOLDER', 'uploads')
        return send_from_directory(upload_folder, filename)
    
    # Créer les tables si elles n'existent pas
    with app.app_context():
        db.create_all()
    
    return app
