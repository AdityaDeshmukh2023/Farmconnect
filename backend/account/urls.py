from django.urls import path
from account.views import (
    UserRegistrationView, UserLoginView, UserProfileView, UserChangePasswordView,
    SendPasswordResetEmailView, UserPasswordResetView, UserProfileInputView,
    PostListCreateView, PostDetailView, LikePostView, UnlikePostView,
    DislikePostView, UndislikePostView, CommentCreateView, CommentDeleteView,
    ProfileFollowersFollowingView, FollowUserView, UnfollowUserView,
    FollowingListView, FollowersListView
)

urlpatterns = [
    # Authentication URLs
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('profile-input/', UserProfileInputView.as_view(), name='profile-input'),
    path('changepassword/', UserChangePasswordView.as_view(), name='changepassword'),
    path('send-reset-password-email/', SendPasswordResetEmailView.as_view(), name='send-reset-password-email'),
    path('reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password'),

    # Post URLs
    path('posts/', PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),

    # Like URLs
    path('posts/<int:post_id>/like/', LikePostView.as_view(), name='like-post'),
    path('posts/<int:post_id>/unlike/', UnlikePostView.as_view(), name='unlike-post'),

    # Dislike URLs
    path('posts/<int:post_id>/dislike/', DislikePostView.as_view(), name='dislike-post'),
    path('posts/<int:post_id>/undislike/', UndislikePostView.as_view(), name='undislike-post'),

    # Comment URLs
    path('posts/<int:post_id>/comment/', CommentCreateView.as_view(), name='comment-create'),
    path('comments/<int:comment_id>/', CommentDeleteView.as_view(), name='comment-delete'),

    # Follow/Unfollow URLs
    path('follow/<int:user_id>/', FollowUserView.as_view(), name='follow-user'),
    path('unfollow/<int:user_id>/', UnfollowUserView.as_view(), name='unfollow-user'),

    # Followers/Following URLs
    path('following/', FollowingListView.as_view(), name='following-list'),
    path('followers/', FollowersListView.as_view(), name='followers-list'),

    # Profile Followers/Following URLs
    path('profile/<int:profile_id>/followers/', ProfileFollowersFollowingView.as_view(), name='profile-followers'),
    path('profile/<int:profile_id>/following/', ProfileFollowersFollowingView.as_view(), name='profile-following'),
]