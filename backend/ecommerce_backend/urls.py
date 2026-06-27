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


from django.contrib.auth import get_user_model
from django.db.utils import IntegrityError

User = get_user_model()

try:
   
    User.objects.create_superuser('admin', 'saadmaroof07@gmail.com', 'admin1234')
    print("Superuser created successfully via urls.py!")
except IntegrityError:
    
    pass