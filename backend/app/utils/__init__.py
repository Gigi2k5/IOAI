"""
Utilitaires et helpers
"""
from flask import jsonify as flask_jsonify


def format_response(data=None, message=None, success=True, status_code=200):
    """
    Formate une réponse API standard
    """
    response = {'success': success}
    if message:
        response['message'] = message
    if data is not None:
        response['data'] = data
    return flask_jsonify(response), status_code


def error_response(message, status_code=400, errors=None):
    """
    Formate une réponse d'erreur
    """
    response = {
        'success': False,
        'error': message
    }
    if errors:
        response['errors'] = errors
    return flask_jsonify(response), status_code


# Exporter les décorateurs
from app.utils.decorators import (
    admin_required,
    super_admin_required,
    candidate_required,
    roles_required
)

__all__ = [
    'format_response',
    'error_response',
    'admin_required',
    'super_admin_required', 
    'candidate_required',
    'roles_required'
]
