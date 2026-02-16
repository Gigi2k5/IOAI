"""
Routes d'authentification
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    jwt_required, get_jwt_identity, get_jwt
)
from app import limiter
from app.services.auth_service import AuthService
from app.utils import format_response, error_response

bp = Blueprint('auth', __name__)


@bp.route('/register', methods=['POST'])
@limiter.limit("5 per minute")
def register():
    """
    Inscription d'un nouveau candidat
    
    Body:
        - email: string (required)
        - password: string (required, min 6 chars)
        - first_name: string (required)
        - last_name: string (required)
    """
    data = request.get_json() or {}
    
    # Validation
    required = ['email', 'password', 'first_name', 'last_name']
    missing = [f for f in required if not data.get(f)]
    if missing:
        return error_response(f"Champs requis: {', '.join(missing)}", 400)
    
    email = data['email'].strip()
    password = data['password']
    first_name = data['first_name'].strip()
    last_name = data['last_name'].strip()
    
    # Validation email basique
    if '@' not in email or '.' not in email:
        return error_response("Email invalide", 400)
    
    # Validation mot de passe
    if len(password) < 6:
        return error_response("Le mot de passe doit contenir au moins 6 caractères", 400)
    
    # Inscription
    user, error = AuthService.register(email, password, first_name, last_name)
    
    if error:
        return error_response(error, 400)
    
    # Connexion automatique après inscription
    tokens, _ = AuthService.login(email, password)
    
    return jsonify({
        'success': True,
        'message': 'Inscription réussie',
        'data': tokens
    }), 201


@bp.route('/login', methods=['POST'])
@limiter.limit("10 per minute")
def login():
    """
    Connexion utilisateur
    
    Body:
        - email: string (required)
        - password: string (required)
    """
    data = request.get_json() or {}
    
    email = data.get('email', '').strip()
    password = data.get('password', '')
    
    if not email or not password:
        return error_response("Email et mot de passe requis", 400)
    
    # Récupérer IP et User-Agent pour le log
    ip = request.remote_addr
    ua = request.headers.get('User-Agent', '')[:255]
    
    tokens, error = AuthService.login(email, password, ip, ua)
    
    if error:
        return error_response(error, 401)
    
    return jsonify({
        'success': True,
        'message': 'Connexion réussie',
        **tokens  # access_token, refresh_token, user
    })


@bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    """
    Récupère le profil de l'utilisateur connecté
    
    Headers:
        - Authorization: Bearer <access_token>
    """
    user_id = int(get_jwt_identity())
    
    user_data, error = AuthService.get_current_user(user_id)
    
    if error:
        return error_response(error, 404)
    
    return jsonify({
        'success': True,
        'data': user_data
    })


@bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """
    Rafraîchit le token d'accès
    
    Headers:
        - Authorization: Bearer <refresh_token>
    """
    user_id = int(get_jwt_identity())
    
    access_token, error = AuthService.refresh(user_id)
    
    if error:
        return error_response(error, 401)
    
    return jsonify({
        'success': True,
        'access_token': access_token
    })


@bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """
    Change le mot de passe de l'utilisateur connecté
    
    Body:
        - current_password: string (required)
        - new_password: string (required, min 6 chars)
    """
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    
    current_password = data.get('current_password', '')
    new_password = data.get('new_password', '')
    
    if not current_password or not new_password:
        return error_response("Mot de passe actuel et nouveau requis", 400)
    
    if len(new_password) < 6:
        return error_response("Le nouveau mot de passe doit contenir au moins 6 caractères", 400)
    
    success, error = AuthService.change_password(user_id, current_password, new_password)
    
    if not success:
        return error_response(error, 400)
    
    return jsonify({
        'success': True,
        'message': 'Mot de passe modifié avec succès'
    })


@bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """
    Déconnexion (côté client, invalider le token)
    
    Note: Avec JWT stateless, la déconnexion se fait côté client
    en supprimant le token. Pour une vraie invalidation,
    il faudrait une blacklist (Redis).
    """
    return jsonify({
        'success': True,
        'message': 'Déconnexion réussie'
    })


@bp.route('/verify-token', methods=['GET'])
@jwt_required()
def verify_token():
    """
    Vérifie si le token est valide
    Utile pour le frontend au chargement
    """
    user_id = int(get_jwt_identity())
    claims = get_jwt()
    
    return jsonify({
        'success': True,
        'valid': True,
        'user_id': user_id,
        'role': claims.get('role')
    })


@bp.route('/forgot-password', methods=['POST'])
@limiter.limit("5 per hour")
def forgot_password():
    """
    Demande de réinitialisation de mot de passe
    
    Body:
        - email: string (required)
    """
    data = request.get_json() or {}
    email = data.get('email', '').strip()
    
    if not email:
        return error_response("Email requis", 400)
    
    success, token = AuthService.request_password_reset(email)
    
    response = {
        'success': True,
        'message': "Si cet email existe, un lien de réinitialisation a été envoyé."
    }
    
    # En dev, inclure le token pour les tests
    if token:
        response['dev_token'] = token
    
    return jsonify(response)


@bp.route('/reset-password', methods=['POST'])
@limiter.limit("10 per hour")
def reset_password():
    """
    Réinitialise le mot de passe avec un token
    
    Body:
        - token: string (required)
        - new_password: string (required, min 6 chars)
    """
    data = request.get_json() or {}
    
    token = data.get('token', '')
    new_password = data.get('new_password', '')
    
    if not token or not new_password:
        return error_response("Token et nouveau mot de passe requis", 400)
    
    if len(new_password) < 6:
        return error_response("Le mot de passe doit contenir au moins 6 caractères", 400)
    
    success, error = AuthService.reset_password(token, new_password)
    
    if not success:
        return error_response(error, 400)
    
    return jsonify({
        'success': True,
        'message': 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.'
    })


@bp.route('/send-otp', methods=['POST'])
@jwt_required()
@limiter.limit("3 per hour")
def send_otp():
    """
    Envoie un code OTP pour vérification d'email
    
    Headers:
        - Authorization: Bearer <access_token>
    """
    user_id = int(get_jwt_identity())
    
    success, result = AuthService.generate_otp(user_id)
    
    if not success:
        return error_response(result, 400)
    
    response = {
        'success': True,
        'message': 'Code de vérification envoyé'
    }
    
    # En dev, inclure le code pour les tests
    if result and len(result) == 6:
        response['dev_code'] = result
    
    return jsonify(response)


@bp.route('/verify-otp', methods=['POST'])
@jwt_required()
@limiter.limit("10 per hour")
def verify_otp():
    """
    Vérifie le code OTP
    
    Body:
        - code: string (required, 6 digits)
    """
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    
    code = data.get('code', '').strip()
    
    if not code or len(code) != 6:
        return error_response("Code à 6 chiffres requis", 400)
    
    success, error = AuthService.verify_otp(user_id, code)
    
    if not success:
        return error_response(error, 400)
    
    return jsonify({
        'success': True,
        'message': 'Email vérifié avec succès'
    })
