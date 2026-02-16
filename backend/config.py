"""
Configuration de l'application Flask
"""
import os
from datetime import timedelta
from dotenv import load_dotenv

# Charger le fichier .env (seulement en local)
load_dotenv()

# Chemin absolu du dossier backend
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


class Config:
    """Configuration de base"""
    
    # Clés secrètes depuis les variables d'environnement
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'dev-jwt-key-change-in-production')
    
    # Configuration JWT
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(seconds=int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES', 3600)))
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(seconds=int(os.environ.get('JWT_REFRESH_TOKEN_EXPIRES', 2592000)))
    
    # Configuration base de données - PostgreSQL par défaut
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        'postgresql://olympiades_user:olympiades_pass@localhost:5432/olympiades_ia_dev'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    
    # Options du pool de connexions - évite les erreurs SSL avec PostgreSQL
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
        'pool_size': 5,
        'max_overflow': 10,
    }
    
    # Configuration CORS - IMPORTANT pour le déploiement
    cors_origins = os.environ.get('CORS_ORIGINS', 'http://localhost:5173,http://localhost:3000')
    CORS_ORIGINS = [origin.strip() for origin in cors_origins.split(',') if origin.strip()]
    
    # Configuration uploads
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 Mo max
    ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'avif'}
    ALLOWED_DOC_EXTENSIONS = {'pdf'}
    MAX_IMAGE_SIZE = 5 * 1024 * 1024   # 5 MB
    MAX_DOC_SIZE = 10 * 1024 * 1024    # 10 MB
    
    # Configuration Email SMTP
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER')
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'True').lower() == 'true'
    
    # URL du frontend (pour les liens dans les emails)
    FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:5173')


class DevelopmentConfig(Config):
    """Configuration pour le développement"""
    DEBUG = True
    SQLALCHEMY_ECHO = False
    
    @staticmethod
    def init_app(app):
        db_url = app.config.get('SQLALCHEMY_DATABASE_URI', '')
        if db_url.startswith('postgres://'):
            app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace('postgres://', 'postgresql://', 1)


class ProductionConfig(Config):
    """Configuration pour la production"""
    DEBUG = False
    
    @staticmethod
    def init_app(app):
        db_url = app.config.get('SQLALCHEMY_DATABASE_URI', '')
        if db_url.startswith('postgres://'):
            app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace('postgres://', 'postgresql://', 1)


class TestingConfig(Config):
    """Configuration pour les tests"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
