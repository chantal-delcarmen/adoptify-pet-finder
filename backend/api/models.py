from django.db import models

# Defines the database schema using Django models
# When to Edit:
# - To create or modify database tables
# - To define relationships between tables

# Example add a new model for pets
class PetTest(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    breed = models.CharField(max_length=100)