"""
Service de gestion des fichiers uploadés
"""
import os
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename
from flask import current_app


class FileService:
    """Gère l'upload et la suppression des fichiers"""
    
    ALLOWED_IMAGE_EXT = {'jpg', 'jpeg', 'png', 'webp', 'avif'}
    ALLOWED_DOC_EXT = {'pdf'}
    MAX_IMAGE_SIZE = 5 * 1024 * 1024   # 5 MB
    MAX_DOC_SIZE = 10 * 1024 * 1024    # 10 MB
    
    @staticmethod
    def get_upload_folder():
        """Retourne le dossier d'upload"""
        return current_app.config.get('UPLOAD_FOLDER', 'uploads')
    
    @staticmethod
    def allowed_file(filename, allowed_extensions):
        """Vérifie si l'extension est autorisée"""
        if '.' not in filename:
            return False
        ext = filename.rsplit('.', 1)[1].lower()
        return ext in allowed_extensions
    
    @staticmethod
    def get_extension(filename):
        """Extrait l'extension du fichier"""
        if '.' not in filename:
            return ''
        return filename.rsplit('.', 1)[1].lower()
    
    @staticmethod
    def generate_unique_filename(original_filename):
        """Génère un nom de fichier unique"""
        ext = FileService.get_extension(original_filename)
        unique_id = uuid.uuid4().hex[:12]
        timestamp = datetime.utcnow().strftime('%Y%m%d')
        return f"{timestamp}_{unique_id}.{ext}"
    
    @staticmethod
    def save_image(file, subfolder='photos'):
        """
        Sauvegarde une image
        
        Args:
            file: FileStorage object
            subfolder: sous-dossier (photos, bulletins)
            
        Returns:
            tuple: (relative_path, error_message)
        """
        if not file or not file.filename:
            return None, "Aucun fichier fourni"
        
        # Vérifier l'extension
        if not FileService.allowed_file(file.filename, FileService.ALLOWED_IMAGE_EXT):
            return None, f"Extension non autorisée. Formats acceptés: {', '.join(FileService.ALLOWED_IMAGE_EXT)}"
        
        # Vérifier la taille
        file.seek(0, 2)  # Aller à la fin
        size = file.tell()
        file.seek(0)  # Revenir au début
        
        if size > FileService.MAX_IMAGE_SIZE:
            return None, f"Fichier trop volumineux. Maximum: {FileService.MAX_IMAGE_SIZE // (1024*1024)} MB"
        
        # Générer le nom unique
        filename = FileService.generate_unique_filename(file.filename)
        
        # Créer le chemin complet
        upload_folder = FileService.get_upload_folder()
        target_folder = os.path.join(upload_folder, subfolder)
        
        # Créer le dossier si nécessaire
        os.makedirs(target_folder, exist_ok=True)
        
        # Sauvegarder
        filepath = os.path.join(target_folder, filename)
        file.save(filepath)
        
        # Retourner le chemin relatif
        relative_path = f"{subfolder}/{filename}"
        return relative_path, None
    
    @staticmethod
    def save_document(file, subfolder='bulletins'):
        """
        Sauvegarde un document (PDF)
        
        Args:
            file: FileStorage object
            subfolder: sous-dossier
            
        Returns:
            tuple: (relative_path, error_message)
        """
        if not file or not file.filename:
            return None, "Aucun fichier fourni"
        
        # Vérifier l'extension
        if not FileService.allowed_file(file.filename, FileService.ALLOWED_DOC_EXT):
            return None, f"Extension non autorisée. Formats acceptés: {', '.join(FileService.ALLOWED_DOC_EXT)}"
        
        # Vérifier la taille
        file.seek(0, 2)
        size = file.tell()
        file.seek(0)
        
        if size > FileService.MAX_DOC_SIZE:
            return None, f"Fichier trop volumineux. Maximum: {FileService.MAX_DOC_SIZE // (1024*1024)} MB"
        
        # Générer le nom unique
        filename = FileService.generate_unique_filename(file.filename)
        
        # Créer le chemin complet
        upload_folder = FileService.get_upload_folder()
        target_folder = os.path.join(upload_folder, subfolder)
        
        os.makedirs(target_folder, exist_ok=True)
        
        # Sauvegarder
        filepath = os.path.join(target_folder, filename)
        file.save(filepath)
        
        relative_path = f"{subfolder}/{filename}"
        return relative_path, None
    
    @staticmethod
    def delete_file(relative_path):
        """
        Supprime un fichier
        
        Args:
            relative_path: chemin relatif (ex: photos/20240101_abc123.jpg)
            
        Returns:
            bool: True si supprimé, False sinon
        """
        if not relative_path:
            return False
        
        upload_folder = FileService.get_upload_folder()
        filepath = os.path.join(upload_folder, relative_path)
        
        try:
            if os.path.exists(filepath):
                os.remove(filepath)
                return True
        except Exception as e:
            print(f"Erreur suppression fichier: {e}")
        
        return False
    
    @staticmethod
    def get_file_url(relative_path):
        """
        Retourne l'URL publique d'un fichier
        
        Args:
            relative_path: chemin relatif
            
        Returns:
            str: URL complète
        """
        if not relative_path:
            return None
        return f"/uploads/{relative_path}"
    
    @staticmethod
    def file_exists(relative_path):
        """Vérifie si un fichier existe"""
        if not relative_path:
            return False
        
        upload_folder = FileService.get_upload_folder()
        filepath = os.path.join(upload_folder, relative_path)
        return os.path.exists(filepath)
