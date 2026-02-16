"""
Service de gestion des candidats
"""
from datetime import datetime, date
from app import db
from app.models import User, Candidate, AuditLog


class CandidateService:
    """Gère les opérations sur les candidats"""
    
    # === CANDIDAT (self) ===
    
    @staticmethod
    def get_profile(user_id):
        """Récupère le profil du candidat connecté"""
        user = User.query.get(user_id)
        if not user or not user.candidate:
            return None, "Profil non trouvé"
        
        return user.candidate.to_dict(include_private=True), None
    
    @staticmethod
    def update_profile(user_id, data):
        """
        Met à jour le profil du candidat
        
        Args:
            user_id: ID de l'utilisateur
            data: dict avec les champs à mettre à jour
        """
        user = User.query.get(user_id)
        if not user or not user.candidate:
            return None, "Profil non trouvé"
        
        candidate = user.candidate
        
        # Vérifier que le candidat peut encore modifier son profil
        if candidate.status not in ['draft', 'submitted']:
            return None, "Vous ne pouvez plus modifier votre profil"
        
        # Si le profil était soumis, le repasser en brouillon
        if candidate.status == 'submitted':
            candidate.status = 'draft'
            candidate.submitted_at = None
        
        # Champs modifiables
        allowed_fields = [
            'first_name', 'last_name', 'gender', 'phone', 'address', 
            'city', 'region', 'parent_name', 'parent_phone', 'parent_relation',
            'school_name', 'school_city', 'school_id', 'class_level',
            'average_t1', 'average_t2', 'average_t3',
            'math_average', 'science_average'
        ]
        
        for field in allowed_fields:
            if field in data:
                setattr(candidate, field, data[field])
        
        # Date de naissance (conversion)
        if 'birth_date' in data and data['birth_date']:
            try:
                if isinstance(data['birth_date'], str):
                    candidate.birth_date = datetime.strptime(data['birth_date'], '%Y-%m-%d').date()
                else:
                    candidate.birth_date = data['birth_date']
            except ValueError:
                return None, "Format de date invalide (YYYY-MM-DD)"
        
        # Validation de l'âge
        if candidate.birth_date:
            age = candidate.age
            if age < 14 or age > 18:
                return None, "L'âge doit être entre 14 et 18 ans"
        
        # Validation des moyennes
        for avg_field in ['average_t1', 'average_t2', 'average_t3', 'math_average', 'science_average']:
            if avg_field in data and data[avg_field] is not None:
                try:
                    val = float(data[avg_field])
                    if val < 0 or val > 20:
                        return None, f"La moyenne doit être entre 0 et 20"
                except (ValueError, TypeError):
                    return None, "Moyenne invalide"
        
        db.session.commit()
        
        return candidate.to_dict(include_private=True), None
    
    @staticmethod
    def submit_profile(user_id):
        """Soumet le profil pour validation"""
        user = User.query.get(user_id)
        if not user or not user.candidate:
            return None, "Profil non trouvé"
        
        candidate = user.candidate
        
        if candidate.status != 'draft':
            return None, "Le profil a déjà été soumis"
        
        # Vérifier que le profil est complet
        if not candidate.is_profile_complete:
            missing = []
            if not candidate.first_name: missing.append("prénom")
            if not candidate.last_name: missing.append("nom")
            if not candidate.birth_date: missing.append("date de naissance")
            if not candidate.gender: missing.append("genre")
            if not candidate.phone: missing.append("téléphone")
            if not candidate.city: missing.append("ville")
            if not candidate.school_name: missing.append("établissement")
            if not candidate.class_level: missing.append("classe")
            if candidate.is_minor:
                if not candidate.parent_name: missing.append("nom du parent")
                if not candidate.parent_phone: missing.append("téléphone du parent")
            
            return None, f"Champs manquants: {', '.join(missing)}"
        
        candidate.status = 'submitted'
        candidate.submitted_at = datetime.utcnow()
        
        AuditLog.log(
            user_id=user_id,
            action='submit_profile',
            entity_type='candidate',
            entity_id=candidate.id
        )
        
        db.session.commit()
        
        return candidate.to_dict(include_private=True), None
    
    @staticmethod
    def upload_photo(user_id, photo_url):
        """Met à jour la photo du candidat"""
        user = User.query.get(user_id)
        if not user or not user.candidate:
            return None, "Profil non trouvé"
        
        user.candidate.photo_url = photo_url
        db.session.commit()
        
        return {'photo_url': photo_url}, None
    
    # === ADMIN ===
    
    @staticmethod
    def get_all(filters=None, page=1, per_page=20):
        """
        Récupère tous les candidats avec filtres et pagination
        
        Args:
            filters: dict avec status, region, search, score_min, score_max
            page: numéro de page
            per_page: éléments par page
        """
        query = Candidate.query
        
        if filters:
            if filters.get('status'):
                query = query.filter(Candidate.status == filters['status'])
            
            if filters.get('region'):
                query = query.filter(Candidate.region == filters['region'])
            
            if filters.get('gender'):
                query = query.filter(Candidate.gender == filters['gender'])
            
            if filters.get('class_level'):
                query = query.filter(Candidate.class_level == filters['class_level'])
            
            if filters.get('search'):
                search = f"%{filters['search']}%"
                query = query.join(User).filter(
                    db.or_(
                        Candidate.first_name.ilike(search),
                        Candidate.last_name.ilike(search),
                        User.email.ilike(search),
                        Candidate.school_name.ilike(search)
                    )
                )
            
            if filters.get('score_min') is not None:
                query = query.filter(Candidate.qcm_score >= filters['score_min'])
            
            if filters.get('score_max') is not None:
                query = query.filter(Candidate.qcm_score <= filters['score_max'])
            
            if filters.get('has_score'):
                if filters['has_score'] == 'yes':
                    query = query.filter(Candidate.qcm_score.isnot(None))
                elif filters['has_score'] == 'no':
                    query = query.filter(Candidate.qcm_score.is_(None))
        
        # Tri par date de création décroissante
        query = query.order_by(Candidate.created_at.desc())
        
        # Pagination
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        candidates = []
        for c in pagination.items:
            data = c.to_dict(include_private=True)
            data['email'] = c.user.email if c.user else None
            candidates.append(data)
        
        return {
            'candidates': candidates,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page,
            'per_page': per_page,
            'has_next': pagination.has_next,
            'has_prev': pagination.has_prev
        }, None
    
    @staticmethod
    def get_by_id(candidate_id):
        """Récupère un candidat par son ID (admin)"""
        candidate = Candidate.query.get(candidate_id)
        if not candidate:
            return None, "Candidat non trouvé"
        
        data = candidate.to_dict(include_private=True)
        data['email'] = candidate.user.email if candidate.user else None
        
        return data, None
    
    @staticmethod
    def validate(candidate_id, admin_id, comment=None):
        """Valide une candidature"""
        candidate = Candidate.query.get(candidate_id)
        if not candidate:
            return None, "Candidat non trouvé"
        
        if candidate.status != 'submitted':
            return None, "Seuls les profils soumis peuvent être validés"
        
        candidate.status = 'validated'
        candidate.validated_at = datetime.utcnow()
        candidate.validated_by = admin_id
        candidate.admin_comment = comment
        candidate.rejection_reason = None
        
        AuditLog.log(
            user_id=admin_id,
            action='validate_candidate',
            entity_type='candidate',
            entity_id=candidate_id,
            details=comment
        )
        
        db.session.commit()
        
        # Notification automatique au candidat
        try:
            from app.services.notification_service import NotificationService
            NotificationService.notify_candidate_validated(candidate.user_id)
        except Exception:
            pass  # Ne pas bloquer si la notification échoue
        
        return candidate.to_dict(include_private=True), None
    
    @staticmethod
    def reject(candidate_id, admin_id, reason):
        """Rejette une candidature"""
        if not reason or not reason.strip():
            return None, "Le motif de rejet est obligatoire"
        
        candidate = Candidate.query.get(candidate_id)
        if not candidate:
            return None, "Candidat non trouvé"
        
        if candidate.status != 'submitted':
            return None, "Seuls les profils soumis peuvent être rejetés"
        
        candidate.status = 'rejected'
        candidate.rejected_at = datetime.utcnow()
        candidate.validated_by = admin_id
        candidate.rejection_reason = reason.strip()
        
        AuditLog.log(
            user_id=admin_id,
            action='reject_candidate',
            entity_type='candidate',
            entity_id=candidate_id,
            details=reason
        )
        
        db.session.commit()
        
        # Notification automatique au candidat
        try:
            from app.services.notification_service import NotificationService
            NotificationService.notify_candidate_rejected(candidate.user_id, reason)
        except Exception:
            pass  # Ne pas bloquer si la notification échoue
        
        return candidate.to_dict(include_private=True), None
    
    @staticmethod
    def bulk_validate(candidate_ids, admin_id):
        """Valide plusieurs candidatures"""
        validated = []
        errors = []
        
        for cid in candidate_ids:
            result, error = CandidateService.validate(cid, admin_id)
            if result:
                validated.append(cid)
            else:
                errors.append({'id': cid, 'error': error})
        
        return {
            'validated': validated,
            'errors': errors,
            'total_validated': len(validated)
        }, None
    
    @staticmethod
    def get_stats():
        """Statistiques globales des candidats"""
        total = Candidate.query.count()
        by_status = {
            'draft': Candidate.query.filter_by(status='draft').count(),
            'submitted': Candidate.query.filter_by(status='submitted').count(),
            'validated': Candidate.query.filter_by(status='validated').count(),
            'rejected': Candidate.query.filter_by(status='rejected').count()
        }
        by_gender = {
            'M': Candidate.query.filter_by(gender='M').count(),
            'F': Candidate.query.filter_by(gender='F').count()
        }
        
        # Par région
        regions = db.session.query(
            Candidate.region, db.func.count(Candidate.id)
        ).group_by(Candidate.region).all()
        by_region = {r[0] or 'Non renseigné': r[1] for r in regions}
        
        # Avec score QCM
        with_score = Candidate.query.filter(Candidate.qcm_score.isnot(None)).count()
        
        # Score moyen
        avg_score = db.session.query(db.func.avg(Candidate.qcm_score)).scalar()
        
        return {
            'total': total,
            'by_status': by_status,
            'by_gender': by_gender,
            'by_region': by_region,
            'with_qcm_score': with_score,
            'average_qcm_score': round(avg_score, 2) if avg_score else None
        }, None
