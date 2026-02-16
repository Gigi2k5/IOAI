"""
Routes de santé et statut de l'API
"""
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app import db
from app.utils import admin_required

bp = Blueprint('health', __name__)


@bp.route('/health')
def health():
    """Vérifie que l'API fonctionne"""
    return jsonify({
        'status': 'healthy',
        'service': 'Olympiades IA Bénin API',
        'version': '1.0.0'
    })


@bp.route('/health/db')
def health_db():
    """Vérifie la connexion à la base de données"""
    try:
        db.session.execute(db.text('SELECT 1'))
        return jsonify({
            'status': 'healthy',
            'database': 'connected'
        })
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'database': 'disconnected',
            'error': str(e)
        }), 500


@bp.route('/health/auth')
@jwt_required()
def health_auth():
    """Vérifie que l'authentification fonctionne (route protégée)"""
    user_id = get_jwt_identity()
    claims = get_jwt()
    
    return jsonify({
        'status': 'authenticated',
        'user_id': user_id,
        'role': claims.get('role'),
        'email': claims.get('email')
    })


@bp.route('/health/admin')
@admin_required()
def health_admin():
    """Vérifie l'accès admin (route protégée admin)"""
    user_id = get_jwt_identity()
    claims = get_jwt()
    
    return jsonify({
        'status': 'admin_access',
        'user_id': user_id,
        'role': claims.get('role')
    })


@bp.route('/stats/public')
def public_stats():
    """Statistiques publiques pour la page d'accueil"""
    from app.models import Candidate
    
    try:
        total_candidates = Candidate.query.count()
        validated = Candidate.query.filter_by(status='validated').count()
    except:
        # Si la table n'existe pas encore, retourner 0
        total_candidates = 0
        validated = 0
    
    return jsonify({
        'total_candidates': total_candidates,
        'validated_candidates': validated
    })
