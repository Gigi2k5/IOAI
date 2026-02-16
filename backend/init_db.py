"""
Script d'initialisation de la base de données pour la production.
Ce script crée les tables si elles n'existent pas et ajoute un admin par défaut.
Il ne supprime JAMAIS les données existantes.

Usage: python init_db.py
"""
import os
import sys
import secrets
import string

# Créer le dossier instance s'il n'existe pas
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INSTANCE_DIR = os.path.join(BASE_DIR, 'instance')
if not os.path.exists(INSTANCE_DIR):
    os.makedirs(INSTANCE_DIR)
    print(f"✓ Dossier instance créé: {INSTANCE_DIR}")

from app import create_app, db
from app.models import User, QCMSettings


def generate_password(length=16):
    """Génère un mot de passe aléatoire sécurisé"""
    alphabet = string.ascii_letters + string.digits + "!@#$%"
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def init_database():
    """Initialise la base de données sans supprimer les données existantes"""
    
    app = create_app('development')
    
    with app.app_context():
        # Créer les tables si elles n'existent pas (ne supprime pas les données!)
        print("📦 Création des tables si nécessaire...")
        db.create_all()
        print("✓ Tables créées/vérifiées")
        
        # Vérifier s'il existe déjà un admin
        admin = User.query.filter_by(role='admin').first()
        if not admin:
            print("👤 Création du compte administrateur...")
            password = generate_password()
            admin = User(
                email='admin@olympiades-ia.bj',
                role='admin',
                is_active=True,
                is_verified=True
            )
            admin.set_password(password)
            db.session.add(admin)
            db.session.commit()
            print(f"✓ Admin créé: admin@olympiades-ia.bj")
            print(f"  Mot de passe: {password}")
            print(f"  ⚠️  NOTEZ CE MOT DE PASSE, il ne sera plus affiché !")
        else:
            print(f"✓ Admin existant: {admin.email}")
            
        
        # Vérifier les paramètres QCM
        qcm_settings = QCMSettings.query.first()
        if not qcm_settings:
            print("⚙️  Création des paramètres QCM par défaut...")
            qcm_settings = QCMSettings(
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
            db.session.add(qcm_settings)
            db.session.commit()
            print("✓ Paramètres QCM créés")
        else:
            print("✓ Paramètres QCM existants")
        
        # Afficher le chemin de la base de données
        db_path = app.config['SQLALCHEMY_DATABASE_URI']
        print(f"\n📍 Base de données: {db_path}")
        
        # Compter les enregistrements existants
        from app.models import Candidate, Question, FAQ, News
        
        print("\n📊 État de la base de données:")
        print(f"   - Utilisateurs: {User.query.count()}")
        print(f"   - Candidats: {Candidate.query.count()}")
        print(f"   - Questions QCM: {Question.query.count()}")
        print(f"   - FAQ: {FAQ.query.count()}")
        print(f"   - Actualités: {News.query.count()}")
        
        print("\n✅ Base de données initialisée avec succès!")
        print("   Le serveur peut être démarré avec: python run.py")


if __name__ == '__main__':
    init_database()
