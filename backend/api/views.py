# backend/api/views.py
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.views import APIView

from django.http import JsonResponse
from django.contrib.auth.models import User

from django.shortcuts import get_object_or_404

from .models import AdoptionApplication, Pet, Shelter, Favourite
from .serializers import UserSerializer, ApplicationSerializer, AdminUserSerializer, PetSerializer, ShelterSerializer, ShelterManagementSerializer, FavouriteSerializer

# DRF Test View using Response (For REST API responses)
@api_view(['GET'])
@renderer_classes([JSONRenderer])
def test(request):
    return Response({"message": "Backend is working!"})


# Create new User
class CreateUserView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # Return detailed validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateAdminUserView(generics.CreateAPIView):
    # Unique user
    queryset = User.objects.all()
    # Date for user
    serializer_class = AdminUserSerializer
    # Access by admins only
    permission_classes = [AllowAny]


# Create new Adoption Application
class CreateAdoptionApplication(generics.CreateAPIView):
    queryset = AdoptionApplication.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)
    def perform_create(self, serializer):
        # Automatically set the user who created the application
        serializer.save(adopter_user=self.request.user)

class AdoptionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        # Retrieve the adoption application with the given primary key (pk)
        adoption_application = get_object_or_404(AdoptionApplication, pk=pk)
        serializer = ApplicationSerializer(adoption_application)
        return Response(serializer.data)

    def delete(self, request, pk):
        # Delete the adoption application with the given primary key (pk)
        adoption_application = get_object_or_404(AdoptionApplication, pk=pk)
        adoption_application.delete()
        return Response({"message": "Adoption application deleted successfully."})

class AdoptionApplicationListView(generics.ListAPIView):
    queryset = AdoptionApplication.objects.all()
    serializer_class = ApplicationSerializer   
    permission_classes = [AllowAny]  # Only authenticated users can view the list of applications

class CreatePetView(generics.CreateAPIView):
    # Create new pet
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [AllowAny]  #[IsAuthenticated]  # Only authenticated users can create pets

class PetDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        # Retrieve the pet with the given primary key (pk)
        pet = get_object_or_404(Pet, pk=pk)
        serializer = PetSerializer(pet)
        return Response(serializer.data)

class PetListView(generics.ListAPIView):
    # List all pets
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [AllowAny]  # Allow any user to view the list of pets

class CreateShelterView(generics.CreateAPIView):
    queryset = Shelter.objects.all()
    serializer_class = ShelterSerializer
    permission_classes = [AllowAny]  # Allow any user to view the list of shelters

class CreateShelterManagementView(generics.CreateAPIView):
    queryset = Shelter.objects.all()
    serializer_class = ShelterManagementSerializer
    permission_classes = [IsAdminUser]  # Only admin users can create shelters
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)

class ShelterManagementView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        # Retrieve the shelter management with the given primary key (pk)
        shelter_management = get_object_or_404(Shelter, pk=pk)
        serializer = ShelterSerializer(shelter_management)
        return Response(serializer.data)

    def delete(self, request, pk):
        # Delete the shelter management with the given primary key (pk)
        shelter_management = get_object_or_404(Shelter, pk=pk)
        shelter_management.delete()
        return Response({"message": "Shelter management deleted successfully."})

# Basic Health Check View using JsonResponse (For simple GET requests)
def health_check(request):
    return JsonResponse({"status": "OK", "message": "Backend is working"})

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
