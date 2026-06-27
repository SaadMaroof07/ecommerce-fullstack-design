from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('products.urls')),
    path('api/', include('accounts.urls')),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

from django.core.management import call_command
from django.contrib.auth import get_user_model
from django.db.utils import IntegrityError

# Web server start hote hi migrations khud chalengi
try:
    print("Running database migrations...")
    call_command('migrate', interactive=False)
except Exception as e:
    print(f"Migration error: {e}")

# Aapka purana superuser wala code iske niche rahega:
User = get_user_model()
try:
    User.objects.create_superuser('admin', 'saadmaroof07@gmail.com', 'admin1234')
    print("Superuser created successfully via urls.py!")
except IntegrityError:
    pass