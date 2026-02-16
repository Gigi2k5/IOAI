"""
Service de gestion du QCM
"""
from datetime import datetime
import random
from app import db
from app.models import Candidate, Question, QCMAttempt, QCMSettings, AuditLog


class QCMService:
    """Gère le passage du QCM"""
    
    @staticmethod
    def get_settings():
        """Récupère les paramètres du QCM"""
        settings = QCMSettings.get_settings()
        return settings.to_dict(), None
    
    @staticmethod
    def can_start_qcm(user_id):
        """Vérifie si le candidat peut passer le QCM"""
        candidate = Candidate.query.filter_by(user_id=user_id).first()
        
        if not candidate:
            return False, "Profil candidat non trouvé"
        
        # Doit être validé
        if candidate.status != 'validated':
            return False, "Votre candidature doit être validée pour passer le QCM"
        
        # Vérifier s'il a déjà passé le QCM
        existing = QCMAttempt.query.filter_by(
            candidate_id=candidate.id,
            status='completed'
        ).first()
        
        if existing:
            return False, "Vous avez déjà passé le QCM"
        
        # Vérifier s'il a une tentative en cours
        in_progress = QCMAttempt.query.filter_by(
            candidate_id=candidate.id,
            status='in_progress'
        ).first()
        
        if in_progress:
            if in_progress.is_expired:
                # Marquer comme expiré
                in_progress.status = 'expired'
                db.session.commit()
                return False, "Votre temps est écoulé. Le QCM a été clôturé."
            else:
                return True, "Tentative en cours"
        
        # Vérifier si le QCM est ouvert
        settings = QCMSettings.get_settings()
        if not settings.is_open:
            return False, "Le QCM n'est pas ouvert actuellement"
        
        return True, None
    
    @staticmethod
    def start_qcm(user_id):
        """Démarre une nouvelle tentative de QCM"""
        # Vérifier éligibilité
        can_start, message = QCMService.can_start_qcm(user_id)
        if not can_start:
            return None, message
        
        candidate = Candidate.query.filter_by(user_id=user_id).first()
        settings = QCMSettings.get_settings()
        
        # Vérifier s'il y a une tentative en cours
        existing = QCMAttempt.query.filter_by(
            candidate_id=candidate.id,
            status='in_progress'
        ).first()
        
        if existing and not existing.is_expired:
            # Retourner la tentative existante
            questions = Question.query.filter(
                Question.id.in_(existing.get_question_ids_list())
            ).all()
            
            # Respecter l'ordre original
            question_map = {q.id: q for q in questions}
            ordered_questions = [question_map[qid] for qid in existing.get_question_ids_list()]
            
            return {
                'attempt_id': existing.id,
                'time_remaining_seconds': existing.time_remaining_seconds,
                'total_questions': existing.total_questions,
                'questions': [q.to_dict(include_answer=False) for q in ordered_questions],
                'answers': existing.get_answers_list()
            }, None
        
        # Sélectionner les questions aléatoirement
        questions = QCMService._select_questions(settings)
        
        if len(questions) < settings.total_questions:
            return None, f"Pas assez de questions disponibles ({len(questions)}/{settings.total_questions})"
        
        # Créer la tentative
        attempt = QCMAttempt(
            candidate_id=candidate.id,
            time_limit_minutes=settings.duration_minutes,
            total_questions=len(questions),
            question_ids=','.join(str(q.id) for q in questions),
            answers=','.join(['-1'] * len(questions)),  # -1 = pas répondu
            status='in_progress'
        )
        
        db.session.add(attempt)
        
        # Log
        AuditLog.log(
            user_id=user_id,
            action='start_qcm',
            entity_type='qcm_attempt',
            entity_id=attempt.id
        )
        
        db.session.commit()
        
        return {
            'attempt_id': attempt.id,
            'time_remaining_seconds': attempt.time_remaining_seconds,
            'total_questions': attempt.total_questions,
            'questions': [q.to_dict(include_answer=False) for q in questions],
            'answers': attempt.get_answers_list()
        }, None
    
    @staticmethod
    def _select_questions(settings):
        """Sélectionne les questions selon les paramètres"""
        questions = []
        
        # Par difficulté
        easy = Question.query.filter_by(difficulty='easy', is_active=True).all()
        medium = Question.query.filter_by(difficulty='medium', is_active=True).all()
        hard = Question.query.filter_by(difficulty='hard', is_active=True).all()
        
        if settings.randomize_questions:
            random.shuffle(easy)
            random.shuffle(medium)
            random.shuffle(hard)
        
        questions.extend(easy[:settings.easy_count])
        questions.extend(medium[:settings.medium_count])
        questions.extend(hard[:settings.hard_count])
        
        if settings.randomize_questions:
            random.shuffle(questions)
        
        return questions
    
    @staticmethod
    def save_answer(user_id, attempt_id, question_index, answer_index):
        """Sauvegarde une réponse"""
        candidate = Candidate.query.filter_by(user_id=user_id).first()
        if not candidate:
            return None, "Candidat non trouvé"
        
        attempt = QCMAttempt.query.filter_by(
            id=attempt_id,
            candidate_id=candidate.id,
            status='in_progress'
        ).first()
        
        if not attempt:
            return None, "Tentative non trouvée ou déjà terminée"
        
        if attempt.is_expired:
            attempt.status = 'expired'
            db.session.commit()
            return None, "Temps écoulé"
        
        # Mettre à jour la réponse
        answers = attempt.get_answers_list()
        if 0 <= question_index < len(answers):
            answers[question_index] = answer_index
            attempt.set_answers(answers)
            db.session.commit()
            
            return {
                'saved': True,
                'question_index': question_index,
                'answer_index': answer_index,
                'time_remaining_seconds': attempt.time_remaining_seconds
            }, None
        
        return None, "Index de question invalide"
    
    @staticmethod
    def submit_qcm(user_id, attempt_id):
        """Soumet le QCM et calcule le score"""
        candidate = Candidate.query.filter_by(user_id=user_id).first()
        if not candidate:
            return None, "Candidat non trouvé"
        
        attempt = QCMAttempt.query.filter_by(
            id=attempt_id,
            candidate_id=candidate.id
        ).first()
        
        if not attempt:
            return None, "Tentative non trouvée"
        
        if attempt.status == 'completed':
            return None, "QCM déjà soumis"
        
        # Calculer le score
        questions = Question.query.filter(
            Question.id.in_(attempt.get_question_ids_list())
        ).all()
        question_map = {q.id: q for q in questions}
        
        answers = attempt.get_answers_list()
        question_ids = attempt.get_question_ids_list()
        
        correct_count = 0
        results = []
        
        for i, qid in enumerate(question_ids):
            question = question_map.get(qid)
            if question:
                user_answer = answers[i] if i < len(answers) else -1
                is_correct = question.check_answer(user_answer)
                
                if is_correct:
                    correct_count += 1
                
                # Mettre à jour les stats de la question
                question.times_shown += 1
                if is_correct:
                    question.times_correct += 1
                
                results.append({
                    'question_id': qid,
                    'question_text': question.text,
                    'user_answer': user_answer,
                    'correct_answer': question.correct_answer,
                    'is_correct': is_correct,
                    'options': question.options
                })
        
        # Calculer le score
        score = round((correct_count / len(question_ids)) * 100, 2) if question_ids else 0
        
        # Mettre à jour la tentative
        attempt.status = 'completed'
        attempt.finished_at = datetime.utcnow()
        attempt.score = score
        attempt.correct_count = correct_count
        
        # Mettre à jour le candidat
        candidate.qcm_score = score
        candidate.qcm_completed_at = datetime.utcnow()
        
        # Log
        AuditLog.log(
            user_id=user_id,
            action='submit_qcm',
            entity_type='qcm_attempt',
            entity_id=attempt.id,
            details=f"Score: {score}%"
        )
        
        db.session.commit()
        
        # Notification automatique au candidat
        try:
            from app.services.notification_service import NotificationService
            NotificationService.notify_qcm_result(user_id, score)
        except Exception:
            pass  # Ne pas bloquer si la notification échoue
        
        settings = QCMSettings.get_settings()
        
        return {
            'score': score,
            'correct_count': correct_count,
            'total_questions': len(question_ids),
            'passed': score >= settings.passing_score,
            'passing_score': settings.passing_score,
            'duration_minutes': attempt.duration_minutes,
            'results': results if settings.show_score_immediately else None
        }, None
    
    @staticmethod
    def get_result(user_id):
        """Récupère le résultat du QCM pour un candidat"""
        candidate = Candidate.query.filter_by(user_id=user_id).first()
        if not candidate:
            return None, "Candidat non trouvé"
        
        attempt = QCMAttempt.query.filter_by(
            candidate_id=candidate.id,
            status='completed'
        ).order_by(QCMAttempt.finished_at.desc()).first()
        
        if not attempt:
            return None, "Aucun QCM complété"
        
        settings = QCMSettings.get_settings()
        
        return {
            'score': attempt.score,
            'correct_count': attempt.correct_count,
            'total_questions': attempt.total_questions,
            'passed': attempt.score >= settings.passing_score,
            'passing_score': settings.passing_score,
            'duration_minutes': attempt.duration_minutes,
            'completed_at': attempt.finished_at.isoformat() if attempt.finished_at else None
        }, None
    
    @staticmethod
    def get_attempt_status(user_id):
        """Vérifie le statut de la tentative du candidat"""
        candidate = Candidate.query.filter_by(user_id=user_id).first()
        if not candidate:
            return None, "Candidat non trouvé"
        
        # Vérifier tentative en cours
        in_progress = QCMAttempt.query.filter_by(
            candidate_id=candidate.id,
            status='in_progress'
        ).first()
        
        if in_progress:
            if in_progress.is_expired:
                in_progress.status = 'expired'
                db.session.commit()
                return {'status': 'expired', 'can_start': False}, None
            return {
                'status': 'in_progress',
                'attempt_id': in_progress.id,
                'time_remaining_seconds': in_progress.time_remaining_seconds,
                'can_start': True
            }, None
        
        # Vérifier si complété
        completed = QCMAttempt.query.filter_by(
            candidate_id=candidate.id,
            status='completed'
        ).first()
        
        if completed:
            return {
                'status': 'completed',
                'score': completed.score,
                'can_start': False
            }, None
        
        # Peut commencer
        can_start, message = QCMService.can_start_qcm(user_id)
        return {
            'status': 'not_started',
            'can_start': can_start,
            'message': message
        }, None


class QCMAdminService:
    """Gestion admin du QCM"""
    
    @staticmethod
    def get_all_questions(filters=None, page=1, per_page=20):
        """Liste toutes les questions"""
        query = Question.query
        
        if filters:
            if filters.get('category'):
                query = query.filter(Question.category == filters['category'])
            if filters.get('difficulty'):
                query = query.filter(Question.difficulty == filters['difficulty'])
            if filters.get('is_active') is not None:
                query = query.filter(Question.is_active == filters['is_active'])
            if filters.get('search'):
                query = query.filter(Question.text.ilike(f"%{filters['search']}%"))
        
        query = query.order_by(Question.created_at.desc())
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return {
            'questions': [q.to_dict(include_answer=True) for q in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }, None
    
    @staticmethod
    def create_question(data, admin_id):
        """Crée une nouvelle question"""
        required = ['text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'category', 'difficulty']
        missing = [f for f in required if f not in data or data[f] is None]
        if missing:
            return None, f"Champs requis: {', '.join(missing)}"
        
        question = Question(
            text=data['text'],
            option_a=data['option_a'],
            option_b=data['option_b'],
            option_c=data['option_c'],
            option_d=data['option_d'],
            correct_answer=int(data['correct_answer']),
            category=data['category'],
            difficulty=data['difficulty'],
            is_active=data.get('is_active', True),
            created_by=admin_id
        )
        
        db.session.add(question)
        db.session.commit()
        
        return question.to_dict(include_answer=True), None
    
    @staticmethod
    def update_question(question_id, data, admin_id):
        """Met à jour une question"""
        question = Question.query.get(question_id)
        if not question:
            return None, "Question non trouvée"
        
        fields = ['text', 'option_a', 'option_b', 'option_c', 'option_d', 
                  'correct_answer', 'category', 'difficulty', 'is_active']
        
        for field in fields:
            if field in data:
                setattr(question, field, data[field])
        
        db.session.commit()
        return question.to_dict(include_answer=True), None
    
    @staticmethod
    def delete_question(question_id):
        """Supprime une question"""
        question = Question.query.get(question_id)
        if not question:
            return None, "Question non trouvée"
        
        db.session.delete(question)
        db.session.commit()
        return {'deleted': True}, None
    
    @staticmethod
    def update_settings(data, admin_id):
        """Met à jour les paramètres du QCM"""
        settings = QCMSettings.get_settings()
        
        fields = ['duration_minutes', 'total_questions', 'passing_score',
                  'easy_count', 'medium_count', 'hard_count',
                  'randomize_questions', 'randomize_options', 'show_score_immediately']
        
        for field in fields:
            if field in data:
                setattr(settings, field, data[field])
        
        if 'open_date' in data:
            settings.open_date = datetime.fromisoformat(data['open_date']) if data['open_date'] else None
        if 'close_date' in data:
            settings.close_date = datetime.fromisoformat(data['close_date']) if data['close_date'] else None
        
        settings.updated_by = admin_id
        db.session.commit()
        
        return settings.to_dict(), None
    
    @staticmethod
    def get_qcm_stats():
        """Statistiques du QCM"""
        total_attempts = QCMAttempt.query.filter_by(status='completed').count()
        
        if total_attempts == 0:
            return {
                'total_attempts': 0,
                'average_score': 0,
                'pass_rate': 0,
                'average_duration': 0
            }, None
        
        avg_score = db.session.query(db.func.avg(QCMAttempt.score)).filter(
            QCMAttempt.status == 'completed'
        ).scalar() or 0
        
        settings = QCMSettings.get_settings()
        passed = QCMAttempt.query.filter(
            QCMAttempt.status == 'completed',
            QCMAttempt.score >= settings.passing_score
        ).count()
        
        return {
            'total_attempts': total_attempts,
            'average_score': round(avg_score, 2),
            'pass_rate': round((passed / total_attempts) * 100, 2),
            'total_questions': Question.query.filter_by(is_active=True).count(),
            'by_difficulty': {
                'easy': Question.query.filter_by(difficulty='easy', is_active=True).count(),
                'medium': Question.query.filter_by(difficulty='medium', is_active=True).count(),
                'hard': Question.query.filter_by(difficulty='hard', is_active=True).count()
            }
        }, None
