from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator, URLValidator
#from phonenumber_field.modelfields import PhoneNumberField

# Defines the database schema using Django models
# When to Edit:
# - To create or modify database tables
# - To define relationships between tables

# Example add a new model for pets

# User Profile Model
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)

    def __str__(self):
        return self.user.username

# Admin User Model
class AdminUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_profile')
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)

    def __str__(self):
        return self.user.username

# Shelter Model
class Shelter(models.Model):
    shelter_id = models.BigAutoField(primary_key=True)  # Auto-incrementing ID
    name = models.CharField(max_length=100, unique=True)  # Shelter name (added uniqueness for better data integrity)
    address = models.CharField(max_length=200)  # Shelter address
    phone_number = models.CharField(max_length=15, blank=True, null=True)  # Optional phone number
    website_url = models.URLField(blank=True, null=True)  # Optional website URL

    def __str__(self):
        return self.name

# Shelter Management Model
class ShelterManagement(models.Model):
    shelter_id = models.ForeignKey(Shelter, on_delete=models.CASCADE, related_name="management")
    admin_user = models.ForeignKey(
        AdminUser,
        on_delete=models.CASCADE,
        default=1,  # Default to the root admin user (ID=1)
        related_name="managed_shelters"
    )
    manage_id = models.BigAutoField(primary_key=True)  # Auto-incrementing ID for management records

    def __str__(self):
        return f"Shelter Management for {self.shelter_id.name} by {self.admin_user.user.username}"

# Pet Model
class Pet(models.Model):
    pet_id = models.BigAutoField(primary_key=True, null=False)
    age = models.IntegerField(null=False, validators=[MinValueValidator(0.01), MaxValueValidator(99)])
    gender = models.CharField(max_length=10, choices=(("Male", "Male"), ("Female", "Female")), default=None, blank=True)
    domesticated = models.BooleanField()
    name = models.CharField(max_length=100)
    adoption_status = models.TextField(choices=(("Available", "Available"), ("Adopted", "Adopted")), default="Available", blank=True, null=True)
    PET_CHOICES = (("Dog", "Dog"), ("Cat", "Cat"), ("Bird", "Bird"), ("Rabbit", "Rabbit"))
    pet_type = models.CharField(max_length=10, choices=PET_CHOICES, blank=True)
    shelter_id = models.ForeignKey(Shelter, on_delete=models.CASCADE, related_name='pets')
    image = models.ImageField(upload_to='pet_images/', blank=True, null=True)  # New field for pet images

    def __str__(self):
        return self.name

# Adoption Application Model
class AdoptionApplication(models.Model):
    application_id = models.BigAutoField(primary_key=True)
    application_status = models.CharField(max_length=20, choices=(("Pending", "Pending"), ("Approved", "Approved"), ("Rejected", "Rejected")), default="Pending")
    submission_date = models.DateTimeField(auto_now_add=True)
    pet_id = models.ForeignKey(Pet, on_delete=models.CASCADE)
    adopter_user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Application {self.application_id} - {self.application_status}"

# Donation Model
class Donation(models.Model):
    fundId = models.BigAutoField(primary_key=True)
    adopter_user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    shelter_id = models.ForeignKey(Shelter, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    donation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Donation {self.fundId} - ${self.amount}"

# Adopter Model
class Adopter(models.Model):
    adopter_user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    pet_id = models.ForeignKey(Pet, on_delete=models.CASCADE)
    adoption_date = models.DateTimeField(auto_now_add=True)
    adoption_status = models.BooleanField(default=False)

    def __str__(self):
        return self.adopter_user_id.username