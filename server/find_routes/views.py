from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .algo.opt_path import find_path
from pymongo.server_api import ServerApi
from rest_framework import generics, renderers
from django.http import FileResponse, Http404
from dotenv import load_dotenv
from bson import json_util
from .models import Nodes, Image
from urllib.parse import unquote
import mimetypes
import traceback
import pymongo
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

    load_dotenv()
    uri  = os.getenv('MONGO_URI')
    client = pymongo.MongoClient(uri, 
                                 tls=True,
                                 tlsAllowInvalidCertificates=True,
                                 server_api=ServerApi('1'))

    try:
        collection = client['GeoJson']['nodes']
        cursor = collection.find({'properties.isLandmark' : {'$eq':True}}, {'_id':0,'neighbors':0,})
        return Response({'options': list(cursor)}, status=status.HTTP_200_OK)
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
    load_dotenv()

    uri  = os.getenv('MONGO_URI')
    client = pymongo.MongoClient(uri, server_api=ServerApi('1'))
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

        # Define the path to save the JSON file
        base_dir = os.path.dirname(os.path.abspath(__file__))
        coord_path = os.path.join(base_dir,'algo','mapdata','coordinate_graph.json')

        # Write the combined data to the JSON file
        with open(coord_path,'w') as file:
            json.dump(nodes,file,indent=4)

        coordinate_data = [{'name':key, **value} for key,value in nodes.items()]

        landmarks = [{'name': key, 'location' : {
                                    'type' : 'Point',
                                    'coordinates' : value.get('coords', [])[::-1]
                                    },
                    } 
                     for key, value in nodes.items() 
                     if value.get('properties',{}).get('isLandmark', False)]

        # Insert or update landmarks in the MongoDB collection
        collection = client['GeoJson']['landmarks']
        if landmarks:
            collection.create_index([("location", "2dsphere")])
            collection.delete_many({})
            collection.insert_many(landmarks)
        else:
            collection.delete_many({})
        
        # Insert or update landmarks in the Django ORM
        
        for landmark in removed_nodes:
            Nodes.objects.filter(name=landmark).delete()
            print('removing:' , landmark)
        
        for landmark in renamed_nodes:
            old_name = landmark['oldName']
            new_name = landmark['newName']
            print('renaming:', old_name, 'to', new_name)
            selectedNode = Nodes.objects.filter(name=old_name)
            selectedNode.update(name=new_name)
        
        for landmark in landmarks:
            node, created = Nodes.objects.update_or_create(
                name = landmark['name'], defaults={
                    'name': landmark['name'],
                }
            )
            print('created:', node.name) if created else print('updated:', node.name)

        nd_collection = client['GeoJson']['nodes']
        nd_collection.create_index([("name", pymongo.ASCENDING)])
        nd_collection.delete_many({})
        if coordinate_data:
            nd_collection.insert_many(coordinate_data)

        options_path = os.path.join(base_dir,'options','TEST.json')

        # Save landmarks to a separate file
        with open(options_path,'w') as file:
            json.dump(landmarks, file, indent=4, default=json_util.default)       

        return Response({'message': 'Nodes updated successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        print("Error", e)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class ImageAPIView(APIView):

    def get(self, request, *args, **kwargs):
        name = unquote(self.kwargs.get('name'))
        print('Looking for image:' , name)
        try:
            node = Nodes.objects.get(name=name)
        except Nodes.DoesNotExist:
            print('node not found')
            return Response({'error': 'Node not found'}, status=status.HTTP_404_NOT_FOUND)
        
        image_instance = node.image
        if not image_instance or not image_instance.image:
            print('image not found')
            return Response({'error': 'Image not found'}, status=status.HTTP_404_NOT_FOUND)
        
        image = image_instance.name
        content_type, _ = mimetypes.guess_type(image)
        return FileResponse(image_instance.image.open(), content_type=content_type)
    
    def post(self, request):
        print('hi')
        print(request.FILES)
        print(request.data)
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