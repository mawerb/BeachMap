from django.urls import path
from . import views
import asyncio

urlpatterns = [
    path('get_nodes_with_events/', views.get_nodes_with_events, name='get_nodes_with_events'),
    path('<str:node_name>/', views.get_events, name='get_events'),
    path('cron/update_events/', views.update_events , name='update_events'),
]