from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Event, LandmarksWithEvents

@api_view(['GET'])
def get_events(request, node_name):
    try:
        skip = int(request.GET.get('skip',0))
        take = int(request.GET.get('take',10))
        
        if skip < 0:
            return Response({'error': 'Skip parameter must be non-negative'}, status=status.HTTP_400_BAD_REQUEST)
        if take <= 0 or take > 100:  # Limit maximum results per request
            return Response({'error': 'Take parameter must be between 1 and 100'}, status=status.HTTP_400_BAD_REQUEST)
        
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

@api_view(['GET'])
def get_nodes_with_events(request):
    """
    This view handles the request to get nodes with events.
    """
    try:
        q_nodesWithEvents = LandmarksWithEvents.objects.get(id="1")
        nodes_with_events = q_nodesWithEvents.nodes_with_events or []
        print(nodes_with_events,q_nodesWithEvents)
    except LandmarksWithEvents.DoesNotExist:
        return Response({'error': 'No landmarks with events found'}, status=status.HTTP_404_NOT_FOUND)
    return Response(nodes_with_events, status=status.HTTP_200_OK)