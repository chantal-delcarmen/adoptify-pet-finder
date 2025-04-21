from rest_framework.permissions import BasePermission

class IsOwner(BasePermission):
    #Custom permission to allow access only to the owner of the adoption application.

    def has_object_permission(self, request, view, obj):
        # Check if the authenticated user is the owner of the object
        return obj.adopter_user == request.user