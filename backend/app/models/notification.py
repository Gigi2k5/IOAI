"""
Modèle Notification - Système de notifications
"""
from datetime import datetime
from app import db


class Notification(db.Model):
    """
    Notification envoyée à un utilisateur
    """
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Contenu
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), default='info')  # info, success, warning, action
    link = db.Column(db.String(200))  # Lien vers une action
    
    # Statut
    is_read = db.Column(db.Boolean, default=False, index=True)
    read_at = db.Column(db.DateTime)
    
    # Dates
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    # Relation
    user = db.relationship('User', backref=db.backref('notifications', lazy='dynamic'))
    
    def mark_as_read(self):
        """Marque la notification comme lue"""
        if not self.is_read:
            self.is_read = True
            self.read_at = datetime.utcnow()
    
    def to_dict(self):
        """Convertit en dictionnaire"""
        return {
            'id': self.id,
            'title': self.title,
            'message': self.message,
            'type': self.type,
            'link': self.link,
            'is_read': self.is_read,
            'read_at': self.read_at.isoformat() if self.read_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<Notification {self.id} for User {self.user_id}>'
