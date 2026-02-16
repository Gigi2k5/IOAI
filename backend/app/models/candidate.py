"""
Modèle Candidate - Profil complet du candidat
"""
from datetime import datetime, date
from app import db


class Candidate(db.Model):
    """
    Profil candidat avec toutes les informations requises
    """
    __tablename__ = 'candidates'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    
    # === Informations personnelles ===
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    birth_date = db.Column(db.Date)
    gender = db.Column(db.String(1))  # M ou F
    photo_url = db.Column(db.String(500))
    
    # === Coordonnées ===
    phone = db.Column(db.String(20))
    address = db.Column(db.String(255))
    city = db.Column(db.String(100))
    region = db.Column(db.String(100))  # Département
    
    # === Contact parent/tuteur ===
    parent_name = db.Column(db.String(200))
    parent_phone = db.Column(db.String(20))
    parent_relation = db.Column(db.String(50))  # pere, mere, tuteur, autre
    
    # === Informations scolaires ===
    school_id = db.Column(db.Integer, db.ForeignKey('schools.id'), nullable=True)  # FK vers School
    school_name = db.Column(db.String(200))  # Fallback texte libre
    school_city = db.Column(db.String(100))
    class_level = db.Column(db.String(20))  # 3eme, 2nde, 1ere, Tle
    
    # Moyennes générales par trimestre
    average_t1 = db.Column(db.Float)
    average_t2 = db.Column(db.Float)
    average_t3 = db.Column(db.Float)
    
    # Moyennes spécifiques
    math_average = db.Column(db.Float)      # Moyenne en mathématiques
    science_average = db.Column(db.Float)   # Moyenne en sciences
    
    # Documents (URLs vers fichiers uploadés)
    bulletin_t1_url = db.Column(db.String(500))
    bulletin_t2_url = db.Column(db.String(500))
    bulletin_t3_url = db.Column(db.String(500))
    
    # === Statut candidature ===
    status = db.Column(db.String(20), default='draft')  # draft, submitted, validated, rejected
    submitted_at = db.Column(db.DateTime)
    validated_at = db.Column(db.DateTime)
    rejected_at = db.Column(db.DateTime)
    
    # === Validation admin ===
    validated_by = db.Column(db.Integer)  # ID admin (sans FK pour éviter conflit)
    rejection_reason = db.Column(db.Text)
    admin_comment = db.Column(db.Text)
    
    # === QCM ===
    qcm_score = db.Column(db.Float)
    qcm_completed_at = db.Column(db.DateTime)
    
    # === Dates ===
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    @property
    def full_name(self):
        """Nom complet"""
        return f"{self.first_name} {self.last_name}"
    
    @property
    def age(self):
        """Calcule l'âge"""
        if not self.birth_date:
            return None
        today = date.today()
        return today.year - self.birth_date.year - (
            (today.month, today.day) < (self.birth_date.month, self.birth_date.day)
        )
    
    @property
    def is_minor(self):
        """Vérifie si le candidat est mineur"""
        return self.age is not None and self.age < 18
    
    @property
    def average_score(self):
        """Moyenne générale des 3 trimestres"""
        averages = [a for a in [self.average_t1, self.average_t2, self.average_t3] if a is not None]
        if not averages:
            return None
        return round(sum(averages) / len(averages), 2)
    
    @property
    def is_profile_complete(self):
        """Vérifie si le profil est complet pour soumission"""
        required = [
            self.first_name, self.last_name, self.birth_date, self.gender,
            self.phone, self.city, self.school_name, self.class_level
        ]
        # Contact parent obligatoire si mineur
        if self.is_minor:
            required.extend([self.parent_name, self.parent_phone])
        return all(required)
    
    def to_dict(self, include_private=False):
        """Convertit en dictionnaire"""
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': self.full_name,
            'birth_date': self.birth_date.isoformat() if self.birth_date else None,
            'age': self.age,
            'gender': self.gender,
            'photo_url': self.photo_url,
            'phone': self.phone,
            'city': self.city,
            'region': self.region,
            'school_id': self.school_id,
            'school_name': self.school_name,
            'class_level': self.class_level,
            'status': self.status,
            'is_profile_complete': self.is_profile_complete,
            'qcm_score': self.qcm_score,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        if include_private:
            data.update({
                'address': self.address,
                'parent_name': self.parent_name,
                'parent_phone': self.parent_phone,
                'parent_relation': self.parent_relation,
                'school_city': self.school_city,
                'average_t1': self.average_t1,
                'average_t2': self.average_t2,
                'average_t3': self.average_t3,
                'average_score': self.average_score,
                'math_average': self.math_average,
                'science_average': self.science_average,
                'bulletin_t1_url': self.bulletin_t1_url,
                'bulletin_t2_url': self.bulletin_t2_url,
                'bulletin_t3_url': self.bulletin_t3_url,
                'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
                'validated_at': self.validated_at.isoformat() if self.validated_at else None,
                'rejection_reason': self.rejection_reason,
                'admin_comment': self.admin_comment
            })
        
        return data
    
    def __repr__(self):
        return f'<Candidate {self.full_name}>'
