from django.urls import path
from . import views
from django.conf import settings



urlpatterns = [
    path('test/', views.test, name='test'),  # Example endpoint
    path('api/adoption-application/', views.CreateAdoptionApplication.as_view(), name='adoption_application'),  # Adoption application endpoint
]