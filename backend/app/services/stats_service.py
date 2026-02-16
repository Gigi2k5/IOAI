"""
Service de statistiques avancées
"""
from datetime import datetime, timedelta
from sqlalchemy import func
from app import db
from app.models import Candidate, Question, QCMAttempt, QCMSettings


class StatsService:
    """Statistiques globales pour l'admin"""
    
    @staticmethod
    def get_dashboard_stats():
        """Stats pour le dashboard admin"""
        total_candidates = Candidate.query.count()
        by_status = {
            'draft': Candidate.query.filter_by(status='draft').count(),
            'submitted': Candidate.query.filter_by(status='submitted').count(),
            'validated': Candidate.query.filter_by(status='validated').count(),
            'rejected': Candidate.query.filter_by(status='rejected').count()
        }
        
        qcm_completed = QCMAttempt.query.filter_by(status='completed').count()
        avg_score = db.session.query(func.avg(QCMAttempt.score)).filter(
            QCMAttempt.status == 'completed'
        ).scalar() or 0
        
        settings = QCMSettings.get_settings()
        passed = QCMAttempt.query.filter(
            QCMAttempt.status == 'completed',
            QCMAttempt.score >= settings.passing_score
        ).count()
        
        return {
            'candidates': {
                'total': total_candidates,
                'by_status': by_status,
                'pending_validation': by_status['submitted']
            },
            'qcm': {
                'completed': qcm_completed,
                'average_score': round(avg_score, 2),
                'pass_rate': round((passed / qcm_completed * 100), 2) if qcm_completed > 0 else 0,
                'passed_count': passed
            }
        }, None
    
    @staticmethod
    def get_candidates_by_region():
        """Stats candidats par région"""
        results = db.session.query(
            Candidate.region,
            func.count(Candidate.id).label('total'),
            func.sum(func.cast(Candidate.gender == 'M', db.Integer)).label('male'),
            func.sum(func.cast(Candidate.gender == 'F', db.Integer)).label('female')
        ).group_by(Candidate.region).all()
        
        return [{
            'region': r.region or 'Non renseigné',
            'total': r.total,
            'male': r.male or 0,
            'female': r.female or 0
        } for r in results], None
    
    @staticmethod
    def get_candidates_by_school():
        """Top établissements"""
        results = db.session.query(
            Candidate.school_name,
            Candidate.region,
            func.count(Candidate.id).label('total')
        ).filter(
            Candidate.school_name.isnot(None)
        ).group_by(
            Candidate.school_name, Candidate.region
        ).order_by(
            func.count(Candidate.id).desc()
        ).limit(10).all()
        
        return [{
            'school': r.school_name,
            'region': r.region,
            'count': r.total
        } for r in results], None
    
    @staticmethod
    def get_registrations_over_time():
        """Inscriptions par jour (30 derniers jours)"""
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        results = db.session.query(
            func.date(Candidate.created_at).label('date'),
            func.count(Candidate.id).label('count')
        ).filter(
            Candidate.created_at >= thirty_days_ago
        ).group_by(
            func.date(Candidate.created_at)
        ).order_by('date').all()
        
        data = []
        for r in results:
            # Gérer le cas où date est une string (SQLite) ou un objet date
            if r.date:
                date_str = r.date if isinstance(r.date, str) else r.date.isoformat()
            else:
                date_str = None
            data.append({'date': date_str, 'count': r.count})
        
        return data, None
    
    @staticmethod
    def get_qcm_score_distribution():
        """Distribution des scores QCM"""
        ranges = [
            (0, 20, '0-20%'),
            (20, 40, '20-40%'),
            (40, 60, '40-60%'),
            (60, 80, '60-80%'),
            (80, 101, '80-100%')
        ]
        
        distribution = []
        for min_score, max_score, label in ranges:
            count = QCMAttempt.query.filter(
                QCMAttempt.status == 'completed',
                QCMAttempt.score >= min_score,
                QCMAttempt.score < max_score
            ).count()
            distribution.append({'range': label, 'count': count})
        
        return distribution, None
    
    @staticmethod
    def get_qcm_performance_by_category():
        """Performance par catégorie de question"""
        questions = Question.query.filter_by(is_active=True).all()
        
        categories = {}
        for q in questions:
            if q.category not in categories:
                categories[q.category] = {'shown': 0, 'correct': 0}
            categories[q.category]['shown'] += q.times_shown
            categories[q.category]['correct'] += q.times_correct
        
        result = []
        for cat, data in categories.items():
            rate = round((data['correct'] / data['shown'] * 100), 2) if data['shown'] > 0 else 0
            result.append({
                'category': cat,
                'attempts': data['shown'],
                'success_rate': rate
            })
        
        return sorted(result, key=lambda x: x['success_rate'], reverse=True), None
    
    @staticmethod
    def get_gender_stats():
        """Stats par genre"""
        male = Candidate.query.filter_by(gender='M').count()
        female = Candidate.query.filter_by(gender='F').count()
        total = male + female
        
        return {
            'male': {'count': male, 'percentage': round(male/total*100, 1) if total > 0 else 0},
            'female': {'count': female, 'percentage': round(female/total*100, 1) if total > 0 else 0}
        }, None
    
    @staticmethod
    def get_class_level_stats():
        """Stats par niveau de classe"""
        results = db.session.query(
            Candidate.class_level,
            func.count(Candidate.id).label('count')
        ).group_by(Candidate.class_level).all()
        
        return [{
            'level': r.class_level or 'Non renseigné',
            'count': r.count
        } for r in results], None
    
    @staticmethod
    def get_full_report():
        """Rapport complet pour export"""
        dashboard, _ = StatsService.get_dashboard_stats()
        regions, _ = StatsService.get_candidates_by_region()
        schools, _ = StatsService.get_candidates_by_school()
        registrations, _ = StatsService.get_registrations_over_time()
        score_dist, _ = StatsService.get_qcm_score_distribution()
        qcm_perf, _ = StatsService.get_qcm_performance_by_category()
        gender, _ = StatsService.get_gender_stats()
        class_levels, _ = StatsService.get_class_level_stats()
        
        return {
            'generated_at': datetime.utcnow().isoformat(),
            'summary': dashboard,
            'by_region': regions,
            'top_schools': schools,
            'registrations_trend': registrations,
            'qcm_score_distribution': score_dist,
            'qcm_performance': qcm_perf,
            'gender': gender,
            'class_levels': class_levels
        }, None
