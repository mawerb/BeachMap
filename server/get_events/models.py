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