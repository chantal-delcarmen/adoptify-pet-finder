from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from api.models import Pet, Shelter

class TestCreatePetView(APITestCase):
    def setUp(self):
        # Create an admin user
        self.admin_user = User.objects.create_superuser(username="admin", password="admin123")
        self.client.login(username="admin", password="admin123")

        # Create a shelter
        self.shelter = Shelter.objects.create(
            name="Happy Tails Shelter",
            address="123 Shelter Ave",
            phone_number="1234567890",
            website_url="http://happytails.com"
        )

    def test_create_pet_without_shelter(self):
        data = {
            "name": "Buddy",
            "pet_type": "Dog",
            "adoption_status": "Available"
        }
        response = self.client.post("/api/register-pet/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Pet.objects.count(), 1)
        self.assertEqual(Pet.objects.first().name, "Buddy")

    def test_create_pet_with_shelter(self):
        data = {
            "name": "Buddy",
            "pet_type": "Dog",
            "adoption_status": "Available",
            "shelter_id": self.shelter.shelter_id
        }
        response = self.client.post("/api/register-pet/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Pet.objects.count(), 1)
        self.assertEqual(Pet.objects.first().shelter_id, self.shelter)

    def test_create_pet_as_non_admin(self):
        # Log out admin and create a regular user
        self.client.logout()
        regular_user = User.objects.create_user(username="user", password="user123")
        self.client.login(username="user", password="user123")

        data = {
            "name": "Buddy",
            "pet_type": "Dog",
            "adoption_status": "Available"
        }
        response = self.client.post("/api/register-pet/", data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)