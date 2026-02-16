"""
Routes pour le classement anonymisé
"""
import hashlib
from flask import Blueprint, request, jsonify
from app import db
from app.models import Candidate
from app.utils import error_response

bp = Blueprint('rankings', __name__)


def generate_candidate_hash(candidate_id):
    """Génère un hash court pour anonymiser le candidat"""
    hash_input = f"olympiades_ia_benin_{candidate_id}_2026"
    return hashlib.sha256(hash_input.encode()).hexdigest()[:6]


@bp.route('', methods=['GET'])
def get_rankings():
    """
    Retourne le classement anonymisé des candidats
    
    Query params:
        - region: filtrer par région (optionnel)
        - limit: nombre max de résultats (défaut: 100)
    """
    region = request.args.get('region', '').strip() or None
    limit = request.args.get('limit', 100, type=int)
    limit = min(limit, 500)  # Max 500
    
    # Query des candidats avec un score QCM
    query = db.session.query(
        Candidate.id,
        Candidate.region,
        Candidate.qcm_score,
        Candidate.school_name
    ).filter(
        Candidate.qcm_score.isnot(None),
        Candidate.status.in_(['validated', 'submitted'])
    )
    
    if region:
        query = query.filter(Candidate.region == region)
    
    # Trier par score décroissant
    query = query.order_by(Candidate.qcm_score.desc())
    
    results = query.limit(limit).all()
    
    # Construire le classement anonymisé
    rankings = []
    for rank, (cand_id, cand_region, score, school) in enumerate(results, 1):
        rankings.append({
            'rank': rank,
            'region': cand_region or 'Non spécifié',
            'score': round(score, 1) if score else 0,
            'candidate_id_hash': generate_candidate_hash(cand_id),
            'school': school[:30] + '...' if school and len(school) > 30 else school
        })
    
    # Statistiques globales
    total_with_score = Candidate.query.filter(
        Candidate.qcm_score.isnot(None)
    ).count()
    
    avg_score = db.session.query(db.func.avg(Candidate.qcm_score)).filter(
        Candidate.qcm_score.isnot(None)
    ).scalar() or 0
    
    return jsonify({
        'success': True,
        'data': {
            'rankings': rankings,
            'stats': {
                'total_candidates': total_with_score,
                'average_score': round(avg_score, 1),
                'filtered_region': region
            }
        }
    })


@bp.route('/my-rank', methods=['GET'])
def get_my_rank():
    """
    Permet à un candidat de trouver son rang via son hash
    
    Query params:
        - hash: hash du candidat (6 caractères)
    """
    candidate_hash = request.args.get('hash', '').strip()
    
    if not candidate_hash or len(candidate_hash) != 6:
        return error_response("Hash invalide (6 caractères requis)", 400)
    
    # Trouver le candidat par son hash
    candidates = Candidate.query.filter(
        Candidate.qcm_score.isnot(None),
        Candidate.status.in_(['validated', 'submitted'])
    ).order_by(Candidate.qcm_score.desc()).all()
    
    for rank, candidate in enumerate(candidates, 1):
        if generate_candidate_hash(candidate.id) == candidate_hash:
            return jsonify({
                'success': True,
                'data': {
                    'rank': rank,
                    'total': len(candidates),
                    'score': round(candidate.qcm_score, 1),
                    'region': candidate.region or 'Non spécifié',
                    'percentile': round((len(candidates) - rank + 1) / len(candidates) * 100, 1)
                }
            })
    
    return error_response("Candidat non trouvé", 404)


@bp.route('/by-region', methods=['GET'])
def get_rankings_by_region():
    """
    Retourne les statistiques par région
    """
    # Statistiques par région
    region_stats = db.session.query(
        Candidate.region,
        db.func.count(Candidate.id).label('count'),
        db.func.avg(Candidate.qcm_score).label('avg_score'),
        db.func.max(Candidate.qcm_score).label('max_score')
    ).filter(
        Candidate.qcm_score.isnot(None)
    ).group_by(Candidate.region).order_by(db.desc('avg_score')).all()
    
    regions = []
    for region, count, avg, max_score in region_stats:
        regions.append({
            'region': region or 'Non spécifié',
            'candidates_count': count,
            'average_score': round(avg, 1) if avg else 0,
            'best_score': round(max_score, 1) if max_score else 0
        })
    
    return jsonify({
        'success': True,
        'data': regions
    })
