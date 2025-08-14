from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .algo.opt_path import find_path
from django.http import FileResponse, Http404
from .models import Nodes, Image
from django.contrib.gis.geos import Point
from urllib.parse import unquote
import mimetypes
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
    """
    This view retrieves all landmarks from the database.
    """
    try:
        landmarks = Nodes.objects.filter(properties__isLandmark=True)
        
        landmark_data = []
        for landmark in landmarks:
            if landmark.coords:
                data = {
                    'name' : landmark.name,
                    'coords' : [landmark.coords.y, landmark.coords.x],
                    'type' : landmark.type,
                    'properties' : landmark.properties,
                    'overview' : landmark.overview
                }
                landmark_data.append(data)
        
        return Response({'options': landmark_data}, status=status.HTTP_200_OK)
    except Exception as e:
        print("Error", e)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_nodes (request):

    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        path = os.path.join(base_dir,'algo','mapdata','coordinate_graph.json')
        with open(path,'r') as file:
            data = json.load(file)

        return Response({'result':data})
    except Exception as e:
        print("Error", e)
        return Response({'error': str(e)}, status=500)
    
@api_view(['PUT'])
def update_nodes (request):
    
    print(request.data)
    try:
        data = request.data
        nodes = data.get('nodes', {})
        removed_nodes = data.get('deleted_nodes', [])
        updated_nodes = data.get('updated_nodes', [])
        renamed_nodes = data.get('renamed_nodes', [])
        print('nodes:', nodes)
        print('removed_nodes:', removed_nodes)
        print('renamed_nodes:', renamed_nodes)
        print('updated_nodes:', updated_nodes)

        # Define the path to save the JSON file
        base_dir = os.path.dirname(os.path.abspath(__file__))
        coord_path = os.path.join(base_dir,'algo','mapdata','coordinate_graph.json')

        for updated_node in updated_nodes:
            node_name = updated_node.get('name')
            node_type = updated_node.get('type')
            node_overview = updated_node.get('overview')
            print(f'{node_name} type: {node_type}')
            
            if node_name in nodes and node_type:
                nodes[node_name]['type'] = node_type
                nodes[node_name]['overview'] = node_overview

        # Write the combined data to the JSON file
        with open(coord_path,'w') as file:
            json.dump(nodes,file,indent=4)

        if removed_nodes:
            deleted_count = Nodes.objects.filter(name__in=removed_nodes).delete()[0]
            print(f'Deleted {deleted_count} nodes from the database.')

        for renamed_node in renamed_nodes:
            old_name = renamed_node.get('oldName')
            new_name = renamed_node.get('newName')
            updated = Nodes.objects.filter(name=old_name).update(name=new_name)
            if old_name in nodes:
                nodes[new_name] = nodes.pop(old_name)
            if updated:
                print(f'Renamed node from {old_name} to {new_name}.')
                
        for node_name, node_data in nodes.items():
            coords = node_data.get('coords', [])
            
            point = None
            if coords and len(coords) == 2:
                point = Point(coords[1], coords[0], srid=4326)
            
            node, created = Nodes.objects.update_or_create(name=node_name, defaults={
                'coords': point,
                'properties': node_data.get('properties', {}),
                'type': node_data.get('type', 'default'),
                'overview' : node_data.get('overview', '')
                }
            )
            print(f'{"Created" if created else "Updated"} node: {node.name}')

        landmarks = Nodes.objects.filter(properties__isLandmark=True)  

        return Response({'message': 'Nodes updated successfully',
                         'stats': {
                            'total_nodes': Nodes.objects.count(),
                            'landmarks': len(landmarks)
            }}, status=status.HTTP_200_OK)
        
    except Exception as e:
        print("Error", e)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class ImageAPIView(APIView):

    def get(self, request, *args, **kwargs):
        """
        This view retrieves the image associated with a node.
        It expects the node name as a URL parameter.
        """
        
        name = unquote(self.kwargs.get('name'))
        print('Looking for image:' , name)
        try:
            node = Nodes.objects.get(name=name)
        except Nodes.DoesNotExist:
            print(f'{name} node not found')
            return Response({'error': 'Node not found'}, status=status.HTTP_404_NOT_FOUND)
        
        image_instance = node.image
        if not image_instance or not image_instance.image:
            print(f'image not found for node {name}')
            return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)
        
        image = image_instance.name
        content_type, _ = mimetypes.guess_type(image)
        return FileResponse(image_instance.image.open(), content_type=content_type)
    
    def post(self, request):
        """
        This view handles the image upload for a node.
        It expects an image file in the request and updates the node's image.
        """
        try:
            if 'image' not in request.FILES:
                return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
            
            data = request.FILES['image']
            name = data.name.rsplit('.', 1)[0]
            ext = data.name.rsplit('.', 1)[-1]
            print(name,ext)
            
            try:
                print('Fetching node with name:', name)
                print(Nodes.objects.all())
                node = Nodes.objects.get(name=name)
            except Nodes.DoesNotExist:
                print('Node does not exist')
                return Response({'error': f'Node with name "{name}" does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                image_instance = node.image
            except Image.DoesNotExist:
                image_instance = Image(node=node, name=name, ext=ext, image=data)
                image_instance.save()
                node.save()
                print(image_instance.image.name)
                
                return Response({'message': 'Image updated successfully'}, status=status.HTTP_200_OK)
            
            print(image_instance.image.name)

            if image_instance.image:
                old_image_path = image_instance.image.path
                if os.path.exists(old_image_path):
                    os.remove(old_image_path)
                image_instance.name = name
                image_instance.image = data
                image_instance.ext = ext
                image_instance.save()

            return Response({'message': 'Image replaced successfully'}, status=status.HTTP_200_OK)

        except Exception as e:
            print("Error", e)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)