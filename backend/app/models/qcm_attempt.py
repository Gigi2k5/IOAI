"""
Modèle QCMAttempt - Tentative de passage du QCM
"""
from datetime import datetime
from app import db
import json


class QCMAttempt(db.Model):
    """
    Enregistre une tentative de passage du QCM par un candidat
    """
    __tablename__ = 'qcm_attempts'
    
    id = db.Column(db.Integer, primary_key=True)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidates.id'), nullable=False)
    
    # Timing
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    finished_at = db.Column(db.DateTime)
    time_limit_minutes = db.Column(db.Integer, default=30)
    
    # Résultat
    score = db.Column(db.Float)  # Score en pourcentage
    correct_count = db.Column(db.Integer, default=0)
    total_questions = db.Column(db.Integer)
    
    # Statut
    status = db.Column(db.String(20), default='in_progress')  # in_progress, completed, expired
    
    # Questions posées (IDs séparés par virgule)
    question_ids = db.Column(db.Text)  # "1,5,12,8,..." 
    
    # Réponses données (indices séparés par virgule, -1 = pas répondu)
    answers = db.Column(db.Text)  # "0,2,1,-1,3,..."
    
    # === Anti-triche ===
    tab_switches = db.Column(db.Integer, default=0)       # Nombre de changements d'onglet
    fullscreen_exits = db.Column(db.Integer, default=0)   # Nombre de sorties plein écran
    cheat_events = db.Column(db.Text)                     # JSON: [{type, timestamp}, ...]
    is_flagged = db.Column(db.Boolean, default=False)     # Marqué comme suspect
    
    # Relation
    candidate = db.relationship('Candidate', backref='qcm_attempts')
    
    @property
    def duration_minutes(self):
        """Durée de la tentative en minutes"""
        if not self.finished_at:
            return None
        delta = self.finished_at - self.started_at
        return round(delta.total_seconds() / 60, 1)
    
    @property
    def is_expired(self):
        """Vérifie si le temps est écoulé"""
        if self.status == 'completed':
            return False
        elapsed = (datetime.utcnow() - self.started_at).total_seconds() / 60
        return elapsed > self.time_limit_minutes
    
    @property
    def time_remaining_seconds(self):
        """Temps restant en secondes"""
        if self.status != 'in_progress':
            return 0
        elapsed = (datetime.utcnow() - self.started_at).total_seconds()
        remaining = (self.time_limit_minutes * 60) - elapsed
        return max(0, int(remaining))
    
    def get_question_ids_list(self):
        """Retourne la liste des IDs de questions"""
        if not self.question_ids:
            return []
        return [int(qid) for qid in self.question_ids.split(',')]
    
    def get_answers_list(self):
        """Retourne la liste des réponses"""
        if not self.answers:
            return []
        return [int(a) for a in self.answers.split(',')]
    
    def set_answers(self, answers_list):
        """Enregistre les réponses"""
        self.answers = ','.join(str(a) for a in answers_list)
    
    def get_cheat_events(self):
        """Retourne la liste des événements de triche"""
        if not self.cheat_events:
            return []
        try:
            return json.loads(self.cheat_events)
        except json.JSONDecodeError:
            return []
    
    def add_cheat_event(self, event_type):
        """Ajoute un événement de triche"""
        events = self.get_cheat_events()
        events.append({
            'type': event_type,
            'timestamp': datetime.utcnow().isoformat()
        })
        self.cheat_events = json.dumps(events)
        
        # Mettre à jour les compteurs
        if event_type == 'tab_switch':
            self.tab_switches = (self.tab_switches or 0) + 1
        elif event_type == 'fullscreen_exit':
            self.fullscreen_exits = (self.fullscreen_exits or 0) + 1
        
        # Flaguer si seuils dépassés
        if (self.tab_switches or 0) >= 3 or (self.fullscreen_exits or 0) >= 2:
            self.is_flagged = True
    
    def to_dict(self, include_cheat_info=False):
        """Convertit en dictionnaire"""
        data = {
            'id': self.id,
            'candidate_id': self.candidate_id,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'finished_at': self.finished_at.isoformat() if self.finished_at else None,
            'duration_minutes': self.duration_minutes,
            'time_limit_minutes': self.time_limit_minutes,
            'time_remaining_seconds': self.time_remaining_seconds,
            'score': self.score,
            'correct_count': self.correct_count,
            'total_questions': self.total_questions,
            'status': self.status
        }
        
        # Informations anti-triche (pour admin uniquement)
        if include_cheat_info:
            data.update({
                'tab_switches': self.tab_switches or 0,
                'fullscreen_exits': self.fullscreen_exits or 0,
                'is_flagged': self.is_flagged or False,
                'cheat_events': self.get_cheat_events()
            })
        
        return data
    
    def __repr__(self):
        return f'<QCMAttempt {self.id} - Candidate {self.candidate_id}>'
