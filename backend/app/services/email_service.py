"""
Service d'envoi d'emails via API Brevo (HTTP)
"""
import json
import logging
import threading
import urllib.request
import urllib.error
from flask import current_app

logger = logging.getLogger(__name__)

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


class EmailService:
    """Gère l'envoi d'emails via l'API Brevo"""
    
    @staticmethod
    def _send_email_sync(api_key, sender_email, sender_name, to_email, subject, html_content, text_content=None):
        """Envoi via API Brevo dans un thread séparé"""
        payload = {
            "sender": {
                "name": sender_name,
                "email": sender_email
            },
            "to": [
                {"email": to_email}
            ],
            "subject": subject,
            "htmlContent": html_content
        }
        
        if text_content:
            payload["textContent"] = text_content
        
        data = json.dumps(payload).encode("utf-8")
        
        req = urllib.request.Request(
            BREVO_API_URL,
            data=data,
            headers={
                "accept": "application/json",
                "api-key": api_key,
                "content-type": "application/json"
            },
            method="POST"
        )
        
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                result = json.loads(response.read().decode("utf-8"))
                logger.info(f"Email envoyé avec succès à {to_email} - messageId: {result.get('messageId')}")
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8")
            logger.error(f"Erreur API Brevo ({e.code}) pour {to_email}: {body}")
        except Exception as e:
            logger.error(f"Erreur envoi email à {to_email}: {e}")
    
    @staticmethod
    def send_email(to_email, subject, html_content, text_content=None):
        """
        Envoie un email de manière asynchrone via Brevo
        """
        api_key = current_app.config.get('BREVO_API_KEY')
        sender_email = current_app.config.get('MAIL_DEFAULT_SENDER') or current_app.config.get('MAIL_USERNAME')
        sender_name = current_app.config.get('MAIL_SENDER_NAME', 'Olympiades IA Bénin')
        
        if not api_key:
            logger.warning("Clé API Brevo manquante - email non envoyé")
            return False, "Configuration email non configurée"
        
        if not sender_email:
            logger.warning("Email expéditeur manquant - email non envoyé")
            return False, "Email expéditeur non configuré"
        
        try:
            thread = threading.Thread(
                target=EmailService._send_email_sync,
                args=(api_key, sender_email, sender_name, to_email, subject, html_content, text_content)
            )
            thread.daemon = True
            thread.start()
            
            logger.info(f"Email en cours d'envoi à {to_email} (async via Brevo)")
            return True, None
            
        except Exception as e:
            logger.error(f"Erreur préparation email: {e}")
            return False, f"Erreur: {str(e)}"
    
    @staticmethod
    def send_otp_email(to_email, otp_code, first_name=None):
        """Envoie le code OTP de vérification d'email"""
        name = first_name or "Candidat"
        subject = "🔐 Code de vérification - Olympiades IA Bénin 2026"
        
        html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #206080 0%, #208080 100%); border-radius: 16px 16px 0 0; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🧠 Olympiades IA Bénin 2026</h1>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e293b; margin-top: 0;">Bonjour {name} 👋</h2>
            
            <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                Voici votre code de vérification pour confirmer votre adresse email :
            </p>
            
            <div style="background: linear-gradient(135deg, #206080 0%, #208080 100%); border-radius: 12px; padding: 25px; text-align: center; margin: 30px 0;">
                <span style="font-size: 36px; font-weight: bold; color: white; letter-spacing: 8px;">{otp_code}</span>
            </div>
            
            <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
                ⏰ Ce code expire dans <strong>15 minutes</strong>.<br>
                Si vous n'avez pas demandé ce code, ignorez simplement cet email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
                © 2026 Olympiades Internationales d'Intelligence Artificielle - Bénin<br>
                <a href="https://olympiades-ia.bj" style="color: #206080;">olympiades-ia.bj</a>
            </p>
        </div>
    </div>
</body>
</html>
"""
        
        text_content = f"""
Bonjour {name},

Voici votre code de vérification pour les Olympiades IA Bénin 2026 :

{otp_code}

Ce code expire dans 15 minutes.

Si vous n'avez pas demandé ce code, ignorez cet email.

---
Olympiades Internationales d'Intelligence Artificielle - Bénin 2026
"""
        
        return EmailService.send_email(to_email, subject, html_content, text_content)
    
    @staticmethod
    def send_password_reset_email(to_email, reset_token, first_name=None):
        """Envoie le lien de réinitialisation de mot de passe"""
        name = first_name or "Candidat"
        subject = "🔑 Réinitialisation de mot de passe - Olympiades IA Bénin 2026"
        
        frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:5173')
        reset_url = f"{frontend_url}/reinitialiser-mot-de-passe?token={reset_token}"
        
        html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #206080 0%, #208080 100%); border-radius: 16px 16px 0 0; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🧠 Olympiades IA Bénin 2026</h1>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e293b; margin-top: 0;">Bonjour {name} 👋</h2>
            
            <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{reset_url}" style="display: inline-block; background: linear-gradient(135deg, #206080 0%, #208080 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    Réinitialiser mon mot de passe
                </a>
            </div>
            
            <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
                ⏰ Ce lien expire dans <strong>1 heure</strong>.<br>
                Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
            </p>
            
            <p style="color: #94a3b8; font-size: 12px; background: #f8fafc; padding: 15px; border-radius: 8px; word-break: break-all;">
                Si le bouton ne fonctionne pas, copiez ce lien :<br>
                <a href="{reset_url}" style="color: #206080;">{reset_url}</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
                © 2026 Olympiades Internationales d'Intelligence Artificielle - Bénin<br>
                <a href="https://olympiades-ia.bj" style="color: #206080;">olympiades-ia.bj</a>
            </p>
        </div>
    </div>
</body>
</html>
"""
        
        text_content = f"""
Bonjour {name},

Vous avez demandé la réinitialisation de votre mot de passe pour les Olympiades IA Bénin 2026.

Cliquez sur ce lien pour créer un nouveau mot de passe :
{reset_url}

Ce lien expire dans 1 heure.

Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.

---
Olympiades Internationales d'Intelligence Artificielle - Bénin 2026
"""
        
        return EmailService.send_email(to_email, subject, html_content, text_content)
    
    @staticmethod
    def send_welcome_email(to_email, first_name):
        """Envoie un email de bienvenue après vérification"""
        subject = "🎉 Bienvenue aux Olympiades IA Bénin 2026 !"
        
        frontend_url = current_app.config.get('FRONTEND_URL', 'http://localhost:5173')
        
        html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #206080 0%, #208080 100%); border-radius: 16px 16px 0 0; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🧠 Olympiades IA Bénin 2026</h1>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1e293b; margin-top: 0;">Félicitations {first_name} ! 🎉</h2>
            
            <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                Votre email a été vérifié avec succès. Vous êtes maintenant officiellement inscrit(e) aux Olympiades Internationales d'Intelligence Artificielle - Bénin 2026 !
            </p>
            
            <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                <p style="color: #166534; margin: 0; font-weight: 500;">✅ Prochaine étape : Complétez votre profil</p>
            </div>
            
            <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                Pour participer à la sélection, vous devez maintenant :
            </p>
            
            <ul style="color: #64748b; font-size: 15px; line-height: 1.8;">
                <li>Compléter votre profil avec vos informations personnelles</li>
                <li>Ajouter vos informations scolaires</li>
                <li>Télécharger vos bulletins de notes</li>
                <li>Soumettre votre candidature</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{frontend_url}/profil" style="display: inline-block; background: linear-gradient(135deg, #206080 0%, #208080 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    Compléter mon profil
                </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
                © 2026 Olympiades Internationales d'Intelligence Artificielle - Bénin<br>
                <a href="https://olympiades-ia.bj" style="color: #206080;">olympiades-ia.bj</a>
            </p>
        </div>
    </div>
</body>
</html>
"""
        
        text_content = f"""
Félicitations {first_name} !

Votre email a été vérifié avec succès. Vous êtes maintenant officiellement inscrit(e) aux Olympiades IA Bénin 2026 !

Prochaine étape : Complétez votre profil sur {frontend_url}/profil

Pour participer à la sélection, vous devez :
- Compléter votre profil avec vos informations personnelles
- Ajouter vos informations scolaires
- Télécharger vos bulletins de notes
- Soumettre votre candidature

---
Olympiades Internationales d'Intelligence Artificielle - Bénin 2026
"""
        
        return EmailService.send_email(to_email, subject, html_content, text_content)
