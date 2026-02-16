"""
Modèles de base de données - Olympiades IA Bénin
"""
from app.models.user import User
from app.models.candidate import Candidate
from app.models.question import Question
from app.models.qcm_attempt import QCMAttempt
from app.models.qcm_settings import QCMSettings
from app.models.content import News, FAQ, TimelinePhase, Partner
from app.models.audit_log import AuditLog
from app.models.static_page import StaticPage
from app.models.school import School
from app.models.notification import Notification

# Exporter tous les modèles
__all__ = [
    'User',
    'Candidate', 
    'Question',
    'QCMAttempt',
    'QCMSettings',
    'News',
    'FAQ',
    'TimelinePhase',
    'Partner',
    'AuditLog',
    'StaticPage',
    'School',
    'Notification'
]
