from django.urls import path
from . import views
import asyncio

urlpatterns = [
    path('login/', views.auth_handler , name='auth_handler'),
    path('verify/', views.verify_handler, name='verify_handler')
]