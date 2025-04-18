from django.contrib.auth.models import User
from rest_framework  import serializers
from .models import Pet, Shelter, AdoptionApplication, UserProfile, ShelterManagement

class UserSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(source='profile.phone_number', required=False)
    address = serializers.CharField(source='profile.address', required=False)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'phone_number', 'address']
        extra_kwargs = {'password': {'write_only': True}}

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

class AdopterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Create a user with adopter privileges
        user = User.objects.create_user(**validated_data)
        return user

class UserLogInSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

class ApplicationSerializer(serializers.ModelSerializer):
    pet_id = serializers.PrimaryKeyRelatedField(queryset=Pet.objects.all())
    adopter_user = serializers.HiddenField(default=serializers.CurrentUserDefault())
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

class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = ['pet_id', 'age', 'gender', 'domesticated', 'name', 'adoption_status', 'pet_type', 'shelter_id']
        extra_kwargs = {'pet_id': {'read_only': True}}
    def create(self, validated_data):
        # Create a new pet
        request = self.context.get('request')
        if not request.user.is_staff:
            validated_data.pop('adoption_status') # Remove adoption status if not needed
        pet = Pet.objects.create(**validated_data)
        return pet 
    
class ShelterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shelter
        fields = ['shelter_id', 'name', 'address', 'website_url']
        extra_kwargs = {'shelter_id': {'read_only': True}}
    def create(self, validated_data):
        return Shelter.objects.create(**validated_data)

class ShelterManagementSerializer(serializers.ModelSerializer):
    admin_user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    shelter_id = serializers.PrimaryKeyRelatedField(queryset=Shelter.objects.all())
    class Meta:
        model = ShelterManagement
        fields = ['shelter_id', 'admin_user', 'manage_id', 'address']
        extra_kwargs = {'manage_id': {'read_only': True}}
    def create(self, validated_data):
        return ShelterManagement.objects.create(**validated_data)