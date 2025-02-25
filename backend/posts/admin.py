from django.contrib import admin
from posts.models import Posts
# Register your models here.
@admin.register(Posts)
class PostModelAdmin(admin.ModelAdmin):
    list_display = ['email','desc','title','rdoc']

