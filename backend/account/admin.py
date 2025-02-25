from django.contrib import admin
from account.models import User, Profile, Post, Like, Dislike, Comment, DairyData, ExtraContent
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


class UserModelAdmin(BaseUserAdmin):
    # The fields to be used in displaying the User model.
    list_display = ["id", "email", "name", "tc", "is_admin", "is_active", "created_at", "updated_at"]
    list_filter = ["is_admin", "is_active"]
    fieldsets = [
        ("User Credentials", {"fields": ["email", "password"]}),
        ("Personal Info", {"fields": ["name", "tc"]}),
        ("Permissions", {"fields": ["is_admin", "is_active"]}),
        ("Timestamps", {"fields": ["created_at", "updated_at"]}),
    ]
    # add_fieldsets is used when creating a user in the admin interface.
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["email", "name", "tc", "password1", "password2"],
            },
        ),
    ]
    search_fields = ["email", "name"]
    ordering = ["email", "id"]
    readonly_fields = ["created_at", "updated_at"]  # Make timestamps read-only
    filter_horizontal = []


# Register the custom User model with the custom UserModelAdmin
admin.site.register(User, UserModelAdmin)


class ProfileAdmin(admin.ModelAdmin):
    list_display = [
        "user", "name", "age", "contact", "location", "land_size", "land_type",
        "crops", "livestock", "fertilizers", "pesticides", "irrigation",
        "seed_brand", "annual_crops", "profile_picture"
    ]
    list_filter = ["land_type", "irrigation"]
    search_fields = ["user__email", "name", "contact", "location"]
    # readonly_fields = ["user"]  # Make the user field read-only


# Register the Profile model with the custom ProfileAdmin
admin.site.register(Profile, ProfileAdmin)


class PostAdmin(admin.ModelAdmin):
    list_display = [
        "id", "user", "description", "date", "total_likes", "total_dislikes", "total_comments"
    ]
    list_filter = ["date", "user"]
    search_fields = ["user__email", "description"]
    readonly_fields = ["date"]  # Make the date field read-only


# Register the Post model with the custom PostAdmin
admin.site.register(Post, PostAdmin)


class LikeAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "post", "liked_at"]
    list_filter = ["liked_at", "user"]
    search_fields = ["user_email", "post_description"]
    readonly_fields = ["liked_at"]  # Make the liked_at field read-only


# Register the Like model with the custom LikeAdmin
admin.site.register(Like, LikeAdmin)


class DislikeAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "post", "disliked_at"]
    list_filter = ["disliked_at", "user"]
    search_fields = ["user_email", "post_description"]
    readonly_fields = ["disliked_at"]  # Make the disliked_at field read-only


# Register the Dislike model with the custom DislikeAdmin
admin.site.register(Dislike, DislikeAdmin)


class CommentAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "post", "commented_at"]
    list_filter = ["commented_at", "user"]
    search_fields = ["user_email", "post_description", "comment_text"]
    readonly_fields = ["commented_at"]  # Make the commented_at field read-only


# Register the Comment model with the custom CommentAdmin
admin.site.register(Comment, CommentAdmin)


class ExtraContentInline(admin.TabularInline):
    model = ExtraContent
    extra = 1  # Number of empty forms to display


class DairyDataAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "description"]
    search_fields = ["title", "description"]
    inlines = [ExtraContentInline]  # Add inline editing for ExtraContent


# Register the DairyData model with the custom DairyDataAdmin
admin.site.register(DairyData, DairyDataAdmin)