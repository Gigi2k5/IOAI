"""
Décorateurs personnalisés pour les routes
"""
from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt, verify_jwt_in_request


def admin_required():
    """
    Décorateur pour les routes réservées aux admins
    Usage: @admin_required()
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            role = claims.get('role', '')
            
            if role not in ['admin', 'super_admin']:
                return jsonify({
                    'success': False,
                    'error': 'Accès réservé aux administrateurs'
                }), 403
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator


def super_admin_required():
    """
    Décorateur pour les routes réservées aux super admins
    Usage: @super_admin_required()
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            role = claims.get('role', '')
            
            if role != 'super_admin':
                return jsonify({
                    'success': False,
                    'error': 'Accès réservé aux super administrateurs'
                }), 403
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator


def candidate_required():
    """
    Décorateur pour les routes réservées aux candidats
    Usage: @candidate_required()
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            role = claims.get('role', '')
            
            if role != 'candidate':
                return jsonify({
                    'success': False,
                    'error': 'Accès réservé aux candidats'
                }), 403
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator


def roles_required(*allowed_roles):
    """
    Décorateur pour les routes avec rôles spécifiques
    Usage: @roles_required('admin', 'candidate')
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            role = claims.get('role', '')
            
            if role not in allowed_roles:
                return jsonify({
                    'success': False,
                    'error': f'Accès réservé aux: {", ".join(allowed_roles)}'
                }), 403
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator
