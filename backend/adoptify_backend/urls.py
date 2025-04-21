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
from api.views import CreateUserView, CreateAdminUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.health_check, name='health_check'),  # Health check at root ("/")

    #path("api/home/", views.home, name="home"),  # Home page endpoint
    path('api/test/', views.test),  # Endpoint created in the views.py file to test the backend

    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh", TokenRefreshView.as_view(), name="refresh"),
    #path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/user/register/admin/", CreateAdminUserView.as_view(), name="register_admin"),
    path("api/user/login/", views.UserLogInView.as_view(), name="login"),  # User login endpoint
    path("api/user/logout/", views.UserLogOutView.as_view(), name="logout"),  # User logout endpoint

    # Add a new application
    path("api/adoption-application/", views.CreateAdoptionApplication.as_view(), name="adoption_application"),
    # View an application
    path("api/adoption-application/<int:pk>/", views.AdoptionView.as_view(), name="adoption_application_detail"),  # Adoption application detail view
    # View a list of applications 
    path("api/adoption-application/list", views.AdoptionApplicationListView.as_view(), name="adoption_applications"),  # Adoption applications list view

    # Add a new Shelter Management
    path("api/admin/shelter-management/", views.CreateShelterManagementView.as_view(), name="shelter_management"),  # Shelter management endpoint
    # View a specific Shelter
    path("api/admin/shelter/<int:pk>", views.ShelterManagementView.as_view(), name="shelter_management_detail"),  # Shelter management detail view
    # Add a new Shelter
    path("api/admin/shelter/", views.CreateShelterView.as_view(), name="shelter"),  # Shelter list endpoint
    # View list of Shelters 
    path("api/admin/shelter/list", views.ShelterListView.as_view(), name="shelter_list"),
    
    # Admin view all applications
    path("api/admin/adoption-application/list", views.AdminAdoptionApplicationListView.as_view(), name="admin_adoption_applications"),  # Admin adoption applications list view
    # Admin approve or reject application
    path("api/admin/adoption-application/<int:pk>/", views.AdoptionView.as_view(), name="update_application_status"),  # Update application status endpoint

    # addPetPet
    path("api/register-pet/", views.CreatePetView.as_view(), name="register_pet"),  # Pet registration endpoint
    # listAllPets
    path("api/pets/", views.PetListView.as_view(), name="pet_list"),  # Pet list endpoint
    path("api/pets/<int:pk>/", views.PetDetailView.as_view(), name="pet_detail"),  # Pet detail endpoint

]
