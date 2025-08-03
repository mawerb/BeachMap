from django.urls import path
from . import views
import asyncio

urlpatterns = [
    path('opt_path/', views.opt_path , name='opt_path'),
    path('options/', views.get_options, name='options'),
    path('nodes/', views.get_nodes, name='get_nodes'),
    path('update_nodes/', views.update_nodes, name='update_nodes'),
    path('upload_image/', views.ImageAPIView.as_view(), name='upload_image'),
    path('get_image/<str:name>/', views.ImageAPIView.as_view(), name='get_image'),
]