"""
Blueprint principal de l'API
"""
from flask import Blueprint

api_bp = Blueprint('api', __name__)

from app.api.routes import health, auth, candidate, qcm, content, stats, pages, schools, notifications, certificates, rankings

api_bp.register_blueprint(health.bp)
api_bp.register_blueprint(auth.bp, url_prefix='/auth')
api_bp.register_blueprint(candidate.bp, url_prefix='/candidate')
api_bp.register_blueprint(qcm.bp, url_prefix='/qcm')
api_bp.register_blueprint(content.bp, url_prefix='/content')
api_bp.register_blueprint(stats.bp, url_prefix='/stats')
api_bp.register_blueprint(pages.bp, url_prefix='/pages')
api_bp.register_blueprint(schools.bp, url_prefix='/schools')
api_bp.register_blueprint(notifications.bp, url_prefix='/notifications')
api_bp.register_blueprint(certificates.bp, url_prefix='/certificates')
api_bp.register_blueprint(rankings.bp, url_prefix='/rankings')
