# backend/api/views.py
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, ApplicationSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import AdoptionApplication

# DRF Test View using Response (For REST API responses)
@api_view(['GET'])
@renderer_classes([JSONRenderer])
def test(request):
    return Response({"message": "Backend is working!"})


# Create new User
class CreateUserView(generics.CreateAPIView):
    # Unique user
    queryset = User.objects.all()
    # Date for user
    serializer_class = UserSerializer
    # Access by anyone
    permission_classes = [AllowAny]


# Basic Health Check View using JsonResponse (For simple GET requests)
def health_check(request):
    return JsonResponse({"status": "OK", "message": "Backend is working"})
class CreateAdoption(generics.CreateAPIView):
    serializer_class = AdoptionApplication
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return AdoptionApplication.objects.filter(adopter_user=user)
