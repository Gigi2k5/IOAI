"""
Service de génération de certificats PDF
"""
import os
from io import BytesIO
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import cm, mm
from reportlab.pdfgen import canvas


class CertificateService:
    """Génère des certificats PDF"""
    
    # Couleurs du thème
    PRIMARY_COLOR = colors.HexColor('#206080')
    ACCENT_COLOR = colors.HexColor('#208080')
    GOLD_COLOR = colors.HexColor('#D4A017')
    
    @staticmethod
    def _create_header(c, width, height):
        """Dessine l'en-tête du certificat"""
        c.setFillColor(CertificateService.PRIMARY_COLOR)
        c.rect(0, height - 3*cm, width, 3*cm, fill=True, stroke=False)
        
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 24)
        c.drawCentredString(width/2, height - 2*cm, "OLYMPIADES IA BÉNIN 2026")
        
        c.setFont("Helvetica", 12)
        c.drawCentredString(width/2, height - 2.7*cm, "Olympiades Internationales d'Intelligence Artificielle")
    
    @staticmethod
    def _create_footer(c, width):
        """Dessine le pied de page"""
        c.setFillColor(CertificateService.PRIMARY_COLOR)
        c.rect(0, 0, width, 1.5*cm, fill=True, stroke=False)
        
        c.setFillColor(colors.white)
        c.setFont("Helvetica", 8)
        c.drawCentredString(width/2, 0.6*cm, "www.olympiades-ia.bj | contact@olympiades-ia.bj")
    
    @staticmethod
    def _create_border(c, width, height):
        """Dessine une bordure décorative"""
        margin = 1*cm
        c.setStrokeColor(CertificateService.PRIMARY_COLOR)
        c.setLineWidth(2)
        c.rect(margin, margin + 0.5*cm, width - 2*margin, height - 2*margin - 3*cm, fill=False)
        
        c.setStrokeColor(CertificateService.ACCENT_COLOR)
        c.setLineWidth(0.5)
        c.rect(margin + 3*mm, margin + 0.5*cm + 3*mm, 
               width - 2*margin - 6*mm, height - 2*margin - 3*cm - 6*mm, fill=False)
    
    @staticmethod
    def generate_participation_certificate(candidate):
        """
        Génère un certificat de participation
        
        Args:
            candidate: Objet Candidate
            
        Returns:
            BytesIO: Buffer contenant le PDF
        """
        buffer = BytesIO()
        width, height = landscape(A4)
        c = canvas.Canvas(buffer, pagesize=landscape(A4))
        
        CertificateService._create_header(c, width, height)
        CertificateService._create_border(c, width, height)
        
        y = height - 5*cm
        
        c.setFillColor(CertificateService.ACCENT_COLOR)
        c.setFont("Helvetica-Bold", 20)
        c.drawCentredString(width/2, y, "CERTIFICAT DE PARTICIPATION")
        y -= 1.5*cm
        
        c.setFillColor(colors.black)
        c.setFont("Helvetica", 14)
        c.drawCentredString(width/2, y, "Ce certificat est décerné à")
        y -= 1.5*cm
        
        c.setFillColor(CertificateService.PRIMARY_COLOR)
        c.setFont("Helvetica-Bold", 28)
        c.drawCentredString(width/2, y, candidate.full_name.upper())
        y -= 1.5*cm
        
        c.setFillColor(colors.black)
        c.setFont("Helvetica", 12)
        lines = [
            "pour avoir participé au processus de sélection nationale",
            "des Olympiades Internationales d'Intelligence Artificielle 2026",
            "représentant la République du Bénin"
        ]
        for line in lines:
            c.drawCentredString(width/2, y, line)
            y -= 0.7*cm
        
        y -= 0.5*cm
        
        c.setFont("Helvetica", 10)
        info_text = f"Inscrit(e) le {candidate.created_at.strftime('%d/%m/%Y')}"
        if candidate.school_name:
            info_text += f" | Établissement: {candidate.school_name}"
        c.drawCentredString(width/2, y, info_text)
        y -= 1.5*cm
        
        c.setFont("Helvetica", 10)
        today = datetime.now().strftime('%d/%m/%Y')
        c.drawString(3*cm, y, f"Délivré le {today}")
        c.drawRightString(width - 3*cm, y, "Le Comité National")
        
        CertificateService._create_footer(c, width)
        
        c.save()
        buffer.seek(0)
        return buffer
    
    @staticmethod
    def generate_qcm_certificate(candidate, attempt):
        """
        Génère une attestation de passage du QCM
        
        Args:
            candidate: Objet Candidate
            attempt: Objet QCMAttempt
            
        Returns:
            BytesIO: Buffer contenant le PDF
        """
        buffer = BytesIO()
        width, height = landscape(A4)
        c = canvas.Canvas(buffer, pagesize=landscape(A4))
        
        CertificateService._create_header(c, width, height)
        CertificateService._create_border(c, width, height)
        
        y = height - 5*cm
        
        c.setFillColor(CertificateService.ACCENT_COLOR)
        c.setFont("Helvetica-Bold", 20)
        c.drawCentredString(width/2, y, "ATTESTATION DE RÉUSSITE AU TEST NATIONAL")
        y -= 1.5*cm
        
        c.setFillColor(colors.black)
        c.setFont("Helvetica", 14)
        c.drawCentredString(width/2, y, "Ce document atteste que")
        y -= 1.5*cm
        
        c.setFillColor(CertificateService.PRIMARY_COLOR)
        c.setFont("Helvetica-Bold", 28)
        c.drawCentredString(width/2, y, candidate.full_name.upper())
        y -= 1.5*cm
        
        c.setFillColor(colors.black)
        c.setFont("Helvetica", 12)
        c.drawCentredString(width/2, y, "a passé avec succès le Test National de Sélection")
        y -= 0.8*cm
        c.drawCentredString(width/2, y, "des Olympiades Internationales d'Intelligence Artificielle 2026")
        y -= 1.5*cm
        
        score = attempt.score or 0
        c.setFont("Helvetica-Bold", 18)
        if score >= 70:
            c.setFillColor(CertificateService.GOLD_COLOR)
            mention = "Excellent"
        elif score >= 50:
            c.setFillColor(CertificateService.ACCENT_COLOR)
            mention = "Satisfaisant"
        else:
            c.setFillColor(colors.black)
            mention = ""
        
        score_text = f"Score obtenu: {score:.1f}%"
        if mention:
            score_text += f" - {mention}"
        c.drawCentredString(width/2, y, score_text)
        y -= 1*cm
        
        c.setFillColor(colors.black)
        c.setFont("Helvetica", 10)
        if attempt.finished_at:
            c.drawCentredString(width/2, y, f"Test passé le {attempt.finished_at.strftime('%d/%m/%Y à %H:%M')}")
        y -= 0.6*cm
        c.drawCentredString(width/2, y, f"Questions: {attempt.correct_count or 0}/{attempt.total_questions or 0} correctes")
        y -= 1.5*cm
        
        c.setFont("Helvetica", 10)
        today = datetime.now().strftime('%d/%m/%Y')
        c.drawString(3*cm, y, f"Délivré le {today}")
        c.drawRightString(width - 3*cm, y, "Le Comité National")
        
        CertificateService._create_footer(c, width)
        
        c.save()
        buffer.seek(0)
        return buffer
    
    @staticmethod
    def generate_selection_certificate(candidate):
        """
        Génère un certificat de sélection pour les candidats retenus
        
        Args:
            candidate: Objet Candidate
            
        Returns:
            BytesIO: Buffer contenant le PDF
        """
        buffer = BytesIO()
        width, height = landscape(A4)
        c = canvas.Canvas(buffer, pagesize=landscape(A4))
        
        # En-tête doré
        c.setFillColor(CertificateService.GOLD_COLOR)
        c.rect(0, height - 3*cm, width, 3*cm, fill=True, stroke=False)
        
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 24)
        c.drawCentredString(width/2, height - 2*cm, "OLYMPIADES IA BÉNIN 2026")
        c.setFont("Helvetica", 12)
        c.drawCentredString(width/2, height - 2.7*cm, "Olympiades Internationales d'Intelligence Artificielle")
        
        # Bordure dorée
        margin = 1*cm
        c.setStrokeColor(CertificateService.GOLD_COLOR)
        c.setLineWidth(3)
        c.rect(margin, margin + 0.5*cm, width - 2*margin, height - 2*margin - 3*cm, fill=False)
        
        y = height - 5*cm
        
        c.setFillColor(CertificateService.GOLD_COLOR)
        c.setFont("Helvetica-Bold", 22)
        c.drawCentredString(width/2, y, "CERTIFICAT DE SÉLECTION")
        y -= 1.5*cm
        
        c.setFillColor(colors.black)
        c.setFont("Helvetica", 14)
        c.drawCentredString(width/2, y, "Ce certificat atteste que")
        y -= 1.5*cm
        
        c.setFillColor(CertificateService.PRIMARY_COLOR)
        c.setFont("Helvetica-Bold", 30)
        c.drawCentredString(width/2, y, candidate.full_name.upper())
        y -= 1.5*cm
        
        c.setFillColor(colors.black)
        c.setFont("Helvetica", 13)
        lines = [
            "a été officiellement sélectionné(e) pour représenter",
            "la République du Bénin aux",
            "Olympiades Internationales d'Intelligence Artificielle 2026"
        ]
        for line in lines:
            c.drawCentredString(width/2, y, line)
            y -= 0.8*cm
        
        y -= 0.5*cm
        
        c.setFont("Helvetica-Bold", 14)
        c.setFillColor(CertificateService.ACCENT_COLOR)
        c.drawCentredString(width/2, y, "Abu Dhabi, Émirats Arabes Unis - Août 2026")
        y -= 1.5*cm
        
        if candidate.qcm_score:
            c.setFillColor(colors.black)
            c.setFont("Helvetica", 10)
            c.drawCentredString(width/2, y, f"Score au Test National: {candidate.qcm_score:.1f}%")
            y -= 1*cm
        
        c.setFont("Helvetica", 10)
        c.setFillColor(colors.black)
        today = datetime.now().strftime('%d/%m/%Y')
        c.drawString(3*cm, y, f"Délivré le {today}")
        c.drawRightString(width - 3*cm, y, "Le Comité National")
        
        # Pied doré
        c.setFillColor(CertificateService.GOLD_COLOR)
        c.rect(0, 0, width, 1.5*cm, fill=True, stroke=False)
        c.setFillColor(colors.white)
        c.setFont("Helvetica", 8)
        c.drawCentredString(width/2, 0.6*cm, "www.olympiades-ia.bj | contact@olympiades-ia.bj")
        
        c.save()
        buffer.seek(0)
        return buffer
    
    @staticmethod
    def get_available_certificates(candidate):
        """
        Retourne la liste des certificats disponibles pour un candidat
        
        Args:
            candidate: Objet Candidate
            
        Returns:
            list: Types de certificats disponibles
        """
        certificates = []
        
        if candidate.status in ['submitted', 'validated', 'rejected']:
            certificates.append({
                'type': 'participation',
                'title': 'Certificat de participation',
                'description': 'Atteste de votre participation au processus de sélection',
                'available': True
            })
        
        from app.models import QCMAttempt
        attempt = QCMAttempt.query.filter(
            QCMAttempt.candidate_id == candidate.id,
            QCMAttempt.status == 'completed'
        ).first()
        
        if attempt:
            certificates.append({
                'type': 'qcm',
                'title': 'Attestation Test National',
                'description': f'Atteste de votre score de {attempt.score:.1f}% au QCM',
                'available': True
            })
        
        if candidate.status == 'validated' and candidate.qcm_score and candidate.qcm_score >= 70:
            certificates.append({
                'type': 'selection',
                'title': 'Certificat de sélection',
                'description': 'Certificat officiel de sélection pour représenter le Bénin',
                'available': True
            })
        
        return certificates
