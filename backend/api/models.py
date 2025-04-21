from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator, URLValidator
#from phonenumber_field.modelfields import PhoneNumberField

# Defines the database schema using Django models
# When to Edit:
# - To create or modify database tables
# - To define relationships between tables

class UserProfile(models.Model):    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)

    def __str__(self):
        return self.user.username

class AdminUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_profile')
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)

    def __str__(self):
        return self.user.username



class PetTest(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    breed = models.CharField(max_length=100)

class Shelter(models.Model):
    shelter_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    website_url = models.URLField()

class Pet(models.Model):
    pet_id = models.BigAutoField(primary_key=True, null=False)
    age = models.IntegerField(null=False, validators=[MinValueValidator(0.01), MaxValueValidator(99)])
    gender = models.CharField(max_length=10, choices=((1, "Male"), (2, "Female")), default=None, blank=True)
    domesticated = models.BooleanField()
    #pet_image = models.ImageField(upload_to='pet_images/', blank=True, null=True)
    name = models.CharField(max_length=100)
    adoption_status = models.BooleanField(default=False)  # True if adopted, False if available for adoption
    PET_CHOICES = ((1, "Dog"), (2, "Cat"), (3, "Bird"), (4, "Rabbit"))
    pet_type = models.CharField(max_length=10, choices=PET_CHOICES, blank=True)
    shelter_id = models.ForeignKey(Shelter, on_delete=models.CASCADE, related_name='pets')

class AdoptionApplication(models.Model):
    application_id = models.BigAutoField(primary_key=True)
    application_status = models.BooleanField(default=False)
    submission_date = models.DateTimeField(auto_now_add=True) 
    pet_id = models.ForeignKey(Pet, on_delete=models.CASCADE)
    adopter_user = models.ForeignKey(User, on_delete=models.CASCADE)
    admin_user = models.ForeignKey(AdminUser, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.application_status

class ShelterManagement(models.Model):
    shelter_id = models.ForeignKey(Shelter, on_delete=models.CASCADE)
    admin_user = models.ForeignKey(AdminUser, on_delete=models.CASCADE)
    manage_id = models.BigAutoField(primary_key=True)
    #phone_number = models.PhoneNumberField(_("Phone Number"), blank=True, null=True)
    address = models.TextField(("Address"), blank=True, null=True)

class Donation(models.Model):
    fundId = models.BigAutoField(primary_key=True)
    adopter_user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    shelter_id = models.ForeignKey(Shelter, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    donation_date = models.DateTimeField(auto_now_add=True)

class Adopter(models.Model):
    adopter_user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    pet_id = models.ForeignKey(Pet, on_delete=models.CASCADE)
    adoption_date = models.DateTimeField(auto_now_add=True)
    adoption_status = models.BooleanField(default=False)

    def __str__(self):
        return self.adopter_user.username