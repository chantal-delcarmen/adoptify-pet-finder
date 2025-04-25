"""
This module contains the API views for the Adoptify Pet Finder application.

It includes views for:
- User management: Handles user registration, authentication, and details retrieval.
- Pet management: Manages pet creation, updates, and retrieval.
- Adoption applications: Handles creation, updates, and listing of adoption applications.
- Favourite pets: Allows users to add, remove, and list their favourite pets.
- Donations: Manages donations made by users to shelters.
- Shelter management: Handles creation, updates, and listing of shelters and their management records.

Each view interacts with the database models and serializers to provide the required functionality.
"""

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

# Get User Details
class UserDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # Serialize the user data using the UserSerializer
        serializer = UserSerializer(user)
        # Add the role field to the response
        user_data = serializer.data
        user_data["role"] = "admin" if user.is_staff else "user"
        return Response(user_data)
    
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

    def perform_create(self, serializer):
        # Automatically set the adopter_user and update the pet's status
        pet = serializer.validated_data['pet_id']
        serializer.save(adopter_user=self.request.user)
        pet.adoption_status = "Pending"  # Update the pet's status to "Pending"
        pet.save()

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
        print(serializer.data)  # Log the serialized data for debugging
        return Response(serializer.data)

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

        # Get the related Pet object
        pet = adoption_application.pet  # Use the `pet` field to get the Pet object

        if new_status == 'Approved':
            # Automatically set the pet's adoption status to 'Adopted'
            pet.adoption_status = 'Adopted'
            pet.save()
        elif new_status == 'Rejected':
            # Automatically set the pet's adoption status to 'Available'
            pet.adoption_status = 'Available'
            pet.save()

        # Include the pet_id in the response
        return Response({
            "message": "Application status updated successfully",
            "status": new_status,
            "pet_id": pet.pet_id
        })


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

# Retrieve and Update Pet Info by PK
class PetDetailView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]  # Add JSONParser to support JSON payloads

    def get(self, request, pk):
        # Retrieve the pet with the given primary key (pk)
        pet = get_object_or_404(Pet, pk=pk)
        serializer = PetSerializer(pet)
        return Response(serializer.data)

    def put(self, request, pk):
        pet = get_object_or_404(Pet, pk=pk)
        print("Incoming request data:", request.data)  # Log the incoming data

        data = request.data.copy()
        if not data.get('image'):
            data.pop('image', None)

        serializer = PetSerializer(pet, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            print("Updated pet data:", serializer.data)  # Log the updated data
            return Response(serializer.data, status=200)
        print("Serializer errors:", serializer.errors)  # Log validation errors
        return Response(serializer.errors, status=400)

    def patch(self, request, pk):
        # Retrieve the pet with the given primary key (pk)
        pet = get_object_or_404(Pet, pk=pk)
        data = request.data

        # Update the pet's adoption status
        serializer = PetSerializer(pet, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        try:
            pet = Pet.objects.get(pk=pk)
            pet.delete()
            return Response({"message": "Pet deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Pet.DoesNotExist:
            return Response({"error": "Pet not found"}, status=status.HTTP_404_NOT_FOUND)

# List All Pets
class PetListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, shelter_id=None):
        if (shelter_id):
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
    permission_classes = [IsAuthenticated]  # Allow all authenticated users to access

# Update Shelter
class UpdateShelterView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Shelter.objects.all()
    serializer_class = ShelterSerializer
    permission_classes = [IsAdminUser]  # Only admin users can update shelters

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

# View Shelter Management Record
class ShelterManagementDetailView(generics.RetrieveDestroyAPIView):
    queryset = ShelterManagement.objects.all()
    serializer_class = ShelterManagementSerializer
    permission_classes = [IsAdminUser]  # Only admin users can retrieve or delete shelter management records

# Update Shelter Management Record
class UpdateShelterManagementView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ShelterManagement.objects.all()
    serializer_class = ShelterManagementSerializer
    permission_classes = [IsAdminUser]  # Only admin users can update shelter management records

# ---------------------------------------- Favourite Pets Management -------------------------------------------

# Add Favourite Pet
class AddFavouriteView(APIView):
    permission_classes = [IsAuthenticated]

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

    def delete(self, request, pet_id):
        """Remove a pet from the user's favourites."""
        pet = get_object_or_404(Pet, pet_id=pet_id) 
        adopter = request.user
        removed = Favourite().removePetFromFavourites(pet, adopter)  # Use the updated method
        if removed:
            return Response({"message": "Pet removed from favourites!"}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"error": "Favourite not found!"}, status=status.HTTP_404_NOT_FOUND)

# List Favourite Pets
class FavouriteListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get the list of favourite pets for the authenticated user."""
        favourites = Favourite.objects.filter(adopter_user=request.user)  # Updated field name
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

        print("Received data:", {"shelter_id": shelter_id, "amount": amount})  # Debug log

        # Validate required fields
        if not shelter_id or not amount:
            return Response({"error": "Shelter ID and amount are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Ensure shelter_id is an integer
            shelter = Shelter.objects.get(pk=int(shelter_id))
        except ValueError:
            return Response({"error": "Invalid shelter ID."}, status=status.HTTP_400_BAD_REQUEST)
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

# List All Donations
class DonationListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # List all donations for the authenticated user
        donations = Donation.objects.filter(adopter_user_id=request.user)
        serializer = DonationSerializer(donations, many=True)
        return Response(serializer.data)

