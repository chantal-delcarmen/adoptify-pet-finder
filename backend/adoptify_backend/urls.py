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
from api.views import CreateUserView, CreateAdminUserView, UpdateApplicationStatusView, UserDetailsView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    # ----------------------------------- Admin Panel -------------------------------------------
    path('admin/', admin.site.urls),

    # ----------------------------------- Health Check -------------------------------------------
    path('', views.health_check, name='health_check'),  # Health check at root ("/")

    # ----------------------------------- API Endpoints -------------------------------------------
    path("api/", include("api.urls")),

    # ------------------------------------- Test Endpoint -------------------------------------------
    path('api/test/', views.test),  # Endpoint created in the views.py file to test the backend

    # -------------------------------- Home Page Endpoint -------------------------------------------
    #path("api/home/", views.home, name="home"),  # Home page endpoint

    # ------------------------------------- Authentication -------------------------------------------
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),

    # ------------------------------------- User Registration -------------------------------------------
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/user/register/admin/", CreateAdminUserView.as_view(), name="register_admin"),
    path("api/user/details/", UserDetailsView.as_view(), name="user_details"),

    # ------------------------------------- Application Management -------------------------------------------
    path("api/adoption-application/", views.CreateAdoptionApplication.as_view(), name="adoption_application"),
    path("api/adoption-application/<int:pk>/", views.AdoptionView.as_view(), name="adoption_application_detail"),  # Adoption application detail view
    path("api/adoption-application/list", views.AdoptionApplicationListView.as_view(), name="adoption_applications"),  # Adoption applications list view
    path("api/adoption-application/<int:pk>/update-status/", UpdateApplicationStatusView.as_view(), name="update_application_status"), # Update application status endpoint

    # ------------------------------------- Shelter Management -------------------------------------------
    # Create a new shelter
    path("api/admin/shelter/", views.CreateShelterView.as_view(), name="create_shelter"),

    # Create a new shelter management record
    path("api/admin/shelter-management/", views.CreateShelterManagementView.as_view(), name="create_shelter_management"),
    
    # Retrieve or delete a shelter management record
    path("api/admin/shelter-management/<int:pk>/", views.ShelterManagementDetailView.as_view(), name="shelter_management_detail"),

    # Shelter list endpoint
    path("api/admin/shelters/", views.ShelterListView.as_view(), name="shelter_list"),

    # -------------------------------------- Pet Management -------------------------------------------
    # addPet
    path("api/register-pet/", views.CreatePetView.as_view(), name="register_pet"),  # Pet registration endpoint

    # listAllPets
    path("api/pets/", views.PetListView.as_view(), name="pet_list"),  # Pet list endpoint

    # Pet details
    path("api/pets/<int:pk>/", views.PetDetailView.as_view(), name="pet_detail"),  # Pet detail endpoint

    # -------------------------------------- Favourite a Pet ----------------------------------------

    # Favourite List for a user
    path("api/favourite/list/", views.FavouriteListView.as_view(), name="favourite_list"),  # List of favourite pets for a user
    path("api/favourite/<int:pk>/", views.FavouriteView.as_view(), name="favourite_pet"),  # Check specific favorite

    # -------------------------------------- Donation Management -------------------------------------------
    path("api/donate/", views.CreateDonationView.as_view(), name="donate"),  # Donation endpoint
    path("api/donations/<int:pk>/", views.DonationView.as_view(), name="donation_detail"),  # Donation detail endpoint
    path("api/donations/list/", views.DonationListView.as_view(), name="donation_list"),  # List of donations for a user

]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
