# Migrations

Pour initialiser les migrations Flask-Migrate :

```bash
cd backend
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

Note : En développement, le projet utilise `db.create_all()` automatiquement.
Les migrations seront nécessaires pour la production.
