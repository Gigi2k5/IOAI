"""
Routes pour les établissements scolaires
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import AuditLog
from app.services.school_service import SchoolService
from app.utils import error_response, admin_required

bp = Blueprint('schools', __name__)


@bp.route('', methods=['GET'])
def search_schools():
    """
    Recherche d'établissements (autocomplete) - Public
    
    Query params:
        - search: terme de recherche
        - region: filtrer par région/département
    """
    search = request.args.get('search', '').strip()
    region = request.args.get('region', '').strip() or None
    
    schools = SchoolService.search(query=search, region=region, limit=20)
    
    return jsonify({
        'success': True,
        'data': [s.to_dict() for s in schools]
    })


@bp.route('/regions', methods=['GET'])
def get_regions():
    """
    Liste des régions/départements disponibles - Public
    """
    regions = SchoolService.get_regions()
    
    return jsonify({
        'success': True,
        'data': regions
    })


@bp.route('/admin', methods=['GET'])
@jwt_required()
@admin_required()
def admin_list_schools():
    """
    Liste complète des établissements (admin) - Paginée
    
    Query params:
        - page: numéro de page (défaut: 1)
        - per_page: éléments par page (défaut: 50)
        - search: recherche
        - region: filtrer par région
    """
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 50, type=int)
    search = request.args.get('search', '').strip() or None
    region = request.args.get('region', '').strip() or None
    
    schools, total = SchoolService.get_all(
        page=page,
        per_page=per_page,
        search=search,
        region=region
    )
    
    return jsonify({
        'success': True,
        'data': [s.to_dict() for s in schools],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': total,
            'pages': (total + per_page - 1) // per_page
        }
    })


@bp.route('/admin', methods=['POST'])
@jwt_required()
@admin_required()
def create_school():
    """
    Crée un nouvel établissement (admin)
    
    Body:
        - name: string (required)
        - city: string
        - region: string
        - type: string (public, privé, confessionnel)
    """
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    
    name = data.get('name', '').strip()
    
    if not name:
        return error_response("Le nom est requis", 400)
    
    school, error = SchoolService.create(
        name=name,
        city=data.get('city'),
        region=data.get('region'),
        type=data.get('type')
    )
    
    if error:
        return error_response(error, 400)
    
    AuditLog.log(
        user_id=user_id,
        action='create_school',
        entity_type='school',
        entity_id=school.id,
        details=f"Créé: {school.name}"
    )
    
    return jsonify({
        'success': True,
        'message': 'Établissement créé',
        'data': school.to_dict()
    }), 201


@bp.route('/admin/<int:school_id>', methods=['PUT'])
@jwt_required()
@admin_required()
def update_school(school_id):
    """
    Met à jour un établissement (admin)
    
    Body:
        - name: string
        - city: string
        - region: string
        - type: string
        - is_active: boolean
    """
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    
    school, error = SchoolService.update(school_id, **data)
    
    if error:
        return error_response(error, 404)
    
    AuditLog.log(
        user_id=user_id,
        action='update_school',
        entity_type='school',
        entity_id=school.id,
        details=f"Modifié: {school.name}"
    )
    
    return jsonify({
        'success': True,
        'message': 'Établissement mis à jour',
        'data': school.to_dict()
    })


@bp.route('/admin/<int:school_id>', methods=['DELETE'])
@jwt_required()
@admin_required()
def delete_school(school_id):
    """
    Supprime un établissement (admin)
    """
    user_id = int(get_jwt_identity())
    
    school = SchoolService.get_by_id(school_id)
    if not school:
        return error_response("Établissement non trouvé", 404)
    
    school_name = school.name
    success, error = SchoolService.delete(school_id)
    
    if not success:
        return error_response(error, 400)
    
    AuditLog.log(
        user_id=user_id,
        action='delete_school',
        entity_type='school',
        entity_id=school_id,
        details=f"Supprimé: {school_name}"
    )
    
    return jsonify({
        'success': True,
        'message': 'Établissement supprimé'
    })


@bp.route('/admin/import', methods=['POST'])
@jwt_required()
@admin_required()
def import_schools():
    """
    Import en masse d'établissements (admin)
    
    Body:
        - schools: array of {name, city, region, type}
    """
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    
    schools_data = data.get('schools', [])
    
    if not schools_data or not isinstance(schools_data, list):
        return error_response("Liste d'établissements requise", 400)
    
    result = SchoolService.import_from_list(schools_data)
    
    AuditLog.log(
        user_id=user_id,
        action='import_schools',
        entity_type='school',
        entity_id=0,
        details=f"Importés: {result['imported']}, Erreurs: {len(result['errors'])}"
    )
    
    return jsonify({
        'success': True,
        'message': f"{result['imported']} établissement(s) importé(s)",
        'data': result
    })
