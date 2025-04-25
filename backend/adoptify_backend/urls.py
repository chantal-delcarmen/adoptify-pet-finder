"""
URL configuration for adoptify_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from api import views
from api.views import CreateUserView, CreateAdminUserView, UpdateApplicationStatusView, UserDetailsView, AddFavouriteView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # ----------------------------------- Admin Panel -------------------------------------------
    path('admin/', admin.site.urls),  # Django admin panel

    # ----------------------------------- Health Check -------------------------------------------
    path('', views.health_check, name='health_check'),  # Health check at root ("/")

    # ----------------------------------- API Endpoints -------------------------------------------
    path("api/", include("api.urls")),  # Include API-specific URLs

    # ------------------------------------- Test Endpoint -------------------------------------------
    path('api/test/', views.test),  # Endpoint created in the views.py file to test the backend

    # -------------------------------- Home Page Endpoint -------------------------------------------
    # path("api/home/", views.home, name="home"),  # Home page endpoint (commented out)

    # ------------------------------------- Authentication -------------------------------------------
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),  # Token generation endpoint
    path("api/token/refresh", TokenRefreshView.as_view(), name="refresh"),  # Token refresh endpoint
    path("api-auth/", include("rest_framework.urls")),  # Include Django REST framework's authentication URLs

    # ------------------------------------- User Registration -------------------------------------------
    path("api/user/register/", CreateUserView.as_view(), name="register"),  # User registration endpoint
    path("api/user/register/admin/", CreateAdminUserView.as_view(), name="register_admin"),  # Admin registration endpoint
    path("api/user/details/", UserDetailsView.as_view(), name="user_details"),  # User details endpoint

    # ------------------------------------- Application Management -------------------------------------------
    path("api/adoption-application/", views.CreateAdoptionApplication.as_view(), name="adoption_application"),  # Create adoption application
    path("api/adoption-application/<int:pk>/", views.AdoptionView.as_view(), name="adoption_application_detail"),  # Adoption application detail view
    path("api/adoption-application/list/", views.AdoptionApplicationListView.as_view(), name="adoption_applications"),  # Adoption applications list view
    path("api/adoption-application/<int:pk>/update-status/", UpdateApplicationStatusView.as_view(), name="update_application_status"),  # Update application status endpoint

    # ------------------------------------- Shelter Management -------------------------------------------
    # Create a new shelter
    path("api/admin/shelter/", views.CreateShelterView.as_view(), name="create_shelter"),  # Shelter creation endpoint

    # Create a new shelter management record
    path("api/admin/shelter-management/", views.CreateShelterManagementView.as_view(), name="create_shelter_management"),  # Shelter management creation endpoint
    
    # Retrieve or delete a shelter management record
    path("api/admin/shelter-management/<int:pk>/", views.ShelterManagementDetailView.as_view(), name="shelter_management_detail"),  # Shelter management detail endpoint

    # Update shelter management record
    path("api/admin/shelter-management/<int:pk>/", views.UpdateShelterManagementView.as_view(), name="update_shelter_management"),  # Shelter management update endpoint

    # Shelter list endpoint
    path("api/admin/shelters/", views.ShelterListView.as_view(), name="shelter_list"),  # List all shelters

    # Update shelter
    path("api/admin/shelter/<int:pk>/", views.UpdateShelterView.as_view(), name="update_shelter"),  # Update shelter details

    # -------------------------------------- Pet Management -------------------------------------------
    # Add a new pet
    path("api/register-pet/", views.CreatePetView.as_view(), name="register_pet"),  # Pet registration endpoint

    # List all pets
    path("api/pets/", views.PetListView.as_view(), name="pet_list"),  # Pet list endpoint

    # Pet details
    path("api/pets/<int:pk>/", views.PetDetailView.as_view(), name="pet_detail"),  # Pet detail endpoint

    # -------------------------------------- Favourite a Pet ----------------------------------------
    # Add Favourite 
    path("api/favourite/<int:pk>/add/", views.AddFavouriteView.as_view(), name="favourite_pet"),  # Favourite pet endpoint

    # Remove Favourite
    path("api/favourite/<int:pet_id>/remove/", views.RemoveFavouriteView.as_view(), name="remove_favourite"),  # Remove favourite pet endpoint

    # Favourite List for a user
    path("api/favourite/list/", views.FavouriteListView.as_view(), name="favourite_list"),  # List of favourite pets for a user

    # -------------------------------------- Donation Management -------------------------------------------
    path("api/donate/", views.CreateDonationView.as_view(), name="donate"),  # Donation endpoint
    path("api/donations/<int:pk>/", views.DonationView.as_view(), name="donation_detail"),  # Donation detail endpoint
    path("api/donations/list/", views.DonationListView.as_view(), name="donation_list"),  # List of donations for a user
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)  # Serve media files in development
