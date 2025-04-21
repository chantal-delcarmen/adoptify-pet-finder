from django.contrib.auth.models import User
from rest_framework  import serializers
from .models import Pet, Shelter, AdoptionApplication, UserProfile, ShelterManagement, AdminUser

class UserSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(source='profile.phone_number', required=True)
    address = serializers.CharField(source='profile.address', required=True)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password', 'phone_number', 'address']
        extra_kwargs = {'password': {'write_only': True, 'required': True},
            'email': {'required': True},      
            'username': {'required': True},  
            'first_name': {'required': True},
            'last_name': {'required': True},
            'phone_number': {'required': True},
            'address': {'required': True},
            }

    def create(self, validated_data):
        # Extract profile data
        profile_data = validated_data.pop('profile', {})
        # Create the User object
        user = User.objects.create_user(**validated_data)
        # Create the UserProfile object and link it to the User
        UserProfile.objects.create(user=user, **profile_data)
        return user
    def validate_phone_number(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Phone number must contain only digits.")
        if len(value) < 10:
            raise serializers.ValidationError("Phone number must be at least 10 digits long.")
        return value

class AdminUserSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(source='admin_profile.phone_number' , required=True)
    address = serializers.CharField(source='admin_profile.address', required=True)
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'first_name', 'last_name', 'phone_number', 'address']
        extra_kwargs = {'password': {'write_only': True, 'required': True},
            'email': {'required': True},      
            'username': {'required': True},  
            'first_name': {'required': True},
            'last_name': {'required': True},
            'phone_number': {'required': True},
            'address': {'required': True},
            }

    def create(self, validated_data):
        profile_data = validated_data.pop('admin_profile', {})
        user = User.objects.create_user(**validated_data, is_staff=True, is_superuser=True)
        # Create the associated AdminUser profile
        AdminUser.objects.create(user=user, **profile_data)
        return user
    def validate_phone_number(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("Phone number must contain only digits.")
        if len(value) < 10:
            raise serializers.ValidationError("Phone number must be at least 10 digits long.")
        return value

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

class UserLogOutSerializer(serializers.Serializer):
    refresh = serializers.CharField(required=True)  # Field for the refresh token

class ApplicationSerializer(serializers.ModelSerializer):
    pet_id = serializers.PrimaryKeyRelatedField(queryset=Pet.objects.all())
    adopter_user = serializers.HiddenField(default=serializers.CurrentUserDefault())  # Represent as foreign key (ID)
    admin_user = serializers.PrimaryKeyRelatedField(queryset=AdminUser.objects.all(), required=False, allow_null=True)  # Represent as foreign key (ID)

    class Meta:
        model = AdoptionApplication
        fields = ["application_id", "application_status", "submission_date", "pet_id", "adopter_user", "admin_user"]
        extra_kwargs = {
            "submission_date": {"read_only": True}
        }

    def validate_pet_id(self, value):
        # Ensure the pet is available for adoption
        if not value.adoption_status:
            raise serializers.ValidationError("This pet is already adopted.")
        return value

    def create(self, validated_data):
        # Automatically set the adopter_user to the current user
        request = self.context.get("request")
        if request and request.user:
            validated_data["adopter_user"] = request.user
        return AdoptionApplication.objects.create(**validated_data)

    def update(self, instance, validated_data):
        request = self.context.get("request")
        if request and request.user.is_staff:  # Ensure the user is an admin
            # Check if the application_status is being updated
            new_status = validated_data.get("application_status", instance.application_status)
            if new_status != instance.application_status:
                instance.application_status = new_status
                instance.admin_user = request.user.admin_profile  # Set the admin_user to the admin making the change
        instance.save()
        return instance

class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = ['pet_id', 'age', 'gender', 'domesticated', 'name', 'adoption_status', 'pet_type', 'shelter_id']
        extra_kwargs = {'pet_id': {'read_only': True}}
    def create(self, validated_data):
        # Create a new pet
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