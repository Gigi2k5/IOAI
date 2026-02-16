"""
Service de gestion des établissements scolaires
"""
from app import db
from app.models import School


class SchoolService:
    """Gère les établissements scolaires"""
    
    @staticmethod
    def search(query=None, region=None, limit=20):
        """
        Recherche des établissements (autocomplete)
        
        Args:
            query: terme de recherche
            region: filtrer par région/département
            limit: nombre max de résultats
            
        Returns:
            list: Liste d'établissements
        """
        q = School.query.filter(School.is_active == True)
        
        if query:
            search_term = f"%{query}%"
            q = q.filter(
                db.or_(
                    School.name.ilike(search_term),
                    School.city.ilike(search_term)
                )
            )
        
        if region:
            q = q.filter(School.region == region)
        
        schools = q.order_by(School.name).limit(limit).all()
        return schools
    
    @staticmethod
    def get_all(page=1, per_page=50, search=None, region=None):
        """
        Liste tous les établissements (admin)
        
        Returns:
            tuple: (schools, total_count)
        """
        q = School.query
        
        if search:
            search_term = f"%{search}%"
            q = q.filter(
                db.or_(
                    School.name.ilike(search_term),
                    School.city.ilike(search_term)
                )
            )
        
        if region:
            q = q.filter(School.region == region)
        
        total = q.count()
        schools = q.order_by(School.name).offset((page - 1) * per_page).limit(per_page).all()
        
        return schools, total
    
    @staticmethod
    def get_by_id(school_id):
        """Récupère un établissement par son ID"""
        return School.query.get(school_id)
    
    @staticmethod
    def create(name, city=None, region=None, type=None):
        """
        Crée un nouvel établissement
        
        Returns:
            tuple: (school, error_message)
        """
        if not name:
            return None, "Le nom est requis"
        
        # Vérifier si l'établissement existe déjà
        existing = School.query.filter(
            School.name.ilike(name),
            School.city == city
        ).first()
        
        if existing:
            return None, "Cet établissement existe déjà"
        
        school = School(
            name=name.strip(),
            city=city.strip() if city else None,
            region=region.strip() if region else None,
            type=type
        )
        
        db.session.add(school)
        db.session.commit()
        
        return school, None
    
    @staticmethod
    def update(school_id, **kwargs):
        """
        Met à jour un établissement
        
        Returns:
            tuple: (school, error_message)
        """
        school = School.query.get(school_id)
        
        if not school:
            return None, "Établissement non trouvé"
        
        if 'name' in kwargs and kwargs['name']:
            school.name = kwargs['name'].strip()
        if 'city' in kwargs:
            school.city = kwargs['city'].strip() if kwargs['city'] else None
        if 'region' in kwargs:
            school.region = kwargs['region'].strip() if kwargs['region'] else None
        if 'type' in kwargs:
            school.type = kwargs['type']
        if 'is_active' in kwargs:
            school.is_active = kwargs['is_active']
        
        db.session.commit()
        return school, None
    
    @staticmethod
    def delete(school_id):
        """
        Supprime un établissement (soft delete)
        
        Returns:
            tuple: (success, error_message)
        """
        school = School.query.get(school_id)
        
        if not school:
            return False, "Établissement non trouvé"
        
        # Vérifier s'il y a des candidats liés
        if school.candidates.count() > 0:
            # Soft delete
            school.is_active = False
            db.session.commit()
            return True, None
        
        # Hard delete si pas de candidats
        db.session.delete(school)
        db.session.commit()
        return True, None
    
    @staticmethod
    def import_from_list(schools_data):
        """
        Import en masse d'établissements
        
        Args:
            schools_data: Liste de dicts avec name, city, region, type
            
        Returns:
            dict: {imported: int, errors: list}
        """
        imported = 0
        errors = []
        
        for i, data in enumerate(schools_data, 1):
            name = data.get('name', '').strip()
            
            if not name:
                errors.append({'row': i, 'error': 'Nom manquant'})
                continue
            
            # Vérifier si existe déjà
            city = data.get('city', '').strip() if data.get('city') else None
            existing = School.query.filter(
                School.name.ilike(name),
                School.city == city
            ).first()
            
            if existing:
                errors.append({'row': i, 'error': f'Établissement déjà existant: {name}'})
                continue
            
            school = School(
                name=name,
                city=city,
                region=data.get('region', '').strip() if data.get('region') else None,
                type=data.get('type')
            )
            db.session.add(school)
            imported += 1
        
        if imported > 0:
            db.session.commit()
        
        return {
            'imported': imported,
            'errors': errors
        }
    
    @staticmethod
    def get_regions():
        """Retourne la liste des régions/départements distincts"""
        regions = db.session.query(School.region).filter(
            School.region.isnot(None),
            School.is_active == True
        ).distinct().order_by(School.region).all()
        
        return [r[0] for r in regions if r[0]]
