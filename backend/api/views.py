# backend/api/views.py
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.parsers import MultiPartParser, FormParser

from django.http import JsonResponse
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from .models import AdoptionApplication, Pet, Shelter, ShelterManagement
from .serializers import UserSerializer, ApplicationSerializer, AdminUserSerializer, PetSerializer, ShelterSerializer, ShelterManagementSerializer

# -------------------------------------- Health Check Endpoint -------------------------------------------
# Check if the backend is working (Test Endpoint)
@api_view(['GET'])
@renderer_classes([JSONRenderer])
def test(request):
    return Response({"message": "Backend is working!"})

# Basic Health Check Endpoint
def health_check(request):
    return JsonResponse({"status": "OK", "message": "Backend is working"})

# -------------------------------------- User Registration -------------------------------------------
# Create new User
class CreateUserView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # Return detailed validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Create new Admin User
class CreateAdminUserView(generics.CreateAPIView):
    # Unique user
    queryset = User.objects.all()
    # Data for user
    serializer_class = AdminUserSerializer
    # Access restricted to admins only
    permission_classes = [IsAdminUser] # Only admin users can create admin users

# --------------------------------------- Adoption Application -------------------------------------------

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

# Retrieve and Delete Adoption Application
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

# List Adoption Applications
class AdoptionApplicationListView(generics.ListAPIView):
    queryset = AdoptionApplication.objects.all()
    serializer_class = ApplicationSerializer   
    permission_classes = [AllowAny]  # Only authenticated users can view the list of applications


# --------------------------------------- Pet Management -------------------------------------------

# Create new Pet
class CreatePetView(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]  # Add parsers for file uploads

    def post(self, request):
        # Automatically set default adoption status
        request.data['adoption_status'] = 'Available'
        serializer = PetSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        pet = serializer.save()

        # Add the pet to the specified shelter
        shelter_id = request.data.get("shelter_id")
        if shelter_id:
            shelter = get_object_or_404(Shelter, pk=shelter_id)
            shelter.add_pet(pet)

        return Response(serializer.data, status=201)

# Retrieve Pet Info by PK
class PetDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        # Retrieve the pet with the given primary key (pk)
        pet = get_object_or_404(Pet, pk=pk)
        serializer = PetSerializer(pet)
        return Response(serializer.data)

# List All Pets
class PetListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, shelter_id=None):
        if shelter_id:
            shelter = get_object_or_404(Shelter, pk=shelter_id)
            pets = shelter.list_all_pets()
        else:
            pets = Pet.objects.all()

        serializer = PetSerializer(pets, many=True)
        return Response(serializer.data)

# --------------------------------------- Shelter Management -------------------------------------------

# Create new Shelter
class CreateShelterView(generics.CreateAPIView):
    queryset = Shelter.objects.all()
    serializer_class = ShelterSerializer
    permission_classes = [IsAdminUser]  # Only admin users can create shelters

# List All Shelters
class ShelterListView(ListAPIView):
    queryset = Shelter.objects.all()
    serializer_class = ShelterSerializer
    permission_classes = [IsAdminUser]  # Only admin users can access

# ------------------------------------- Shelter Management Records -------------------------------------------
# Create new Shelter Management Record
class CreateShelterManagementView(generics.CreateAPIView):
    queryset = ShelterManagement.objects.all()
    serializer_class = ShelterManagementSerializer
    permission_classes = [IsAdminUser]  # Only admin users can create shelter management records

# Retrieve and Delete Shelter Management Record
class ShelterManagementView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, pk):
        # Retrieve the shelter management with the given primary key (pk)
        shelter_management = get_object_or_404(ShelterManagement, pk=pk)
        serializer = ShelterManagementSerializer(shelter_management)
        return Response(serializer.data)

    def post(self, request):
        # Assign an admin user to a shelter
        serializer = ShelterManagementSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

    def delete(self, request, pk):
        # Delete the shelter management with the given primary key (pk)
        shelter_management = get_object_or_404(ShelterManagement, pk=pk)
        shelter_management.delete()
        return Response({"message": "Shelter management deleted successfully."}, status=204)

class ShelterManagementDetailView(generics.RetrieveDestroyAPIView):
    queryset = ShelterManagement.objects.all()
    serializer_class = ShelterManagementSerializer
    permission_classes = [IsAdminUser]  # Only admin users can retrieve or delete shelter management records

# ---------------------------------------- Update Application Status -------------------------------------------

# Update Application Status View for Admins
class UpdateApplicationStatusView(APIView):
    permission_classes = [IsAdminUser]  # Only admins can update application status

    def patch(self, request, pk):
        # Retrieve the adoption application by primary key (pk)
        adoption_application = get_object_or_404(AdoptionApplication, pk=pk)
        
        # Update the application status
        new_status = request.data.get('application_status')
        if new_status not in ['Pending', 'Approved', 'Rejected']:
            return Response({"error": "Invalid status"}, status=400)
        
        adoption_application.application_status = new_status
        adoption_application.save()
        return Response({"message": "Application status updated successfully", "status": new_status})

