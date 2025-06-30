from django.urls import path
from . import views

urlpatterns = [
    path('opt_path/', views.opt_path , name='opt_path'),
    path('options/', views.get_options, name='options')
]