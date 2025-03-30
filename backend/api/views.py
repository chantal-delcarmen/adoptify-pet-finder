# backend/api/views.py
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from django.http import JsonResponse

# DRF Test View using Response (For REST API responses)
@api_view(['GET'])
@renderer_classes([JSONRenderer])
def test(request):
    return Response({"message": "Backend is working!"})

# Basic Health Check View using JsonResponse (For simple GET requests)
def health_check(request):
    return JsonResponse({"status": "OK", "message": "Backend is working"})
