"""
WSGI entry point for production (Render, Gunicorn)
"""
import sys
import os

# Ajouter le dossier backend au PYTHONPATH
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from run import app

if __name__ == "__main__":
    app.run()
