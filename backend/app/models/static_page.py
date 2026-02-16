"""
Modèle StaticPage - Pages statiques (mentions légales, CGU, etc.)
"""
from datetime import datetime
from app import db


class StaticPage(db.Model):
    """
    Pages statiques du site (mentions légales, CGU, politique de confidentialité)
    """
    __tablename__ = 'static_pages'
    
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(100), unique=True, nullable=False, index=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    
    # Métadonnées
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    updated_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    # Relation
    editor = db.relationship('User', foreign_keys=[updated_by])
    
    def to_dict(self):
        """Convertit en dictionnaire"""
        return {
            'id': self.id,
            'slug': self.slug,
            'title': self.title,
            'content': self.content,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<StaticPage {self.slug}>'
