# 🏆 Olympiades IA Bénin - Backend API

API REST pour la plateforme des Olympiades d'Intelligence Artificielle du Bénin.

## 📁 Structure du Projet

```
backend/
├── app/
│   ├── __init__.py          # Application factory + JWT handlers
│   ├── api/routes/
│   │   ├── auth.py          # Authentification JWT
│   │   └── health.py        # Santé API
│   ├── models/              # 10 modèles SQLAlchemy
│   ├── services/
│   │   └── auth_service.py  # Logique authentification
│   └── utils/
│       └── decorators.py    # @admin_required, etc.
├── config.py                # Configuration multi-env
├── run.py                   # Point d'entrée
├── seed.py                  # Données de test
└── requirements.txt
```

## 🚀 Installation

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt

# Initialiser la base avec données de test
python seed.py

# Lancer le serveur
python run.py
```

## 🔐 Authentification API

### Inscription
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### Connexion
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidat@test.com",
    "password": "password123"
  }'
```

Réponse:
```json
{
  "success": true,
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "user": {
    "id": 1,
    "email": "candidat@test.com",
    "role": "candidate"
  }
}
```

### Utiliser le token
```bash
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <access_token>"
```

### Rafraîchir le token
```bash
curl -X POST http://localhost:5000/api/v1/auth/refresh \
  -H "Authorization: Bearer <refresh_token>"
```

## 📡 Endpoints

### Santé
| Méthode | URL | Auth | Description |
|---------|-----|------|-------------|
| GET | `/health` | Non | Statut API |
| GET | `/api/v1/health` | Non | Statut détaillé |
| GET | `/api/v1/health/db` | Non | Test DB |
| GET | `/api/v1/health/auth` | JWT | Test auth |
| GET | `/api/v1/health/admin` | Admin | Test admin |
| GET | `/api/v1/stats/public` | Non | Stats publiques |

### Authentification
| Méthode | URL | Auth | Description |
|---------|-----|------|-------------|
| POST | `/api/v1/auth/register` | Non | Inscription |
| POST | `/api/v1/auth/login` | Non | Connexion |
| GET | `/api/v1/auth/me` | JWT | Profil utilisateur |
| POST | `/api/v1/auth/refresh` | Refresh | Nouveau access token |
| POST | `/api/v1/auth/change-password` | JWT | Changer mot de passe |
| POST | `/api/v1/auth/logout` | JWT | Déconnexion |
| GET | `/api/v1/auth/verify-token` | JWT | Vérifier token |

## 👤 Comptes de Test

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| `admin@olympiades-ia.bj` | `admin123` | admin |
| `superadmin@olympiades-ia.bj` | `super123` | super_admin |
| `candidat@test.com` | `password123` | candidate |

## 🔒 Décorateurs de Permission

```python
from app.utils import admin_required, candidate_required

@bp.route('/admin-only')
@admin_required()
def admin_route():
    pass

@bp.route('/candidate-only')
@candidate_required()
def candidate_route():
    pass
```

## ⚠️ Codes d'Erreur JWT

| Code | Description |
|------|-------------|
| `TOKEN_EXPIRED` | Token expiré (re-login ou refresh) |
| `TOKEN_INVALID` | Token malformé |
| `TOKEN_MISSING` | Header Authorization manquant |
| `TOKEN_REVOKED` | Token révoqué |

## 📦 Prochaines Phases

- **Phase 4** : CRUD Candidat complet
- **Phase 5** : Système QCM
- **Phase 6** : Administration
