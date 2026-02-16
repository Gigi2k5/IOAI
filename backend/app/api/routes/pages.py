"""
Routes pour les pages statiques (mentions légales, CGU, etc.)
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import StaticPage, AuditLog
from app.utils import error_response, admin_required

bp = Blueprint('pages', __name__)


@bp.route('/<slug>', methods=['GET'])
def get_page(slug):
    """
    Récupère une page statique par son slug
    
    Args:
        slug: Identifiant de la page (mentions-legales, cgu, confidentialite)
    """
    page = StaticPage.query.filter_by(slug=slug).first()
    
    if not page:
        return error_response("Page non trouvée", 404)
    
    return jsonify({
        'success': True,
        'data': page.to_dict()
    })


@bp.route('/<slug>', methods=['PUT'])
@jwt_required()
@admin_required()
def update_page(slug):
    """
    Met à jour une page statique (admin uniquement)
    
    Body:
        - title: string (optional)
        - content: string (optional)
    """
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    
    page = StaticPage.query.filter_by(slug=slug).first()
    
    if not page:
        # Créer la page si elle n'existe pas
        if not data.get('title') or not data.get('content'):
            return error_response("Titre et contenu requis pour créer une nouvelle page", 400)
        
        page = StaticPage(
            slug=slug,
            title=data['title'],
            content=data['content'],
            updated_by=user_id
        )
        db.session.add(page)
    else:
        # Mettre à jour
        if 'title' in data:
            page.title = data['title']
        if 'content' in data:
            page.content = data['content']
        page.updated_by = user_id
    
    AuditLog.log(
        user_id=user_id,
        action='update_static_page',
        entity_type='static_page',
        entity_id=page.id if page.id else 0,
        details=f"Page: {slug}"
    )
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Page mise à jour',
        'data': page.to_dict()
    })


@bp.route('/admin/list', methods=['GET'])
@jwt_required()
@admin_required()
def list_pages():
    """
    Liste toutes les pages statiques (admin uniquement)
    """
    pages = StaticPage.query.order_by(StaticPage.slug).all()
    
    return jsonify({
        'success': True,
        'data': [p.to_dict() for p in pages]
    })
