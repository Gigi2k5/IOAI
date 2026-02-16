"""
Routes de gestion du contenu
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.content_service import ContentService
from app.utils import error_response, admin_required

bp = Blueprint('content', __name__)


# ============================================
# ROUTES PUBLIQUES
# ============================================

@bp.route('/news', methods=['GET'])
def get_public_news():
    """Récupère les actualités publiées"""
    result, _ = ContentService.get_public_news()
    return jsonify({'success': True, 'data': result})


@bp.route('/faq', methods=['GET'])
@bp.route('/faqs', methods=['GET'])
def get_public_faqs():
    """Récupère les FAQ actives"""
    result, _ = ContentService.get_public_faqs()
    return jsonify({'success': True, 'data': result})


@bp.route('/timeline', methods=['GET'])
def get_timeline():
    """Récupère la timeline"""
    result, _ = ContentService.get_timeline()
    return jsonify({'success': True, 'data': result})


@bp.route('/partners', methods=['GET'])
def get_public_partners():
    """Récupère les partenaires actifs"""
    result, _ = ContentService.get_public_partners()
    return jsonify({'success': True, 'data': result})


# ============================================
# ROUTES ADMIN - NEWS
# ============================================

@bp.route('/news', methods=['POST'])
@admin_required()
def admin_create_news():
    """Crée une actualité"""
    admin_id = get_jwt_identity()
    data = request.get_json() or {}
    
    if not data.get('title'):
        return error_response("Titre requis", 400)
    
    result, error = ContentService.create_news(data, admin_id)
    if error:
        return error_response(error, 400)
    
    return jsonify({'success': True, 'message': 'Actualité créée', 'data': result}), 201


@bp.route('/news/<int:news_id>', methods=['PUT'])
@admin_required()
def admin_update_news(news_id):
    """Met à jour une actualité"""
    admin_id = get_jwt_identity()
    data = request.get_json() or {}
    
    result, error = ContentService.update_news(news_id, data, admin_id)
    if error:
        return error_response(error, 404)
    
    return jsonify({'success': True, 'message': 'Actualité mise à jour', 'data': result})


@bp.route('/news/<int:news_id>', methods=['DELETE'])
@admin_required()
def admin_delete_news(news_id):
    """Supprime une actualité"""
    result, error = ContentService.delete_news(news_id)
    if error:
        return error_response(error, 404)
    
    return jsonify({'success': True, 'message': 'Actualité supprimée'})


# ============================================
# ROUTES ADMIN - FAQ
# ============================================

@bp.route('/faq', methods=['POST'])
@bp.route('/faqs', methods=['POST'])
@admin_required()
def admin_create_faq():
    """Crée une FAQ"""
    admin_id = get_jwt_identity()
    data = request.get_json() or {}
    
    if not data.get('question') or not data.get('answer'):
        return error_response("Question et réponse requises", 400)
    
    result, error = ContentService.create_faq(data, admin_id)
    if error:
        return error_response(error, 400)
    
    return jsonify({'success': True, 'message': 'FAQ créée', 'data': result}), 201


@bp.route('/faq/<int:faq_id>', methods=['PUT'])
@bp.route('/faqs/<int:faq_id>', methods=['PUT'])
@admin_required()
def admin_update_faq(faq_id):
    """Met à jour une FAQ"""
    data = request.get_json() or {}
    
    result, error = ContentService.update_faq(faq_id, data)
    if error:
        return error_response(error, 404)
    
    return jsonify({'success': True, 'message': 'FAQ mise à jour', 'data': result})


@bp.route('/faq/<int:faq_id>', methods=['DELETE'])
@bp.route('/faqs/<int:faq_id>', methods=['DELETE'])
@admin_required()
def admin_delete_faq(faq_id):
    """Supprime une FAQ"""
    result, error = ContentService.delete_faq(faq_id)
    if error:
        return error_response(error, 404)
    
    return jsonify({'success': True, 'message': 'FAQ supprimée'})


# ============================================
# ROUTES ADMIN - TIMELINE
# ============================================

@bp.route('/timeline', methods=['POST'])
@admin_required()
def admin_create_phase():
    """Crée une phase"""
    admin_id = get_jwt_identity()
    data = request.get_json() or {}
    
    if not data.get('title'):
        return error_response("Titre requis", 400)
    
    result, error = ContentService.create_phase(data, admin_id)
    if error:
        return error_response(error, 400)
    
    return jsonify({'success': True, 'message': 'Phase créée', 'data': result}), 201


@bp.route('/timeline/<int:phase_id>', methods=['PUT'])
@admin_required()
def admin_update_phase(phase_id):
    """Met à jour une phase"""
    data = request.get_json() or {}
    
    result, error = ContentService.update_phase(phase_id, data)
    if error:
        return error_response(error, 404)
    
    return jsonify({'success': True, 'message': 'Phase mise à jour', 'data': result})


@bp.route('/timeline/<int:phase_id>', methods=['DELETE'])
@admin_required()
def admin_delete_phase(phase_id):
    """Supprime une phase"""
    result, error = ContentService.delete_phase(phase_id)
    if error:
        return error_response(error, 404)
    
    return jsonify({'success': True, 'message': 'Phase supprimée'})


# ============================================
# ROUTES ADMIN - PARTNERS
# ============================================

@bp.route('/partners', methods=['POST'])
@admin_required()
def admin_create_partner():
    """Crée un partenaire"""
    admin_id = get_jwt_identity()
    data = request.get_json() or {}
    
    if not data.get('name'):
        return error_response("Nom requis", 400)
    
    result, error = ContentService.create_partner(data, admin_id)
    if error:
        return error_response(error, 400)
    
    return jsonify({'success': True, 'message': 'Partenaire créé', 'data': result}), 201


@bp.route('/partners/<int:partner_id>', methods=['PUT'])
@admin_required()
def admin_update_partner(partner_id):
    """Met à jour un partenaire"""
    data = request.get_json() or {}
    
    result, error = ContentService.update_partner(partner_id, data)
    if error:
        return error_response(error, 404)
    
    return jsonify({'success': True, 'message': 'Partenaire mis à jour', 'data': result})


@bp.route('/partners/<int:partner_id>', methods=['DELETE'])
@admin_required()
def admin_delete_partner(partner_id):
    """Supprime un partenaire"""
    result, error = ContentService.delete_partner(partner_id)
    if error:
        return error_response(error, 404)
    
    return jsonify({'success': True, 'message': 'Partenaire supprimé'})
