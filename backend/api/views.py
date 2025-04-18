# backend/api/views.py
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, ApplicationSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from .models import AdoptionApplication
from .models import Pet, Favourite
from .serializers import FavouriteSerializer

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
class FavouriteListView(generics.ListAPIView):
    serializer_class = FavouriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favourite.objects.filter(user=self.request.user)

class AddFavouriteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pet_id):
        try:
            pet = Pet.objects.get(id=pet_id)
            favourite, created = Favourite.objects.get_or_create(user=request.user, pet=pet)
            if created:
                return Response({"message": "Pet added to favourites!"}, status=201)
            return Response({"message": "Pet is already in favourites!"}, status=200)
        except Pet.DoesNotExist:
            return Response({"error": "Pet not found!"}, status=404)

class RemoveFavouriteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pet_id):
        try:
            favourite = Favourite.objects.get(user=request.user, pet_id=pet_id)
            favourite.delete()
            return Response({"message": "Pet removed from favourites!"}, status=status.HTTP_204_NO_CONTENT)
        except Favourite.DoesNotExist:
            return Response({"error": "Favourite not found!"}, status=status.HTTP_404_NOT_FOUND)
