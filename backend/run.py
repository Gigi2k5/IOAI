"""
Point d'entrée pour lancer l'application
Usage: python run.py
"""
import os
from app import create_app, db

# Déterminer l'environnement
env = os.environ.get('FLASK_ENV', 'development')

# Créer l'application
app = create_app('default' if env == 'production' else env)

# Initialisation en production
with app.app_context():
    db.create_all()
    
    # Créer un admin par défaut si aucun n'existe
    from app.models import User, QCMSettings
    admin = User.query.filter_by(role='admin').first()
    if not admin:
        admin = User(
            email=os.environ.get('ADMIN_EMAIL', 'admin@olympiades-ia.bj'),
            role='admin',
            is_active=True,
            is_verified=True
        )
        admin.set_password(os.environ.get('ADMIN_PASSWORD', 'OlympiadesIA2026!'))
        db.session.add(admin)
        db.session.commit()
        print("✓ Admin par défaut créé")
    
    # Créer les paramètres QCM par défaut
    if not QCMSettings.query.first():
        settings = QCMSettings(
            total_questions=30,
            duration_minutes=45,
            passing_score=50,
            easy_count=5,
            medium_count=15,
            hard_count=10,
            randomize_questions=True,
            randomize_options=True,
            show_score_immediately=True
        )
        db.session.add(settings)
        db.session.commit()
        print("✓ Paramètres QCM créés")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = env == 'development'
    
    print(f"""
    ╔═══════════════════════════════════════════════════════════╗
    ║           🏆 Olympiades IA Bénin - API Backend            ║
    ╠═══════════════════════════════════════════════════════════╣
    ║  Environment : {env:<42} ║
    ║  Port        : {port:<42} ║
    ║  Debug       : {str(debug):<42} ║
    ║  URL         : http://localhost:{port:<36} ║
    ╚═══════════════════════════════════════════════════════════╝
    """)
    
    app.run(host='0.0.0.0', port=port, debug=debug)
