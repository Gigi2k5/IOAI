"""
Service de gestion du contenu (News, FAQ, Timeline, Partners)
"""
from datetime import datetime
from app import db
from app.models import News, FAQ, TimelinePhase, Partner, AuditLog


class ContentService:
    """Gère le contenu dynamique du site"""
    
    # ============================================
    # NEWS
    # ============================================
    
    @staticmethod
    def get_public_news():
        """Récupère les actualités publiées"""
        news = News.query.filter_by(status='published').order_by(News.published_at.desc()).all()
        return {'items': [n.to_dict() for n in news]}, None
    
    @staticmethod
    def get_all_news(page=1, per_page=20):
        """Récupère toutes les actualités (admin)"""
        pagination = News.query.order_by(News.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        return {
            'items': [n.to_dict() for n in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }, None
    
    @staticmethod
    def create_news(data, admin_id):
        """Crée une actualité"""
        news = News(
            title=data.get('title'),
            content=data.get('content'),
            image_url=data.get('image_url'),
            status=data.get('status', 'draft'),
            created_by=admin_id
        )
        if news.status == 'published':
            news.published_at = datetime.utcnow()
        
        db.session.add(news)
        db.session.commit()
        return news.to_dict(), None
    
    @staticmethod
    def update_news(news_id, data, admin_id):
        """Met à jour une actualité"""
        news = News.query.get(news_id)
        if not news:
            return None, "Actualité non trouvée"
        
        for field in ['title', 'content', 'image_url', 'status']:
            if field in data:
                setattr(news, field, data[field])
        
        if data.get('status') == 'published' and not news.published_at:
            news.published_at = datetime.utcnow()
        
        db.session.commit()
        return news.to_dict(), None
    
    @staticmethod
    def delete_news(news_id):
        """Supprime une actualité"""
        news = News.query.get(news_id)
        if not news:
            return None, "Actualité non trouvée"
        db.session.delete(news)
        db.session.commit()
        return {'deleted': True}, None
    
    # ============================================
    # FAQ
    # ============================================
    
    @staticmethod
    def get_public_faqs():
        """Récupère les FAQ actives"""
        faqs = FAQ.query.filter_by(is_active=True).order_by(FAQ.order).all()
        return {'items': [f.to_dict() for f in faqs]}, None
    
    @staticmethod
    def get_all_faqs():
        """Récupère toutes les FAQ (admin)"""
        faqs = FAQ.query.order_by(FAQ.order).all()
        return {'items': [f.to_dict() for f in faqs]}, None
    
    @staticmethod
    def create_faq(data, admin_id):
        """Crée une FAQ"""
        faq = FAQ(
            question=data.get('question'),
            answer=data.get('answer'),
            category=data.get('category'),
            order=data.get('order', 0),
            is_active=data.get('is_active', True)
        )
        db.session.add(faq)
        db.session.commit()
        return faq.to_dict(), None
    
    @staticmethod
    def update_faq(faq_id, data):
        """Met à jour une FAQ"""
        faq = FAQ.query.get(faq_id)
        if not faq:
            return None, "FAQ non trouvée"
        
        for field in ['question', 'answer', 'category', 'order', 'is_active']:
            if field in data:
                setattr(faq, field, data[field])
        
        db.session.commit()
        return faq.to_dict(), None
    
    @staticmethod
    def delete_faq(faq_id):
        """Supprime une FAQ"""
        faq = FAQ.query.get(faq_id)
        if not faq:
            return None, "FAQ non trouvée"
        db.session.delete(faq)
        db.session.commit()
        return {'deleted': True}, None
    
    # ============================================
    # TIMELINE
    # ============================================
    
    @staticmethod
    def get_timeline():
        """Récupère la timeline"""
        phases = TimelinePhase.query.order_by(TimelinePhase.phase_number).all()
        return {'phases': [p.to_dict() for p in phases]}, None
    
    @staticmethod
    def create_phase(data, admin_id):
        """Crée une phase"""
        phase = TimelinePhase(
            phase_number=data.get('phase_number'),
            title=data.get('title'),
            description=data.get('description'),
            start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date() if data.get('start_date') else None,
            end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date() if data.get('end_date') else None,
            status=data.get('status', 'upcoming')
        )
        db.session.add(phase)
        db.session.commit()
        return phase.to_dict(), None
    
    @staticmethod
    def update_phase(phase_id, data):
        """Met à jour une phase"""
        phase = TimelinePhase.query.get(phase_id)
        if not phase:
            return None, "Phase non trouvée"
        
        for field in ['phase_number', 'title', 'description', 'status']:
            if field in data:
                setattr(phase, field, data[field])
        
        if 'start_date' in data:
            phase.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date() if data['start_date'] else None
        if 'end_date' in data:
            phase.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date() if data['end_date'] else None
        
        db.session.commit()
        return phase.to_dict(), None
    
    @staticmethod
    def delete_phase(phase_id):
        """Supprime une phase"""
        phase = TimelinePhase.query.get(phase_id)
        if not phase:
            return None, "Phase non trouvée"
        db.session.delete(phase)
        db.session.commit()
        return {'deleted': True}, None
    
    # ============================================
    # PARTNERS
    # ============================================
    
    @staticmethod
    def get_public_partners():
        """Récupère les partenaires actifs"""
        partners = Partner.query.filter_by(is_active=True).order_by(Partner.order).all()
        return {'items': [p.to_dict() for p in partners]}, None
    
    @staticmethod
    def get_all_partners():
        """Récupère tous les partenaires (admin)"""
        partners = Partner.query.order_by(Partner.order).all()
        return {'items': [p.to_dict() for p in partners]}, None
    
    @staticmethod
    def create_partner(data, admin_id):
        """Crée un partenaire"""
        partner = Partner(
            name=data.get('name'),
            logo_url=data.get('logo_url'),
            website_url=data.get('url') or data.get('website_url'),  # Accepter les deux
            type=data.get('type'),
            order=data.get('order', 0),
            is_active=data.get('is_active', True)
        )
        db.session.add(partner)
        db.session.commit()
        return partner.to_dict(), None
    
    @staticmethod
    def update_partner(partner_id, data):
        """Met à jour un partenaire"""
        partner = Partner.query.get(partner_id)
        if not partner:
            return None, "Partenaire non trouvé"
        
        if 'name' in data:
            partner.name = data['name']
        if 'logo_url' in data:
            partner.logo_url = data['logo_url']
        if 'url' in data or 'website_url' in data:
            partner.website_url = data.get('url') or data.get('website_url')
        if 'type' in data:
            partner.type = data['type']
        if 'order' in data:
            partner.order = data['order']
        if 'is_active' in data:
            partner.is_active = data['is_active']
        
        db.session.commit()
        return partner.to_dict(), None
    
    @staticmethod
    def delete_partner(partner_id):
        """Supprime un partenaire"""
        partner = Partner.query.get(partner_id)
        if not partner:
            return None, "Partenaire non trouvé"
        db.session.delete(partner)
        db.session.commit()
        return {'deleted': True}, None
