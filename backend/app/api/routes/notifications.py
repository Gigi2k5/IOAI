"""
Routes pour les notifications
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import AuditLog
from app.services.notification_service import NotificationService
from app.utils import error_response, admin_required, candidate_required

bp = Blueprint('notifications', __name__)


@bp.route('', methods=['GET'])
@jwt_required()
def get_notifications():
    """
    Liste les notifications de l'utilisateur connecté
    
    Query params:
        - page: numéro de page (défaut: 1)
        - per_page: éléments par page (défaut: 20)
        - unread_only: true pour ne voir que les non-lues
    """
    user_id = int(get_jwt_identity())
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    unread_only = request.args.get('unread_only', 'false').lower() == 'true'
    
    notifications, total = NotificationService.get_user_notifications(
        user_id=user_id,
        page=page,
        per_page=per_page,
        unread_only=unread_only
    )
    
    return jsonify({
        'success': True,
        'data': [n.to_dict() for n in notifications],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': total,
            'pages': (total + per_page - 1) // per_page if per_page > 0 else 0
        }
    })


@bp.route('/unread-count', methods=['GET'])
@jwt_required()
def get_unread_count():
    """
    Retourne le nombre de notifications non lues
    """
    user_id = int(get_jwt_identity())
    count = NotificationService.get_unread_count(user_id)
    
    return jsonify({
        'success': True,
        'data': {
            'unread_count': count
        }
    })


@bp.route('/<int:notification_id>/read', methods=['PUT'])
@jwt_required()
def mark_as_read(notification_id):
    """
    Marque une notification comme lue
    """
    user_id = int(get_jwt_identity())
    
    success, error = NotificationService.mark_as_read(notification_id, user_id)
    
    if not success:
        return error_response(error, 404)
    
    return jsonify({
        'success': True,
        'message': 'Notification marquée comme lue'
    })


@bp.route('/read-all', methods=['PUT'])
@jwt_required()
def mark_all_as_read():
    """
    Marque toutes les notifications comme lues
    """
    user_id = int(get_jwt_identity())
    
    NotificationService.mark_all_as_read(user_id)
    
    return jsonify({
        'success': True,
        'message': 'Toutes les notifications ont été marquées comme lues'
    })


@bp.route('/<int:notification_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notification_id):
    """
    Supprime une notification
    """
    user_id = int(get_jwt_identity())
    
    success = NotificationService.delete_notification(notification_id, user_id)
    
    if not success:
        return error_response("Notification non trouvée", 404)
    
    return jsonify({
        'success': True,
        'message': 'Notification supprimée'
    })


# === Routes Admin ===

@bp.route('/admin/send', methods=['POST'])
@jwt_required()
@admin_required()
def admin_send_notification():
    """
    Envoie une notification à un ou plusieurs utilisateurs (admin)
    
    Body:
        - user_ids: array of int (required)
        - title: string (required)
        - message: string (required)
        - type: string (info, success, warning, action)
        - link: string (optional)
    """
    admin_id = int(get_jwt_identity())
    data = request.get_json() or {}
    
    user_ids = data.get('user_ids', [])
    title = data.get('title', '').strip()
    message = data.get('message', '').strip()
    type = data.get('type', 'info')
    link = data.get('link')
    
    if not user_ids or not isinstance(user_ids, list):
        return error_response("Liste d'utilisateurs requise", 400)
    
    if not title or not message:
        return error_response("Titre et message requis", 400)
    
    sent_count = 0
    for user_id in user_ids:
        try:
            NotificationService.notify(
                user_id=user_id,
                title=title,
                message=message,
                type=type,
                link=link
            )
            sent_count += 1
        except Exception as e:
            print(f"Erreur envoi notification à {user_id}: {e}")
    
    AuditLog.log(
        user_id=admin_id,
        action='send_notifications',
        entity_type='notification',
        entity_id=0,
        details=f"Envoyé à {sent_count} utilisateur(s)"
    )
    
    return jsonify({
        'success': True,
        'message': f'Notification envoyée à {sent_count} utilisateur(s)'
    })


@bp.route('/admin/broadcast', methods=['POST'])
@jwt_required()
@admin_required()
def admin_broadcast():
    """
    Envoie une notification à tous les candidats (admin)
    
    Body:
        - title: string (required)
        - message: string (required)
        - type: string (info, success, warning, action)
        - link: string (optional)
        - filters: object (optional)
            - status: string (draft, submitted, validated, rejected)
            - region: string
    """
    admin_id = int(get_jwt_identity())
    data = request.get_json() or {}
    
    title = data.get('title', '').strip()
    message = data.get('message', '').strip()
    type = data.get('type', 'info')
    link = data.get('link')
    filters = data.get('filters')
    
    if not title or not message:
        return error_response("Titre et message requis", 400)
    
    count = NotificationService.broadcast(
        title=title,
        message=message,
        type=type,
        link=link,
        filters=filters
    )
    
    AuditLog.log(
        user_id=admin_id,
        action='broadcast_notification',
        entity_type='notification',
        entity_id=0,
        details=f"Broadcast à {count} candidat(s). Filtres: {filters}"
    )
    
    return jsonify({
        'success': True,
        'message': f'Notification envoyée à {count} candidat(s)'
    })
