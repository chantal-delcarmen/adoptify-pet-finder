from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator, URLValidator

def get_root_admin_user():
    return User.objects.filter(is_superuser=True).first()

# --------------------------------------- User Profile Model -------------------------------------------

# This model extends the default User model to include additional fields like phone number and address.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')  # Link to the User model
    phone_number = models.CharField(max_length=15, blank=True)  # Optional phone number
    address = models.TextField(blank=True)  # Optional address field

    def __str__(self):
        return self.user.username  # Return the username as the string representation

# --------------------------------------- Admin User Model -------------------------------------------

# This model represents admin users with additional fields like phone number and address.
class AdminUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_profile')  # Link to the User model
    phone_number = models.CharField(max_length=15, blank=True)  # Optional phone number
    address = models.TextField(blank=True)  # Optional address field

    def __str__(self):
        return self.user.username  # Return the username as the string representation

# --------------------------------------- Shelter Model -------------------------------------------

# This model represents shelters, including their name, address, phone number, and website URL.
class Shelter(models.Model):
    shelter_id = models.BigAutoField(primary_key=True)  # Auto-incrementing ID
    name = models.CharField(max_length=100, unique=True)  # Shelter name (unique for data integrity)
    address = models.CharField(max_length=200)  # Shelter address
    phone_number = models.CharField(max_length=15, blank=True, null=True)  # Optional phone number
    website_url = models.URLField(blank=True, null=True)  # Optional website URL

    def __str__(self):
        return self.name  # Return the shelter name as the string representation

    def add_pet(self, pet):
        """Assign a pet to this shelter."""
        pet.shelter_id = self
        pet.save()

    def remove_pet(self, pet):
        """Remove a pet from this shelter."""
        if pet.shelter_id == self:
            pet.delete()

    def update_shelter_info(self, shelter_info):
        """Update shelter details."""
        for key, value in shelter_info.items():
            setattr(self, key, value)
        self.save()

    def list_all_pets(self):
        """List all pets in this shelter."""
        return self.pets.all()

    def list_available_pets(self):
        """List all available pets in this shelter."""
        return self.pets.filter(adoption_status="Available")

# --------------------------------------- Shelter Management Model -------------------------------------------

# This model represents the management of shelters by admin users.
class ShelterManagement(models.Model):
    shelter_id = models.ForeignKey(Shelter, on_delete=models.CASCADE, related_name="management")  # Link to the Shelter model
    admin_user = models.ForeignKey(
        User,  # Ensure this points to the default User model
        on_delete=models.CASCADE,
        related_name="managed_shelters",
        default=get_root_admin_user  # Default to root admin user
    )
    manage_id = models.BigAutoField(primary_key=True)  # Auto-incrementing ID
    start_date = models.DateField(blank=True, null=True)  # Optional start date
    end_date = models.DateField(blank=True, null=True)  # Optional end date

    def __str__(self):
        return f"Shelter Management for {self.shelter_id.name} by {self.admin_user.username}"  # String representation

    def add_record(self, admin, shelter, start_date, end_date):
        """Assign an admin to manage a shelter."""
        self.admin_user = admin
        self.shelter_id = shelter
        self.start_date = start_date
        self.end_date = end_date
        self.save()

    def get_record_details(self):
        """Get details of this shelter management record."""
        return {
            "manage_id": self.manage_id,
            "admin_user": self.admin_user.username,
            "shelter_name": self.shelter_id.name,
            "start_date": self.start_date,
            "end_date": self.end_date,
        }

# --------------------------------------- Pet Model -------------------------------------------

# This model represents pets, including their details like age, gender, type, and adoption status.
class Pet(models.Model):
    ADOPTION_STATUS_CHOICES = [
        ("Available", "Available"),
        ("Pending", "Pending"),
        ("Adopted", "Adopted"),
    ]

    pet_id = models.BigAutoField(primary_key=True, null=False)  # Auto-incrementing ID
    age = models.IntegerField(
        null=False,
        validators=[MinValueValidator(0.01), MaxValueValidator(99)]  # Age validation
    )
    gender = models.CharField(
        max_length=10,
        choices=(("Male", "Male"), ("Female", "Female")),  # Gender choices
        default=None,
        blank=False  # Ensure gender is required
    )
    domesticated = models.BooleanField(null=False)  # Boolean field for domestication status
    name = models.CharField(max_length=100, blank=False)  # Pet name
    adoption_status = models.CharField(
        max_length=10,
        choices=ADOPTION_STATUS_CHOICES,  # Adoption status choices
        default="Available",
        blank=False,  # Ensure adoption_status is required
        null=False
    )
    PET_CHOICES = (("Dog", "Dog"), ("Cat", "Cat"), ("Bird", "Bird"), ("Rabbit", "Rabbit"))
    pet_type = models.CharField(
        max_length=10,
        choices=PET_CHOICES,  # Pet type choices
        blank=False,  # Ensure pet_type is required
        default="Dog"
    )
    shelter_id = models.ForeignKey(
        Shelter,
        on_delete=models.CASCADE,
        related_name='pets'  # Link to the Shelter model
    )
    image = models.ImageField(
        upload_to='pet_images/',  # Directory for storing pet images
        blank=True,
        null=True  # Image is optional
    )

    def __str__(self):
        return self.name  # Return the pet name as the string representation

# --------------------------------------- Adoption Application Model -------------------------------------------

# This model represents adoption applications submitted by users for pets.
class AdoptionApplication(models.Model):
    application_id = models.BigAutoField(primary_key=True)  # Auto-incrementing ID
    application_status = models.CharField(
        max_length=20, 
        choices=(("Pending", "Pending"), ("Approved", "Approved"), ("Rejected", "Rejected")),  # Status choices
        default="Pending"
    )
    submission_date = models.DateTimeField(auto_now_add=True)  # Automatically set the submission date
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE)  # Link to the Pet model
    adopter_user = models.ForeignKey(User, on_delete=models.CASCADE)  # Link to the User model
    message = models.TextField(null=True, blank=True)  # Optional message field

    def __str__(self):
        return f"Application {self.application_id} - {self.application_status}"  # String representation

# --------------------------------------- Donation Model -------------------------------------------

# This model represents donations made by users to shelters.
class Donation(models.Model):
    fundId = models.BigAutoField(primary_key=True)  # Auto-incrementing ID
    adopter_user_id = models.ForeignKey(User, on_delete=models.CASCADE)  # Link to the User model
    shelter_id = models.ForeignKey(Shelter, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    donation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Donation {self.fundId} - ${self.amount}"
    def recordDonation(self, adopter, shelter, amount):
        """Record a donation."""
        self.adopter_user_id = adopter
        self.shelter_id = shelter
        self.amount = amount
        self.save()
    def getDonationDetails(self):
        return {self.fundId, self.adopter_user_id.username, self.shelter_id.name, self.amount, self.donation_date}

# --------------------------------------- Adopter Model -------------------------------------------

# This model represents the adoption of pets by users.
class Adopter(models.Model):
    adopter_user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    pet_id = models.ForeignKey(Pet, on_delete=models.CASCADE)
    adoption_date = models.DateTimeField(auto_now_add=True)
    adoption_status = models.BooleanField(default=False)

    def __str__(self):
        return self.adopter_user_id.username
    

# --------------------------------------- Favourite Model -------------------------------------------

# This model represents the favourite pets of users.
class Favourite(models.Model):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='favourites')  # Renamed from pet_id to pet
    adopter_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favourites')  # Fixed related_name typo

    def addPetToFavourites(self, pet, adopter):
        """Add a pet to the user's favourites."""
        # Create a new Favourite entry if it doesn't already exist
        favourite, created = Favourite.objects.get_or_create(pet=pet, adopter_user=adopter)
        return favourite

    def removePetFromFavourites(self, pet, adopter):
        """Remove a pet from the user's favourites."""
        # Find and delete the Favourite entry
        favourite = Favourite.objects.filter(pet=pet, adopter_user=adopter).first()
        if favourite:
            favourite.delete()
            return True
        return False

    def __str__(self):
        return f"{self.adopter_user.username} - {self.pet.name}"