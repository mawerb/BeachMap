from django.db import models
from find_routes.models import Nodes

# Create your models here.
class Event(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=255)
    organization_name = models.CharField(max_length=255)
    node_location = models.ForeignKey('find_routes.Nodes', on_delete=models.CASCADE, related_name='events')
    location = models.CharField(max_length=255, blank=True, null=True)
    starts_on = models.DateTimeField()
    ends_on = models.DateTimeField()
    description = models.TextField(blank=True, null=True)
    image_path = models.CharField(max_length=255, blank=True, null=True)
    org_image_path = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return f"ID: {self.id} {self.name} ({self.starts_on.strftime('%Y-%m-%d')})"
    
class LandmarksWithEvents(models.Model):
    id = models.CharField(max_length=100, primary_key=True, default='1')
    nodes_with_events = models.JSONField(default=list, blank=True)