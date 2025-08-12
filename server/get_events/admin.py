from django.contrib import admin
from .models import Event, LandmarksWithEvents

# Register your models here.
admin.site.register(Event)
admin.site.register(LandmarksWithEvents)