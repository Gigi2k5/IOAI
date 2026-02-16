"""
Modèle QCMSettings - Paramètres du QCM
"""
from datetime import datetime
from app import db


class QCMSettings(db.Model):
    """
    Paramètres globaux du QCM (singleton)
    """
    __tablename__ = 'qcm_settings'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Paramètres du test
    duration_minutes = db.Column(db.Integer, default=30)
    total_questions = db.Column(db.Integer, default=20)
    passing_score = db.Column(db.Float, default=50.0)  # Score minimum pour réussir (%)
    
    # Répartition par difficulté
    easy_count = db.Column(db.Integer, default=5)
    medium_count = db.Column(db.Integer, default=10)
    hard_count = db.Column(db.Integer, default=5)
    
    # Options
    randomize_questions = db.Column(db.Boolean, default=True)
    randomize_options = db.Column(db.Boolean, default=True)
    show_score_immediately = db.Column(db.Boolean, default=True)
    
    # Période d'ouverture
    open_date = db.Column(db.DateTime)
    close_date = db.Column(db.DateTime)
    
    # Dates
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    updated_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    @property
    def is_open(self):
        """Vérifie si le QCM est ouvert"""
        now = datetime.utcnow()
        if self.open_date and now < self.open_date:
            return False
        if self.close_date and now > self.close_date:
            return False
        return True
    
    def to_dict(self):
        """Convertit en dictionnaire"""
        return {
            'duration_minutes': self.duration_minutes,
            'total_questions': self.total_questions,
            'passing_score': self.passing_score,
            'easy_count': self.easy_count,
            'medium_count': self.medium_count,
            'hard_count': self.hard_count,
            'randomize_questions': self.randomize_questions,
            'randomize_options': self.randomize_options,
            'show_score_immediately': self.show_score_immediately,
            'open_date': self.open_date.isoformat() if self.open_date else None,
            'close_date': self.close_date.isoformat() if self.close_date else None,
            'is_open': self.is_open
        }
    
    @classmethod
    def get_settings(cls):
        """Récupère les paramètres (crée si n'existe pas)"""
        settings = cls.query.first()
        if not settings:
            settings = cls()
            db.session.add(settings)
            db.session.commit()
        return settings
