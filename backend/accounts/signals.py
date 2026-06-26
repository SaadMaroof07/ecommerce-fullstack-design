from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings


@receiver(post_save, sender=User)
def send_welcome_email(sender, instance, created, **kwargs):
    """
    Jab bhi naya user register ho, welcome email bhejo automatically.
    """
    if created:
        try:
            send_mail(
                subject='Welcome to Ecommerce Store! 🛒',
                message=f'''
Hi {instance.first_name or instance.username},

Welcome to Ecommerce Store! Your account has been created successfully.

Your Details:
- Username: {instance.username}
- Email: {instance.email}

Start shopping now at our store!

Best Regards,
Ecommerce Store Team
                ''',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[instance.email],
                fail_silently=True,  # email fail ho to app crash na ho
            )
        except Exception as e:
            print(f'Email sending failed: {e}')