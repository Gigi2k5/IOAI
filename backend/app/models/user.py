"""
Modèle User - Utilisateurs de la plateforme
"""
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app import db


class User(db.Model):
    """
    Utilisateur de la plateforme (candidat ou admin)
    """
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='candidate')  # candidate, admin, super_admin
    
    # Statut du compte
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    
    # Récupération de mot de passe
    reset_token = db.Column(db.String(256))
    reset_token_expires = db.Column(db.DateTime)
    
    # Vérification par OTP
    otp_code = db.Column(db.String(256))  # Hashé
    otp_expires = db.Column(db.DateTime)
    otp_attempts = db.Column(db.Integer, default=0)
    
    # Dates
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    # Relation avec Candidate (1-1) - spécifier explicitement la FK
    candidate = db.relationship(
        'Candidate', 
        backref='user', 
        uselist=False, 
        cascade='all, delete-orphan',
        foreign_keys='Candidate.user_id'
    )
    
    def set_password(self, password):
        """Hash et stocke le mot de passe"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Vérifie le mot de passe"""
        return check_password_hash(self.password_hash, password)
    
    def set_reset_token(self, token):
        """Hash et stocke le token de reset"""
        self.reset_token = generate_password_hash(token)
    
    def check_reset_token(self, token):
        """Vérifie le token de reset"""
        if not self.reset_token:
            return False
        return check_password_hash(self.reset_token, token)
    
    def clear_reset_token(self):
        """Efface le token de reset"""
        self.reset_token = None
        self.reset_token_expires = None
    
    def set_otp(self, code):
        """Hash et stocke le code OTP"""
        self.otp_code = generate_password_hash(code)
        self.otp_attempts = 0
    
    def check_otp(self, code):
        """Vérifie le code OTP"""
        if not self.otp_code:
            return False
        return check_password_hash(self.otp_code, code)
    
    def clear_otp(self):
        """Efface le code OTP"""
        self.otp_code = None
        self.otp_expires = None
        self.otp_attempts = 0
    
    def to_dict(self):
        """Convertit en dictionnaire (sans données sensibles)"""
        return {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'is_active': self.is_active,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
    
    def __repr__(self):
        return f'<User {self.email}>'
