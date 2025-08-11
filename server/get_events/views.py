from django.shortcuts import render
from rest_framework.decorators import api_view
from datetime import datetime, timezone, timedelta
from dateutil.parser import isoparse
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from pymongo.server_api import ServerApi
from rest_framework import generics, renderers
from django.contrib.postgres.search import TrigramSimilarity
from django.http import FileResponse, Http404
from django.db.models import Value, CharField, TextField
from django.db.models.functions import Cast, Lower
from dotenv import load_dotenv
from bson import json_util
from find_routes.models import Nodes
from .models import Event
import requests
import html

# util functions
def safe_parse(date):
    try:
        return isoparse(date) if date else None
    except:
        return None

# Create your views here.

@api_view(['GET'])
def update_events(request):
    """
    This view handles the request to get events.
    """
    url='https://csulb.campuslabs.com/engage/api/discovery/event/search'
    ptc = timezone(timedelta(hours=-7))
    date_time = datetime.now(tz=ptc).replace(microsecond=0)
    current_time = date_time.isoformat()
    
    params = {
        'endsAfter' : current_time,
        'orderByField' : 'endsOn',
        'orderByDirection' : 'ascending',
        'status' : 'Approved',
        'take' : 100,
        'query' : '',
        'skip' : 0,
    }
    
    try:
        result = requests.get(url, params=params)
        print("Request URL:", result.url)  # Debugging line to check the URL
        result.raise_for_status()  # Raise an error for bad responses
        data = result.json()
        
    except requests.exceptions.RequestException as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    Event.objects.filter(starts_on__lt=date_time).delete()

    errors = []
    
    for event in data.get('value',[]):
        
        search_str = event.get('location', '')
        alias_search = search_str.strip().lower().split()
        prefix_url = 'https://se-images.campuslabs.com/clink/images/'
        suffix_url = '?preset=med-sq'
        try:
            for alias in alias_search:
                node_location = Nodes.objects.annotate(aliases_text=Lower(Cast('aliases',TextField()))).filter(aliases_text__icontains=alias)
                if node_location.exists():
                    break
                
            if not node_location.exists():
                node_location = Nodes.objects.annotate(similarity=TrigramSimilarity(Lower('name'), Cast(Value(search_str), CharField()))).filter(similarity__gt=0.3).order_by('-similarity')
            
            if not node_location.exists():
                errors.append(f"No matching node for event ID {event.get('id', '')} with location '{search_str}'")
                continue
            
            starts_on = safe_parse(event.get('startsOn', ''))
            ends_on = safe_parse(event.get('endsOn', ''))
            
            if not starts_on or not ends_on:
                errors.append(f"Invalid date format for event ID {event.get('id', '')}")
                continue
            
            event_data = {
                'id' : event.get('id', ''),
                'name' : html.unescape(event.get('name', '')),
                'organization_name' : html.unescape(event.get('organizationName', '')),
                'node_location' : node_location.first(),
                'location' : html.unescape(event.get('location', '')),
                'starts_on' : starts_on,
                'ends_on' : ends_on,
                'description' : html.unescape(event.get('description','')),
                'image_path' : prefix_url + event.get('imagePath','') + suffix_url,
                'org_image_path' : prefix_url + event.get('organizationProfilePicture','') + suffix_url
            }
            
            Event.objects.update_or_create(id=event_data['id'], defaults=event_data)
            
        except Exception as e:
            print(f"Error processing event {event.get('id', '')}: {e}")
            errors.append(f"Error processing event ID {event.get('id', '')}: {str(e)}")
            
    if errors:
        return Response({'errors' : errors }, status=status.HTTP_207_MULTI_STATUS)
    return Response({'message' : 'Events updated succesfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_events(request, node_name):
    try:
        skip = int(request.GET.get('skip',0))
        take = int(request.GET.get('take',10))
    except ValueError:
        return Response({'error': 'Invalid skip or take parameter'}, status=status.HTTP_400_BAD_REQUEST)

    event_qs = Event.objects.filter(node_location__name=node_name).order_by('starts_on')[skip:skip+take]

    events_data = [{
        'id': event.id,
        'name': event.name,
        'organization_name': event.organization_name,
        'node_location': event.node_location.name if event.node_location else None,
        'location': event.location,
        'starts_on': event.starts_on.isoformat() if event.starts_on else None,
        'ends_on': event.ends_on.isoformat() if event.ends_on else None,
        'description': event.description,
        'image_path': event.image_path,
        'org_image_path': event.org_image_path,
    } for event in event_qs]
    
    return Response(events_data, status=status.HTTP_200_OK)