from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .algo.opt_path import find_path
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
from bson import json_util
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
    client = pymongo.MongoClient(uri, server_api=ServerApi('1'))

    try:
        collection = client['GeoJson']['nodes']
        cursor = collection.find({'properties.isLandmark' : {'$eq':True}}, {'_id':0,'neighbors':0,})
        return Response({'options': list(cursor)}, status=status.HTTP_200_OK)
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

        return Response({'result':data})
    except Exception as e:
        print("Error", e)
        return Response({'error': str(e)}, status=500)
    
@api_view(['PUT'])
def update_nodes (request):
    load_dotenv()

    uri  = os.getenv('MONGO_URI')
    client = pymongo.MongoClient(uri, server_api=ServerApi('1'))

    try:
        data = request.data

        # Define the path to save the JSON file
        base_dir = os.path.dirname(os.path.abspath(__file__))
        coord_path = os.path.join(base_dir,'algo','mapdata','coordinate_graph.json')

        # Write the combined data to the JSON file
        with open(coord_path,'w') as file:
            json.dump(data,file,indent=4)

        coordinate_data = [{'name':key, **value} for key,value in data.items()]

        landmarks = [{'name': key, 'location' : {
                                    'type' : 'Point',
                                    'coordinates' : value.get('coords', [])[::-1]
                                    },
                    } 
                     for key, value in data.items() 
                     if value.get('properties',{}).get('isLandmark', False)]

        # Insert or update landmarks in the MongoDB collection
        collection = client['GeoJson']['landmarks']
        collection.create_index([("location", "2dsphere")])
        collection.delete_many({})
        collection.insert_many(landmarks)

        nd_collection = client['GeoJson']['nodes']
        nd_collection.create_index([("name", pymongo.ASCENDING)])
        nd_collection.delete_many({})
        nd_collection.insert_many(coordinate_data)

        options_path = os.path.join(base_dir,'options','TEST.json')

        # Save landmarks to a separate file
        with open(options_path,'w') as file:
            json.dump(landmarks, file, indent=4, default=json_util.default)       

        return Response({'message': 'Nodes updated successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        print("Error", e)
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)