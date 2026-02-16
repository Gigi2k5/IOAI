"""
Modèle School - Établissements scolaires
"""
from datetime import datetime
from app import db


class School(db.Model):
    """
    Établissement scolaire (lycée, collège)
    """
    __tablename__ = 'schools'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False, index=True)
    city = db.Column(db.String(100), index=True)
    region = db.Column(db.String(100), index=True)  # Département
    type = db.Column(db.String(50))  # public, privé, confessionnel
    
    # Statut
    is_active = db.Column(db.Boolean, default=True)
    
    # Dates
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relation avec les candidats
    candidates = db.relationship('Candidate', backref='school', lazy='dynamic')
    
    def to_dict(self):
        """Convertit en dictionnaire"""
        return {
            'id': self.id,
            'name': self.name,
            'city': self.city,
            'region': self.region,
            'type': self.type,
            'is_active': self.is_active
        }
    
    def __repr__(self):
        return f'<School {self.name}>'
