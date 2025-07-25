from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .algo.opt_path import find_path
import traceback
import json
import os

# Create your views here.
@api_view(['POST'])
def opt_path (request):
    """
    This view handles the optimal path finding request.
    """
    try:
        data = request.data
        # Extract start and end coordinates from the request data
        start = data.get('start')
        end = data.get('end')

        if not start or not end:
            return Response({'error':'Start and end coordinates are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Call the find_path function to get the optimal path
        path = find_path(start, end)

        if not path:
            return Response({'error': 'No path found.'}, status=status.HTTP_404_NOT_FOUND)

        # Return the path as a JSON response
        return Response({'path': path}, status=status.HTTP_200_OK)
    except Exception as e:
        traceback.print_exc()
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def get_options (request):
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        path = os.path.join(base_dir,'options','locations.json')
        with open(path,'r') as file:
            data = json.load(file)

        return Response({'options': data})
    except Exception as e:
        print("Error", e)
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def get_nodes (request):
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        path = os.path.join(base_dir,'algo','mapdata','coordinate_graph.json')
        with open(path,'r') as file:
            data = json.load(file)
        
        del data['_meta']

        return Response({'result':data})
    except Exception as e:
        print("Error", e)
        return Response({'error': str(e)}, status=500)
    
@api_view(['PUT'])
def update_nodes (request):
    try:
        data = request.data

        meta = {
            "_meta": {
                "units": "kilometers",
                "description": "Campus walking paths graph"
            }
        }

        # Combine the meta information with the data
        combined_data = {**meta, **data}

        # Define the path to save the JSON file
        base_dir = os.path.dirname(os.path.abspath(__file__))
        coord_path = os.path.join(base_dir,'algo','mapdata','coordinate_graph.json')

        # Write the combined data to the JSON file
        with open(coord_path,'w') as file:
            json.dump(combined_data,file,indent=4)

        landmarks = [{'name': key, 'coords' : value.get('coords', []),} 
                     for key, value in data.items() if (key != '_meta') 
                     and value.get('properties',{}).get('isLandmark', False)]

        options_path = os.path.join(base_dir,'options','TEST.json')

        # Save landmarks to a separate file
        with open(options_path,'w') as file:
            json.dump(landmarks, file, indent=4)

        return Response({'message': 'Nodes updated successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        print("Error", e)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)