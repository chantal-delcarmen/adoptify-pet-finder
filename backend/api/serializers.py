from django.contrib.auth.models import User
from rest_framework  import serializers
from .models import Pet, Shelter, AdoptionApplication, UserProfile, ShelterManagement, Favourite
from django.db import models

# -------------------------------------- User Registration -------------------------------------------

class UserSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(source='profile.phone_number', required=False)
    address = serializers.CharField(source='profile.address', required=False)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'phone_number', 'address']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_username(self, value):
        # Check if the username already exists
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate_email(self, value):
        # Check if the email already exists
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_phone_number(self, value):
        # Example: Ensure phone number is numeric
        if not value.isdigit():
            raise serializers.ValidationError("Phone number must contain only digits.")
        return value

    def create(self, validated_data):
        # Extract profile data
        profile_data = validated_data.pop('profile', {})
        # Create the User object
        user = User.objects.create_user(**validated_data)
        # Create the UserProfile object and link it to the User
        UserProfile.objects.create(user=user, **profile_data)
        return user

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Create a user with admin privileges
        user = User.objects.create_user(**validated_data, is_staff=True, is_superuser=True)
        return user

# --------------------------------------- Adoption Application -------------------------------------------

class AdopterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Create a user with adopter privileges
        user = User.objects.create_user(**validated_data)
        return user

class ApplicationSerializer(serializers.ModelSerializer):
    pet_id = serializers.PrimaryKeyRelatedField(queryset=Pet.objects.all())
    adopter_user = serializers.PrimaryKeyRelatedField(read_only=True)  #
    class Meta:
        model = AdoptionApplication
        fields = ["application_id", "application_status", "submission_date", "pet_id", "adopter_user"]
        extra_kwargs = {"submission_date": {"read_only": True}}

    def validate_pet_id(self, value):
        # Ensure the pet is available for adoption
        if value.adoption_status != 1:  # Assuming 1 means "Available"
            raise serializers.ValidationError("This pet is not available for adoption.")
        return value

    def create(self, validated_data):
        # Create the AdoptionApplication object
        adopt_application = AdoptionApplication.objects.create(**validated_data)
        # Create a new adoption application
        return adopt_application

# --------------------------------------- Pet Management -------------------------------------------

class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = ['pet_id', 'age', 'gender', 'domesticated', 'name', 'adoption_status', 'pet_type', 'shelter_id', 'image']
        extra_kwargs = {
            'pet_id': {'read_only': True},
            'adoption_status': {'read_only': True},  # Set adoption_status as read-only
            'image': {'required': False},  # Make image optional
        }

    def validate_shelter_id(self, value):
        # Validate that the shelter exists
        if not Shelter.objects.filter(pk=value.pk).exists():
            raise serializers.ValidationError("The specified shelter does not exist.")
        return value

    def create(self, validated_data):
        # Create a new pet
        request = self.context.get('request')
        if not request.user.is_staff:
            validated_data.pop('adoption_status', None)  # Remove adoption status if not needed
        pet = Pet.objects.create(**validated_data)
        return pet

# --------------------------------------- Shelter Management -------------------------------------------

class ShelterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shelter
        fields = ['shelter_id', 'name', 'address', 'phone_number', 'website_url']
        extra_kwargs = {'shelter_id': {'read_only': True}}

    def create(self, validated_data):
        # Create a new Shelter object
        shelter = Shelter.objects.create(**validated_data)

        # Automatically assign the root admin user as the manager
        root_admin = User.objects.filter(is_superuser=True).first()  # Get the root admin user
        if root_admin:
            ShelterManagement.objects.create(
                shelter_id=shelter,
                admin_user=root_admin
            )

        return shelter

class ShelterManagementSerializer(serializers.ModelSerializer):
    admin_user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    shelter_id = serializers.PrimaryKeyRelatedField(queryset=Shelter.objects.all())

    class Meta:
        model = ShelterManagement
        fields = ['shelter_id', 'admin_user', 'manage_id']
        extra_kwargs = {'manage_id': {'read_only': True}}

    def create(self, validated_data):
        # Resolve the SimpleLazyObject to a User instance
        validated_data['admin_user'] = validated_data['admin_user']._wrapped if hasattr(validated_data['admin_user'], '_wrapped') else validated_data['admin_user']
        # Create the ShelterManagement object
        return ShelterManagement.objects.create(**validated_data)

class FavouriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favourite
        fields = ['pet_id', 'adopter_user_id']
        extra_kwargs = {
            'pet_id': {'required': True},
            'adopter_user_id': {'required': True}
        }
    def create(self, validated_data):
        # Create a new favourite pet entry
        return Favourite.objects.create(**validated_data)
    
