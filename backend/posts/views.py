from rest_framework.response import Response
from posts.models import Posts
from posts.serializers import PostSerializer
from rest_framework.views import APIView
from rest_framework import status 

class PostView(APIView):
    def post(self,request,format=None):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'msg':'Reel Uploaded Successfully','status':'success','candidate':serializer.data},status=status.HTTP_201_CREATED)
        return Response(serializer.errors)
    
    def get(self,request,format=None):
        candidates= Posts.objects.all()
        serializer = PostSerializer(candidates,many=True)
        return Response({'status':'success','candidates':serializer.data},status=status.HTTP_200_OK)