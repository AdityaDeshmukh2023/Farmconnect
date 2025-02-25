from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError

class UserManager(BaseUserManager):
    def create_user(self, email, name, tc, password=None, password2=None):
        """
        Creates and saves a User with the given email, name, tc, and password.
        """
        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(
            email=self.normalize_email(email),
            name=name,
            tc=tc,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, tc, password=None):
        """
        Creates and saves a superuser with the given email, name, tc, and password.
        """
        user = self.create_user(
            email,
            password=password,
            name=name,
            tc=tc,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    email = models.EmailField(
        verbose_name="email",
        max_length=255,
        unique=True,
    )
    name = models.CharField(max_length=200)
    tc = models.BooleanField()
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "tc"]

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        return self.is_admin


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile", primary_key=True)
    name = models.CharField(max_length=200)
    age = models.PositiveSmallIntegerField(null=True, blank=True)
    contact = models.CharField(max_length=10)
    location = models.CharField(max_length=255)

    # Farm Details
    land_size = models.CharField(max_length=200, null=True, blank=True)
    land_type = models.CharField(max_length=50, choices=[
        ("irrigated", "Irrigated"),
        ("rainfed", "Rainfed"),
        ("dry", "Dry"),
    ])
    crops = models.TextField(blank=True, null=True)
    livestock = models.TextField(blank=True, null=True)

    # Farming Practices
    fertilizers = models.TextField(blank=True, null=True)
    pesticides = models.TextField(blank=True, null=True)
    irrigation = models.CharField(max_length=50, choices=[
        ("sprinkler", "Sprinkler"),
        ("drip", "Drip"),
        ("manual", "Manual"),
        ("flood", "Flood"),
    ])
    seed_brand = models.CharField(max_length=200, blank=True, null=True)
    annual_crops = models.CharField(max_length=200, null=True, blank=True)

    # Profile Picture
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

    # Followers and Following
    followers = models.ManyToManyField(User, related_name="following_profiles", blank=True)
    following = models.ManyToManyField(User, related_name="follower_profiles", blank=True)

    def __str__(self):
        return f"Profile of {self.user.name}"

    # Property to get the number of posts
    @property
    def post_count(self):
        return self.user.posts.count()  # Assuming the related_name in the Post model is 'posts'


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    description = models.TextField()
    photo = models.FileField(upload_to='posts/', blank=True, null=True)  # For image or video posts
    date = models.DateTimeField(auto_now_add=True)
    total_likes = models.IntegerField(default=0)  # Total likes count
    total_dislikes = models.IntegerField(default=0)  # Total dislikes count
    total_comments = models.IntegerField(default=0)  # Total comments count

    def __str__(self):
        return f"Post by {self.user.name} on {self.date}"

    @property
    def username(self):
        """Returns the username (name) of the user who created the post."""
        return self.user.name

    @property
    def profile_picture(self):
        """Returns the profile picture URL of the user who created the post."""
        return self.user.profile.profile_picture.url if self.user.profile.profile_picture else None


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    liked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')  # Ensure a user can like a post only once

    def clean(self):
        # Check if the user has already disliked this post
        if Dislike.objects.filter(user=self.user, post=self.post).exists():
            raise ValidationError("You cannot like a post you have already disliked.")

    def save(self, *args, **kwargs):
        self.full_clean()  # Run validation before saving
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.name} liked Post {self.post.id}"


class Dislike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='dislikes')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='dislikes')
    disliked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')  # Ensure a user can dislike a post only once

    def clean(self):
        # Check if the user has already liked this post
        if Like.objects.filter(user=self.user, post=self.post).exists():
            raise ValidationError("You cannot dislike a post you have already liked.")

    def save(self, *args, **kwargs):
        self.full_clean()  # Run validation before saving
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.name} disliked Post {self.post.id}"


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    comment_text = models.TextField()
    commented_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} commented on Post {self.post.id}"


class DairyData(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    images = models.JSONField()  # Store images as a list of strings

    def __str__(self):
        return self.title


class ExtraContent(models.Model):
    dairy_data = models.ForeignKey(DairyData, related_name='extra_content', on_delete=models.CASCADE)
    heading = models.CharField(max_length=255)
    details = models.TextField()

    def __str__(self):
        return self.heading