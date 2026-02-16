"""
Modèle Question - Banque de questions QCM
"""
from datetime import datetime
from app import db


class Question(db.Model):
    """
    Question du QCM avec ses options
    """
    __tablename__ = 'questions'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Contenu
    text = db.Column(db.Text, nullable=False)
    
    # Options (stockées en JSON)
    option_a = db.Column(db.String(500), nullable=False)
    option_b = db.Column(db.String(500), nullable=False)
    option_c = db.Column(db.String(500), nullable=False)
    option_d = db.Column(db.String(500), nullable=False)
    
    # Réponse correcte (0=A, 1=B, 2=C, 3=D)
    correct_answer = db.Column(db.Integer, nullable=False)
    
    # Classification
    category = db.Column(db.String(50), nullable=False)  # Logique, Algorithmique, Mathématiques, IA
    difficulty = db.Column(db.String(20), nullable=False, default='medium')  # easy, medium, hard
    
    # Statistiques
    times_shown = db.Column(db.Integer, default=0)
    times_correct = db.Column(db.Integer, default=0)
    
    # Statut
    is_active = db.Column(db.Boolean, default=True)
    
    # Dates
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    @property
    def options(self):
        """Retourne les options sous forme de liste"""
        return [self.option_a, self.option_b, self.option_c, self.option_d]
    
    @property
    def success_rate(self):
        """Taux de réussite de la question"""
        if self.times_shown == 0:
            return 0
        return round((self.times_correct / self.times_shown) * 100, 1)
    
    def check_answer(self, answer_index):
        """Vérifie si la réponse est correcte"""
        return answer_index == self.correct_answer
    
    def to_dict(self, include_answer=False):
        """Convertit en dictionnaire"""
        data = {
            'id': self.id,
            'text': self.text,
            'options': self.options,
            'category': self.category,
            'difficulty': self.difficulty
        }
        
        if include_answer:
            data['correct_answer'] = self.correct_answer
            data['times_shown'] = self.times_shown
            data['times_correct'] = self.times_correct
            data['success_rate'] = self.success_rate
            data['is_active'] = self.is_active
        
        return data
    
    def __repr__(self):
        return f'<Question {self.id}: {self.text[:50]}...>'
