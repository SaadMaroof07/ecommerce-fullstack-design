from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken  
from .serializers import RegisterSerializer, UserProfileSerializer

class AccountViewSet(viewsets.GenericViewSet):

    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.action == 'register':
            return RegisterSerializer
        return UserProfileSerializer

    def get_permissions(self):
        if self.action == 'register':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['POST'], url_path='register')
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

       
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                'message': 'Account created successfully.',
                'user': UserProfileSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
            },
            status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=['GET', 'PUT', 'PATCH'], url_path='profile')
    def profile(self, request):
        user = request.user

        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)

        partial = request.method == 'PATCH'
        serializer = self.get_serializer(
            user,
            data=request.data,
            partial=partial
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                'message': 'Profile updated successfully.',
                'user': serializer.data
            },
            status=status.HTTP_200_OK
        )