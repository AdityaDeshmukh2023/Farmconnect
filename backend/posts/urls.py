from django.urls import path
from posts import views

urlpatterns = [
    path('addreel/',views.PostView.as_view(),name='addreel'),
    path('viewreels/',views.PostView.as_view(),name='viewreels')
]