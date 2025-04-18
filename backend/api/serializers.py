from django.contrib.auth.models import User
from rest_framework  import serializers
from .models import Pet, Shelter, AdoptionApplication, UserProfile
from .models import Favourite

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

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdoptionApplication
        fields = ["id", "status", "date", "pet_id", "adopter_user"]
        extra_kwargs = {"pet_id": {"read_only": True}, "adopter_user": {"read_only": True}}
class PetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pet
        fields = '__all__'

class FavouriteSerializer(serializers.ModelSerializer):
    pet = PetSerializer()

    class Meta:
        model = Favourite
        fields = ['id', 'user', 'pet', 'added_at']
        read_only_fields = ['user', 'added_at']

#class FavouriteSerializer(serializers.ModelSerializer):
    
    #class meta:
     #   model = AdoptionApplication
      #  fields = ["id", "pet_id", "adopter_user", "Favourite"]
       # extra_kwargs = {"pet_id": {"read_only": True}, "adopter_user": {"read_only": True}, "Favourite": {"Boolean": True or False}}

