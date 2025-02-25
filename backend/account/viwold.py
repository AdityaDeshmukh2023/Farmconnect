from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from account.serializers import UserRegitartionSerializer,UserLoginSerializer,UserProfileSerializer,ChangeUserPasswordSerializer,SendPasswordResetEmailSerializer,UserPasswordResetSerializer,UserProfileSerializer,UserProfileInputSerializer,DairyDataSerializer, PostSerializer, LikeSerializer, DislikeSerializer, CommentSerializer
from django.contrib.auth import authenticate
from account.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from account.models import Profile , DairyData,Post, Like, Dislike, Comment
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import viewsets,status
import logging
from django.core.exceptions import ValidationError
from .serializers import UserProfileSerializer
from .renderers import UserRenderer


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]
    def post(self,request,format=None):
        serializer = UserRegitartionSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            token = get_tokens_for_user(user)
            return Response({'token': token,'msg' : 'Registration Successful'},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

class UserLoginView(APIView):
    def post(self,request,format=None):
        serializer = UserLoginSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            email = serializer.data.get('email')
            password = serializer.data.get('password')
            user = authenticate(email=email,password=password)
            
            if user is not None:
              token = get_tokens_for_user(user)
              return Response({'token': token,'msg':'Login Success'},status=status.HTTP_200_OK)
            else:
                 return Response({'errors':{'non_field_errors':['Email or Password is not Valid']}},status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

# class UserProfileView(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]
#     def get(self,request,format=None):
#         serializer = UserProfileSerializer(request.user)
#         return Response(serializer.data,status=status.HTTP_200_OK)
    

class UserChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self,request,format=None):
        serializer = ChangeUserPasswordSerializer(data=request.data,context={'user':request.user})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'Password Changed Successfuly'},status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class SendPasswordResetEmailView(APIView):
    renderer_classes = [UserRenderer]
    def post(self,request,format=None):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'Password Reset link send. Please check your Email'},status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

class UserPasswordResetView(APIView):
    renderer_classes = [UserRenderer]
    def post(self,request,uid,token,format=None):
        serializer = UserPasswordResetSerializer(data = request.data,context={'uid':uid,'token':token})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'Password Reset SucccessFully'},status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
logger = logging.getLogger(__name__)
    
class UserProfileInputView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]  # Ensure the user is logged in
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        # Check if the user is authenticated
        if not request.user or not request.user.is_authenticated:
            logger.error("Unauthorized access attempt.")
            return Response(
                {"error": "Unauthorized access. Please log in."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        logger.info("Received data: %s", request.data)

        # Get the profile of the logged-in user or create one if it does not exist
        try:
            profile = request.user.profile
        except Profile.DoesNotExist:
            profile = Profile.objects.create(user=request.user)

        # Pass the profile instance to the serializer for updating
        serializer = UserProfileInputSerializer(profile, data=request.data, partial=True)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            logger.error("Serializer errors: %s", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        profile.save()
        logger.info("Profile updated successfully: %s", profile)
        return Response({'msg': 'Profile updated successfully'}, status=status.HTTP_200_OK)
    
# class UserProfileView(APIView):
#     renderer_classes = [UserRenderer]
#     permission_classes = [IsAuthenticated]

#     def get(self, request, format=None):
#         profile = request.user.profile  # Access the related Profile instance
#         serializer = UserProfileSerializer(profile)
#         return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        try:
            profile = request.user.profile  # Access the related Profile instance
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except AttributeError:
            # Handles case where the user does not have a profile
            return Response({"error": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            # Log the error for debugging
            print(f"Error in fetching user profile: {e}")  
            return Response({"error": "Internal Server Error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# Post Views
class PostListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PostDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return None

    def get(self, request, pk):
        post = self.get_object(pk)
        if post:
            serializer = PostSerializer(post)
            return Response(serializer.data)
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        post = self.get_object(pk)
        if post and post.user == request.user:
            post.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"error": "Post not found or you do not have permission to delete it"}, status=status.HTTP_403_FORBIDDEN)
    
class PostDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return None

    def get(self, request, pk):
        post = self.get_object(pk)
        if post:
            serializer = PostSerializer(post)
            return Response(serializer.data)
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        post = self.get_object(pk)
        if post:
            # Check if the requesting user is the owner of the post
            if post.user == request.user:
                post.delete()
                return Response({"message": "Post deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"error": "You do not have permission to delete this post."}, status=status.HTTP_403_FORBIDDEN)
        return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

# Like Views
class LikePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
            like = Like.objects.filter(user=request.user, post=post).first()

            if like:
                # If the user has already liked the post, unlike it
                like.delete()
                post.total_likes -= 1
                post.save()
                return Response({"message": "Post unliked successfully."}, status=status.HTTP_200_OK)
            else:
                # If the user has disliked the post, remove the dislike first
                dislike = Dislike.objects.filter(user=request.user, post=post).first()
                if dislike:
                    dislike.delete()
                    post.total_dislikes -= 1

                # Like the post
                Like.objects.create(user=request.user, post=post)
                post.total_likes += 1
                post.save()
                return Response({"message": "Post liked successfully."}, status=status.HTTP_201_CREATED)
        except Post.DoesNotExist:
            return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

class UnlikePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
            like = Like.objects.filter(user=request.user, post=post).first()
            if like:
                like.delete()
                post.total_likes -= 1
                post.save()
                return Response({"message": "Post unliked successfully."}, status=status.HTTP_200_OK)
            return Response({"error": "You have not liked this post."}, status=status.HTTP_400_BAD_REQUEST)
        except Post.DoesNotExist:
            return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

# Dislike Views
class DislikePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
            dislike = Dislike.objects.filter(user=request.user, post=post).first()

            if dislike:
                # If the user has already disliked the post, undislike it
                dislike.delete()
                post.total_dislikes -= 1
                post.save()
                return Response({"message": "Post undisliked successfully."}, status=status.HTTP_200_OK)
            else:
                # If the user has liked the post, remove the like first
                like = Like.objects.filter(user=request.user, post=post).first()
                if like:
                    like.delete()
                    post.total_likes -= 1

                # Dislike the post
                Dislike.objects.create(user=request.user, post=post)
                post.total_dislikes += 1
                post.save()
                return Response({"message": "Post disliked successfully."}, status=status.HTTP_201_CREATED)
        except Post.DoesNotExist:
            return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

class UndislikePostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
            dislike = Dislike.objects.filter(user=request.user, post=post).first()
            if dislike:
                dislike.delete()
                post.total_dislikes -= 1
                post.save()
                return Response({"message": "Post undisliked successfully."}, status=status.HTTP_200_OK)
            return Response({"error": "You have not disliked this post."}, status=status.HTTP_400_BAD_REQUEST)
        except Post.DoesNotExist:
            return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

# Comment Views
class CommentCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
            data = request.data.copy()
            data['post'] = post.id
            serializer = CommentSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save(user=request.user, post=post)
                post.total_comments += 1
                post.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Post.DoesNotExist:
            return Response({"error": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

class CommentDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, comment_id):
        try:
            comment = Comment.objects.get(id=comment_id)
            if comment.user == request.user:
                comment.post.total_comments -= 1
                comment.post.save()
                comment.delete()
                return Response({"message": "Comment deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
            return Response({"error": "You do not have permission to delete this comment."}, status=status.HTTP_403_FORBIDDEN)
        except Comment.DoesNotExist:
            return Response({"error": "Comment not found."}, status=status.HTTP_404_NOT_FOUND)




class DairyDataViewSet(viewsets.ModelViewSet):
    queryset = DairyData.objects.all()
    serializer_class = DairyDataSerializer