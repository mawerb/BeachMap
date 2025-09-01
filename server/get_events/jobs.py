from datetime import datetime, timezone, timedelta
from rest_framework.response import Response
from rest_framework import status
from django.contrib.postgres.search import TrigramSimilarity
from django.db.models import Value, CharField, TextField
from django.db.models.functions import Cast, Lower
from find_routes.models import Nodes
from dateutil.parser import isoparse
from .models import Event, LandmarksWithEvents
from .filters import departments
import requests
from schedule import Scheduler
import threading
import time
import html

def safe_parse(date):
    try:
        return isoparse(date) if date else None
    except:
        return None

def update_events():
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
    nodes_with_events = set()
    
    for event in data.get('value',[]):
        search_str = event.get('location', '').lower().strip()
        found_location = False
        
        search_parts = set()
        
        for part in search_str.split(','):
            part = part.strip()
            if part:
                search_parts.add(part)
            
        location_parts = set(search_parts)
        for part in location_parts:
            part = part.lower()
            found_seperator = False
            for seperator in ['&','-',' and ']:
                if seperator in part:
                    search_parts.remove(part)
                    for subpart in part.split(seperator):
                        subpart = subpart.strip()
                        if subpart:
                            search_parts.add(subpart)
                    found_seperator = True
                    break
        
        for location_part in search_parts:
            # Filter out common stop words
            stop_words = {'the', 'a', 'an', 'of', 'at', 'in', 'on', 'and', 'or', 'to', 'for', 'center','hall','university'}
            alias_search = [part.lower().strip() for part in location_part.strip().split() 
                            if part.lower() not in stop_words]
            
            if 'library’s' in location_part:
                print('ALIAS_SEARCH: ',alias_search)
                print('LOCATION_PART: ', location_part)
                
            
            # Fallback if all words were filtered out
            if not alias_search:
                alias_search = [part.lower().replace('-', '') for part in location_part.strip().split()]

    
            prefix_url = 'https://se-images.campuslabs.com/clink/images/'
            suffix_url = '?preset=med-sq'
            try:
                for alias in alias_search:
                    node_location = Nodes.objects.annotate(aliases_text=Lower(Cast('aliases',TextField()))).filter(aliases_text__icontains=alias)
                    if node_location.exists():
                        print(f"DEBUG - First match: alias '{alias}' found in nodes: {[n.name for n in node_location]}")
                        break
                    
                if not node_location or not node_location.exists():
                    candidates = Nodes.objects.all()
                    for node in candidates:
                        matches = [alias.lower() for alias in node.aliases if (alias.lower() in location_part and -2 < len(alias) - len(location_part) < 2)]
                        if matches:
                            print(f"DEBUG - Node '{node.name}' aliases {node.aliases} - matches found: {matches} in '{location_part}'")
                            node_location = Nodes.objects.filter(id=node.id)
                            break
                
                if not node_location.exists():
                    node_location = Nodes.objects.annotate(similarity=TrigramSimilarity(Lower('name'), Cast(Value(search_str), CharField()))).filter(similarity__gt=0.5).order_by('-similarity')
                
                if not node_location.exists():
                    errors.append(f"{alias_search}: No matching node for event ID {event.get('id', '')} with location '{search_str}'")
                    continue
                
                starts_on = safe_parse(event.get('startsOn', ''))
                ends_on = safe_parse(event.get('endsOn', ''))
                
                if not starts_on or not ends_on:
                    errors.append(f"Invalid date format for event ID {event.get('id', '')}")
                    continue
                
                nodes_with_events.add(node_location.first().name)
                found_location = True
                
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
                    'org_image_path' : prefix_url + event.get('organizationProfilePicture','') + suffix_url,
                    'is_department' : event.get('organizationName', '').lower() in departments
                }
                
                Event.objects.update_or_create(id=event_data['id'], defaults=event_data)
                
            except Exception as e:
                print(f"Error processing event {event.get('id', '')}: {e}")
                
                if not found_location:
                    errors.append(f"Error processing event ID {event.get('id', '')}: {str(e)}")
    
    LandmarksWithEvents.objects.update_or_create(id="1", defaults={'nodes_with_events': list(nodes_with_events)})
    
    if errors:
        return Response({'errors' : errors }, status=status.HTTP_207_MULTI_STATUS)
    return Response({'message' : 'Events updated succesfully'}, status=status.HTTP_200_OK)

def run_continuously(self, interval=1):
    """Continuously run, while executing pending jobs at each elapsed
    time interval.
    @return cease_continuous_run: threading.Event which can be set to
    cease continuous run.
    Please note that it is *intended behavior that run_continuously()
    does not run missed jobs*. For example, if you've registered a job
    that should run every minute and you set a continuous run interval
    of one hour then your job won't be run 60 times at each interval but
    only once.
    """

    cease_continuous_run = threading.Event()

    class ScheduleThread(threading.Thread):

        @classmethod
        def run(cls):
            while not cease_continuous_run.is_set():
                self.run_pending()
                time.sleep(interval)

    continuous_thread = ScheduleThread()
    continuous_thread.setDaemon(True)
    continuous_thread.start()
    return cease_continuous_run

Scheduler.run_continuously = run_continuously

def start_scheduler():
    scheduler = Scheduler()
    scheduler.every(15).minutes.do(update_events)
    scheduler.run_continuously()