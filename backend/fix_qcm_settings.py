"""
Corrige les paramètres du QCM pour correspondre aux questions disponibles
"""
from app import create_app, db
from app.models import Question, QCMSettings

app = create_app('development')

with app.app_context():
    # Compter les questions par difficulté
    easy = Question.query.filter_by(difficulty='easy', is_active=True).count()
    medium = Question.query.filter_by(difficulty='medium', is_active=True).count()
    hard = Question.query.filter_by(difficulty='hard', is_active=True).count()
    total = easy + medium + hard
    
    print(f"Questions disponibles:")
    print(f"  Easy: {easy}")
    print(f"  Medium: {medium}")
    print(f"  Hard: {hard}")
    print(f"  Total: {total}")
    
    # Mettre à jour les paramètres
    settings = QCMSettings.get_settings()
    settings.easy_count = min(3, easy)
    settings.medium_count = min(10, medium)
    settings.hard_count = min(5, hard)
    settings.total_questions = settings.easy_count + settings.medium_count + settings.hard_count
    
    db.session.commit()
    
    print(f"\nParamètres mis à jour:")
    print(f"  Easy: {settings.easy_count}")
    print(f"  Medium: {settings.medium_count}")
    print(f"  Hard: {settings.hard_count}")
    print(f"  Total: {settings.total_questions}")
