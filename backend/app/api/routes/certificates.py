"""
Routes pour les certificats PDF
"""
from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User, Candidate, QCMAttempt
from app.services.certificate_service import CertificateService
from app.utils import error_response, candidate_required

bp = Blueprint('certificates', __name__)


@bp.route('', methods=['GET'])
@jwt_required()
@candidate_required()
def list_certificates():
    """
    Liste les certificats disponibles pour le candidat
    """
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if not user or not user.candidate:
        return error_response("Profil candidat non trouvé", 404)
    
    certificates = CertificateService.get_available_certificates(user.candidate)
    
    return jsonify({
        'success': True,
        'data': certificates
    })


@bp.route('/<cert_type>', methods=['GET'])
@jwt_required()
@candidate_required()
def download_certificate(cert_type):
    """
    Télécharge un certificat PDF
    
    Args:
        cert_type: Type de certificat (participation, qcm, selection)
    """
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if not user or not user.candidate:
        return error_response("Profil candidat non trouvé", 404)
    
    candidate = user.candidate
    
    # Vérifier les droits et générer le certificat approprié
    if cert_type == 'participation':
        # Disponible si profil soumis
        if candidate.status not in ['submitted', 'validated', 'rejected']:
            return error_response("Certificat non disponible. Soumettez d'abord votre profil.", 403)
        
        pdf_buffer = CertificateService.generate_participation_certificate(candidate)
        filename = f"certificat_participation_{candidate.id}.pdf"
    
    elif cert_type == 'qcm':
        # Disponible si QCM passé
        attempt = QCMAttempt.query.filter(
            QCMAttempt.candidate_id == candidate.id,
            QCMAttempt.status == 'completed'
        ).first()
        
        if not attempt:
            return error_response("Certificat non disponible. Passez d'abord le test QCM.", 403)
        
        pdf_buffer = CertificateService.generate_qcm_certificate(candidate, attempt)
        filename = f"attestation_qcm_{candidate.id}.pdf"
    
    elif cert_type == 'selection':
        # Disponible si validé et score suffisant
        if candidate.status != 'validated':
            return error_response("Certificat non disponible. Votre candidature doit être validée.", 403)
        
        if not candidate.qcm_score or candidate.qcm_score < 70:
            return error_response("Certificat non disponible. Score insuffisant.", 403)
        
        pdf_buffer = CertificateService.generate_selection_certificate(candidate)
        filename = f"certificat_selection_{candidate.id}.pdf"
    
    else:
        return error_response("Type de certificat invalide", 400)
    
    return send_file(
        pdf_buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=filename
    )
