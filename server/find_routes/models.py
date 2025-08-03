from django.db import models

# Create your models here.
class Images(models.Model):
    name = models.CharField(max_length=100, unique=True)
    ext = models.CharField(max_length=10, default='jpg')
    image = models.ImageField(
        upload_to='uploads/',
        max_length=255,
        )
