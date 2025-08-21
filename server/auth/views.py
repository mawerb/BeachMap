from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import render
from dotenv import load_dotenv
from datetime import datetime, timedelta
import json
import jwt
from jwt.exceptions import InvalidTokenError,DecodeError,InvalidSignatureError,ExpiredSignatureError
import os

# Create your views 
# here.
load_dotenv()

@api_view(['POST'])
def auth_handler(request):
    jwt_secret_key = os.environ.get('JWT_SECRET')
    json_data = json.loads(request.body.decode('utf-8'))
    username, password = json_data.values()
    
    if (password != os.environ.get('JWT_PASSWORD')):
        return Response({'message' : 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)
    
    payload = {
        'sign_in_time' : str(datetime.now()),
        'username' : username,
        'exp' : datetime.now() + timedelta(hours=1)
    }
    
    token = jwt.encode(payload, jwt_secret_key, algorithm='HS256')
    
    return Response({'message': 'success', 'token':token}, status=status.HTTP_200_OK)

@api_view(['GET'])
def verify_handler(request):
    jwt_secret_key = os.environ.get('JWT_SECRET')
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith("Bearer "):
        return Response({"message":"token missing"}, status=status.HTTP_401_UNAUTHORIZED)
    
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])
        if payload:
            return Response({"message":"successful login!"}, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    except DecodeError:
        return Response({"message":"unable to authorize token"}, status=status.HTTP_401_UNAUTHORIZED)
    except InvalidSignatureError:
        return Response({"message":"invalid signature"}, status=status.HTTP_401_UNAUTHORIZED)
    except ExpiredSignatureError:
        return Response({"message":"expired signature"}, status=status.HTTP_401_UNAUTHORIZED)
    except InvalidTokenError:
        return Response({"message":"invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        print(e)
        return Response({"error":e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)