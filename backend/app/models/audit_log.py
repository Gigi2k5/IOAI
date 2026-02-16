"""
Modèle AuditLog - Journal des actions administratives
"""
from datetime import datetime
from app import db


class AuditLog(db.Model):
    """
    Enregistre les actions importantes pour traçabilité
    """
    __tablename__ = 'audit_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    # Action
    action = db.Column(db.String(50), nullable=False)  # create, update, delete, validate, reject, login, etc.
    entity_type = db.Column(db.String(50))  # user, candidate, question, etc.
    entity_id = db.Column(db.Integer)
    
    # Détails
    details = db.Column(db.Text)  # JSON avec before/after ou description
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.String(255))
    
    # Date
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    # Relation
    user = db.relationship('User', backref='audit_logs')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_email': self.user.email if self.user else None,
            'action': self.action,
            'entity_type': self.entity_type,
            'entity_id': self.entity_id,
            'details': self.details,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    @classmethod
    def log(cls, user_id, action, entity_type=None, entity_id=None, details=None, ip=None, ua=None):
        """Crée une entrée de log"""
        entry = cls(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            details=details,
            ip_address=ip,
            user_agent=ua
        )
        db.session.add(entry)
        # PAS de db.session.commit() ici — le commit est géré par le code appelant
        return entry
