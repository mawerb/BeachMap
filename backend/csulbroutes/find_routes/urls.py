from django.urls import path
from . import views

urlpatterns = [
    path('opt_path/', views.opt_path , name='opt_path'),
    path('options/', views.get_options, name='options'),
    path('nodes/', views.get_nodes, name='get_nodes'),
    path('update_nodes/', views.update_nodes, name='update_nodes'),
]