from django.contrib.gis.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver
import os

# Create your models here.
class Nodes(models.Model):
    name = models.CharField(max_length=100, unique=True)
    coords = models.PointField(null=True, blank=True, srid=4326)
    properties = models.JSONField(default=dict, blank=True)
    type = models.CharField(max_length=50, default="default")
    aliases = models.JSONField(default=list, blank=True)
    
    def __str__(self):
        return self.name
    
class Image(models.Model):
    node = models.OneToOneField(Nodes, on_delete=models.CASCADE, related_name='image')
    name = models.CharField(max_length=100, unique=True)
    ext = models.CharField(max_length=10, default='jpg')
    image = models.ImageField(
        upload_to='uploads/',
        max_length=255,
        )
    def __str__ (self):
        return f"{self.name}.{self.ext}"
    
@receiver(post_delete, sender=Image)
def delete_image_file(sender, instance, **kwargs):
    if instance.image and os.path.isfile(instance.image.path):
        os.remove(instance.image.path)
