"""This module contains the API views for the Adoptify Pet Finder application.
It includes views for user management, pet management, adoption applications,
favorites, donations, and shelter management.

Each view handles specific HTTP requests and interacts with the database models
to provide the required functionality."""

# backend/api/views.py
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from django.http import JsonResponse
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from .models import AdoptionApplication, Pet, Shelter, ShelterManagement, Favourite, Adopter, Donation
from .serializers import UserSerializer, ApplicationSerializer, AdminUserSerializer, PetSerializer, ShelterSerializer, ShelterManagementSerializer, FavouriteSerializer, DonationSerializer

# -------------------------------------- Health Check Endpoint -------------------------------------------
# Check if the backend is working (Test Endpoint)
@api_view(['GET'])
@renderer_classes([JSONRenderer])
def test(request):
    """
    Test API endpoint to verify the backend is working.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        Response: A JSON response with a success message.
    """
    return Response({"message": "Backend is working!"})

# Basic Health Check Endpoint
def health_check(request):
    return JsonResponse({"status": "OK", "message": "Backend is working"})

# ---------------------------------------- User Details -------------------------------------------

class UserDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "role": "admin" if user.is_staff else "user",
        })
    
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
        adoption_application = get_object_or_404(AdoptionApplication, pk=pk)
        if request.user != adoption_application.adopter_user and not request.user.is_staff:
            return Response({"error": "You are not authorized to delete this application."}, status=403)
        adoption_application.delete()
        return Response({"message": "Adoption application deleted successfully."})

# List Adoption Applications
class AdoptionApplicationListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # List all adoption applications for the authenticated user
        if request.user.is_staff:
            # Admin can see all applications
            adoption_applications = AdoptionApplication.objects.all()
        else:
            # Regular user can only see their own applications
            adoption_applications = AdoptionApplication.objects.filter(adopter_user=request.user)
        serializer = ApplicationSerializer(adoption_applications, many=True)
        return Response(serializer.data)



# --------------------------------------- Pet Management -------------------------------------------

# Create new Pet
class CreatePetView(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]  # Add parsers for file uploads

    def post(self, request):
        # Automatically set default adoption status if not provided
        request.data.setdefault('adoption_status', 'Available')
        request.data.setdefault('pet_type', 'Dog')  # Default to "Dog" if not provided

        serializer = PetSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        pet = serializer.save()

        # Add the pet to the specified shelter
        shelter_id = request.data.get("shelter_id")
        if shelter_id:
            shelter = get_object_or_404(Shelter, pk=shelter_id)
            pet.shelter_id = shelter
            pet.save()

        return Response(serializer.data, status=201)

# Retrieve Pet Info by PK
class PetDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        # Retrieve the pet with the given primary key (pk)
        pet = get_object_or_404(Pet, pk=pk)
        serializer = PetSerializer(pet, context={'request': request})
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

        serializer = PetSerializer(pets, many=True, context={'request': request})
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

        if new_status == 'Approved':
            # Automatically set the pet's adoption status to 'Adopted'
            pet = adoption_application.pet_id
            pet.adoption_status = 'Adopted'
            pet.save()
        elif new_status == 'Rejected':
            # Automatically set the pet's adoption status to 'Available'
            pet = adoption_application.pet_id
            pet.adoption_status = 'Available'
            pet.save()

        return Response({"message": "Application status updated successfully", "status": new_status})

# ---------------------------------------- Favourite Pets Management -------------------------------------------

# Add Favourite Pet
class AddFavouriteView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        if pk:
            # Check if the pet is in the user's favorites
            try:
                favourite = Favourite.objects.get(adopter_user_id=request.user, pet_id=pk)
                return Response({"is_favorited": True}, status=status.HTTP_200_OK)
            except Favourite.DoesNotExist:
                return Response({"is_favorited": False}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Return all favorites for the user
            favourites = Favourite.objects.filter(adopter_user_id=request.user)
            favourite_list = [{"pet_id": fav.pet.id, "pet_name": fav.pet.name} for fav in favourites]
            return Response(favourite_list, status=status.HTTP_200_OK)

    def post(self, request, pk):
        """Add a pet to the user's favourites."""
        pet = get_object_or_404(Pet, pk=pk)
        adopter = request.user
        favourite = Favourite().addPetToFavourites(pet, adopter)  # Use the updated method
        if favourite:
            return Response({"message": "Pet added to favourites"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "Pet already in favourites"}, status=status.HTTP_400_BAD_REQUEST)

# Remove Favourite Pet
class RemoveFavouriteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        # Get the pet object
        pet = get_object_or_404(Pet, pk=pk)
        adopter = request.user
        # Check if the pet is in the user's favourites
        favourite = Favourite.objects.filter(pet_id=pet, adopter_user_id=adopter).first()
        if not favourite:
            return Response({"message": "Pet not found in favourites."}, status=status.HTTP_404_NOT_FOUND)
        # Remove the pet from favourites
        favourite.removePetFromFavourites(pet, adopter)
        return Response({"message": f"Pet '{pet.name}' removed from favourites."}, status=status.HTTP_204_NO_CONTENT)

class FavouriteListView(ListAPIView):
    permission_classes = [IsAuthenticated]

    def get (self, request):
        # List all favourite pets for the authenticated user
        favourites = Favourite.objects.filter(adopter_user_id=request.user)
        serializer = FavouriteSerializer(favourites, many=True)
        return Response(serializer.data)

# ---------------------------------------- Donation Management -------------------------------------------
# Create new Donation
class CreateDonationView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        donator = request.user
        shelter_id = request.data.get("shelter_id")
        amount = request.data.get("amount")

        # Validate required fields
        if not shelter_id or not amount:
            return Response({"error": "Shelter ID and amount are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Get the shelter object
            shelter = Shelter.objects.get(pk=shelter_id)
        except Shelter.DoesNotExist:
            return Response({"error": "Shelter not found."}, status=status.HTTP_404_NOT_FOUND)

        # Create a new donation using the recordDonation method
        donation = Donation()
        donation.recordDonation(donator, shelter, amount)

        # Serialize the created donation
        serializer = DonationSerializer(donation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# View Donation Details
class DonationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        donation = get_object_or_404(Donation, pk=pk)
        donation.getDonationDetails()
        serializer = DonationSerializer(donation)
        return Response(serializer.data)

class DonationListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # List all donations for the authenticated user
        donations = Donation.objects.filter(adopter_user_id=request.user)
        serializer = DonationSerializer(donations, many=True)
        return Response(serializer.data)

