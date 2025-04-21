# backend/api/views.py
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied

from .models import AdoptionApplication, Pet, Shelter
from .serializers import UserSerializer, ApplicationSerializer, AdminUserSerializer, PetSerializer, ShelterSerializer, ShelterManagementSerializer, UserLogInSerializer,UserLogOutSerializer, AdminUser
from .permissions import IsOwner
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

class CreateAdminUserView(generics.CreateAPIView):
    # Unique user
    queryset = User.objects.all()
    # Date for user
    serializer_class = AdminUserSerializer
    # Access by admins only
    permission_classes = [AllowAny]

 
class CreateAdoptionApplication(generics.CreateAPIView):
    queryset = AdoptionApplication.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically set the adopter_user to the currently authenticated user
        serializer.save(adopter_user=self.request.user)

class UpdateApplicationStatusView(generics.UpdateAPIView):
    queryset = AdoptionApplication.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        # Ensure only admins can update the application status
        if not self.request.user.is_staff:
            raise PermissionDenied("Only admins can update the application status.")

        # Check if the admin has an associated AdminUser profile
        admin_user = getattr(self.request.user, 'admin_profile', None)
        if not admin_user:
            raise PermissionDenied("The current user does not have an AdminUser profile.")

        # Get the current application instance
        application = serializer.instance

        # Check if the application status is being changed
        new_status = serializer.validated_data.get("application_status", application.application_status)
        if new_status != application.application_status:
            # Update the application status and set the admin_user
            serializer.save(application_status=new_status, admin_user=admin_user)
        else:
            # If the status is not being changed, just save without modifying admin_user
            serializer.save()

class UserLogInView(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserLogInSerializer

    def get(self, request, *args, **kwargs):
        # Check if the user is authenticated
        if request.user.is_authenticated:
            return Response({"message": "User is already logged in."}, status=200)
        else:
            return Response({"error": "User is not logged in."}, status=401)

    def post(self, request, *args, **kwargs):
         # Get username and password from the request
        username = request.data.get("username")
        password = request.data.get("password")

        # Authenticate the user
        user = authenticate(request, username=username, password=password)
        if user is not None:
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "message": "User logged in successfully."
            }, status=200)
        else:
            # If authentication fails, return an error response
            return Response({"error": "Invalid username or password."}, status=400)

class UserLogOutView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        # Check if the user is authenticated
        if request.user.is_authenticated:
            return Response({"message": "User is currently logged in."}, status=200)
        else:
            return Response({"message": "User is already logged out."}, status=200)

    def post(self, request, *args, **kwargs):
        serializer = UserLogOutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            # Get the refresh token from the request
            user = request.user
            refresh_token = serializer.validated_data["refresh"]
            if not refresh_token:
                return Response({"error": "Refresh token is required."}, status=400)

            # Blacklist the refresh token
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "User logged out successfully."}, status=200)
        except Exception as e:
            return Response({"error": "Invalid token or logout failed."}, status=400)      

class AdoptionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        # Retrieve the adoption application with the given primary key (pk)
        adoption_application = get_object_or_404(AdoptionApplication, pk=pk)
        serializer = ApplicationSerializer(adoption_application)
        return Response(serializer.data)

    def patch(self, request, pk):
        # Retrieve the adoption application with the given primary key (pk)
        adoption_application = get_object_or_404(AdoptionApplication, pk=pk)

        # Ensure only admins can update the application status
        if "application_status" in request.data and not request.user.is_staff:
            return Response({"error": "Only admins can update the application status."}, status=403)

        # Pass the request context to the serializer
        serializer = ApplicationSerializer(
            adoption_application, 
            data=request.data, 
            partial=True, 
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Automatically update the adoption status of the associated pet
        if "application_status" in serializer.validated_data:
            new_status = serializer.validated_data["application_status"]
            pet = adoption_application.pet_id  # Assuming pet_id is a ForeignKey in AdoptionApplication

            if new_status:  # If application is approved
                pet.adoption_status = True # Update to "Adopted"
            else:  # If application is rejected or reverted
                pet.adoption_status = False  # Update to "Available"
            pet.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        # Delete the adoption application with the given primary key (pk)
        adoption_application = get_object_or_404(AdoptionApplication, pk=pk)
        adoption_application.delete()
        return Response({"message": "Adoption application deleted successfully."})

class AdoptionApplicationListView(generics.ListAPIView):
    queryset = AdoptionApplication.objects.all()
    serializer_class = ApplicationSerializer   
    permission_classes = [IsAuthenticated]  # Only authenticated users can view the list of applications
    def get_queryset(self):
        # Allow admins to see all applications
        if self.request.user.is_staff:
            return AdoptionApplication.objects.all()
        # Regular users see only their own applications
        return AdoptionApplication.objects.filter(adopter_user=self.request.user)

class AdminAdoptionApplicationListView(generics.ListAPIView):
    queryset = AdoptionApplication.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAdminUser]  # Only admin users can view the list of applications

    def get_queryset(self):
        # Allow admins to see all applications
        return AdoptionApplication.objects.all()

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

class CreateShelterView(generics.CreateAPIView):    
    queryset = Shelter.objects.all()
    serializer_class = ShelterSerializer
    permission_classes = [IsAdminUser]  # Allow any user to view the list of shelters

class ShelterListView(generics.ListAPIView):
    queryset = Shelter.objects.all()
    serializer_class = ShelterSerializer
    permission_classes = [IsAdminUser]  # Allow any user to view the list of shelters

# Basic Health Check View using JsonResponse (For simple GET requests)
def health_check(request):
    return JsonResponse({"status": "OK", "message": "Backend is working"})

