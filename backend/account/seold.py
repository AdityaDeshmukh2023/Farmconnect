from xml.dom import ValidationErr
from rest_framework import serializers
from account.models import User,Profile,DairyData, ExtraContent, Post,Like,Dislike,Comment
from django.utils.encoding import smart_str,force_bytes,DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from account.utils import Util
from drf_extra_fields.fields import Base64ImageField

class UserRegitartionSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type' :'password'},write_only = True )
    class Meta :
        model = User
        fields = ['email','name','password','password2','tc']
        extra_kwargs = {
            'password' : {'write_only':True}
        }

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if(password!=password2):
            raise serializers.ValidationError('Password and Confirm Password does not match')
        return attrs
    
    def create(self, validate_data):
        return User.objects.create_user(**validate_data)
    


class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        model = User
        fields = ['email','password']


# class UserProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id','email','name']

class ChangeUserPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length = 255,style={'input_type' : 'password'},write_only=True)
    password2 = serializers.CharField(max_length = 255,style={'input_type' : 'password'},write_only=True)

    class Meta :
        fields = ['password','password2']
    
    def validate(self,attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        user = self.context.get('user')
        if password !=password2:
            raise serializers.ValidationError("Password and Confirm Password doesn't match")
        
        user.set_password(password)
        user.save()
        return attrs
        

class SendPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        fields = ['email']

    def validate(self, attrs):
        email = attrs.get('email')
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            link = f'http://localhost:3000/api/user/reset/{uid}/{token}'
            print('Password Reset Link:', link)
            # Send the email logic here
            body = f"""
<html>
  <head>
    <style>
      body {{
        font-family: "Arial", sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f7f9;
      }}

      .email-container {{
        width: 100%;
        max-width: 700px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      }}

      .header {{
        text-align: center;
        padding: 40px 20px;
        background-color: #28a745;
        color: white;
        border-radius: 10px 10px 0 0;
      }}

      .header img {{
        max-width: 150px;
        margin-bottom: 20px;
      }}

      .header h2 {{
        font-size: 28px;
        font-weight: 700;
        margin: 0;
      }}

      .content {{
        padding: 30px;
        font-size: 18px;
        color: #333;
        line-height: 1.8;
      }}

      .cta-button {{
        display: inline-block;
        background-color: #007bff;
        color: white;

        text-decoration: none;
        border-radius: 8px;
        font-size: 20px;
        font-weight: bold;
        margin-top: 30px;
        transition: background-color 0.3s ease;
        text-align: center;
        width: 80%;
        margin-left: 10%;
      }}

      .cta-button:hover {{
        background-color: #0056b3;
      }}

      .icons {{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
      }}

      .icon {{
        font-size: 30px;
        color: #007bff;
        transition: color 0.3s ease;
        padding-left : 60px; 
      }}

      .icon:hover {{
        color: #0056b3;
      }}

      .footer {{
        text-align: center;
        font-size: 14px;
        background-color: #28a745;
        color: #ffff;
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #f0f0f0;
      }}

      .footer a {{
        color: #007bff;
        text-decoration: none;
      }}

      .footer p {{
        margin: 5px 0;
      }}

      .footer p a {{
        font-weight: bold;
      }}

      .footer .important {{
        font-size: 12px;
        color: #000000;
      }}

      /* Responsive design */
      @media (max-width: 600px) {{
        .email-container {{
          padding: 20px;
        }}

        .cta-button {{
          width: 100%;
          text-align: center;
        }}

        .icons {{
          flex-direction: column;
        }}

        .icon {{
          margin: 10px 0;
        }}
      }}
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <img
          src="https://media-hosting.imagekit.io//379edd68adef4790/logo.png?Expires=1831304079&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=0mlZ8aAIhYPpjEJZc5reFNO6kRJ22mny~UVHbnJ~Xwm4ME7gcTdHRhn-J3NRKdfHAlInMMam6V6FxlJpr~y12gvnlsOk~CUQNHouYtXXGThYp9W486fsYXfhDtK~Fl~wkrSueg1gEH4UJyKNzk1dlxPHm4VE-M1bXaU0xmkp-1FZe5vRsTyod7abESzydQE6W71b~wpIkTx~h8ds31D6NtJKg7Lj8dIMOHlVh03C7ekM1e63rBewxFa4X8BsLD4qPwP7r9pAzk47gbGDUXcDPu7rD2tL9hJDzOahLYcIg1-tPWIbu9T8ozkIvrDHDwtoZJOfEXa3tVLyUXysvTB9Xw__"
          alt="Farm-Connect Logo"
        />
        <h2>Welcome to Farm-Connect, {user.name}!</h2>
      </div>
      <div class="content">
        <p>
          We received a request to reset your password for your account on
          <strong>Farm-Connect</strong>. No worries, it's easy to get back into
          your account!
        </p>
        <p>To reset your password, simply click the button below:</p>
        <p>
          <a href="{link}" class="cta-button">Click</a>
        </p>
        <div class="icons">
          <a
            href="https://www.instagram.com/farmconnect"
            class="icon"
            target="_blank"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1200px-Instagram_logo_2022.svg.png"
              alt="Instagram"
              width="40"
              class="icon"
              
            />
          </a>
          <a
            href="https://www.facebook.com/farmconnect"
            class="icon"
            target="_blank"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1200px-Facebook_f_logo_%282019%29.svg.png"
              alt="Facebook"
              width="40"
              class="icon"
              
            />
          </a>
          <a
            href="https://twitter.com/farmconnect"
            class="icon"
            target="_blank"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/2491px-Logo_of_Twitter.svg.png"
              alt="Twitter"
              width="40"
              class="icon"
              
            />
          </a>
        </div>
      </div>
      <div class="footer">
        <p>
          If you did not request this email, please ignore it. Your account will
          remain secure.
        </p>
        <p>
          Need help? Reach out to us at
          <a href="mailto:support@farm-connect.com">support@farm-connect.com</a>
        </p>
        <p>&copy; 2025 Farm-Connect. All rights reserved.</p>
        <p><a href="http://www.farm-connect.com">Visit our website</a></p>
        <p class="important">
          This email was sent to you because you signed up on Farm-Connect.
        </p>
      </div>
    </div>
  </body>
</html>


    """
            data = {
                'email_subject' : 'Reset Your Password',
                'body' : body,
                'to_email' : user.email
            }
            Util.send_email(data=data)
            return attrs
        else:
            raise serializers.ValidationError('You are not a Registered User')



class UserPasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(max_length = 255,style={'input_type' : 'password'},write_only=True)
    password2 = serializers.CharField(max_length = 255,style={'input_type' : 'password'},write_only=True)

    class Meta :
        fields = ['password','password2']
    
    def validate(self, attrs):
        try:
            password = attrs.get('password')
            password2 = attrs.get('password2')
            uid = self.context.get('uid')
            token = self.context.get('token')

            if password != password2:
                raise serializers.ValidationError("Password and Confirm Password doesn't match")
            
            # Decode UID
            user_id = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=user_id)

            # Check token validity
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise serializers.ValidationError('Token is not valid or expired')
            
            # Set new password
            user.set_password(password)
            user.save()
            return attrs
        except DjangoUnicodeDecodeError:
            raise serializers.ValidationError('Token is not valid or expired')
          

class UserProfileInputSerializer(serializers.ModelSerializer):
  
    # profile_picture = Base64ImageField()
    class Meta:
        model = Profile
        fields = [
            'name', 'age','contact', 'location', 'land_size','land_type', 
            'crops', 'livestock', 'fertilizers', 'pesticides', 'irrigation', 
            'seed_brand','annual_crops','profile_picture'
        ]
        
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'name', 'contact', 'location',
            'land_type', 'crops', 'livestock', 'fertilizers', 'pesticides', 
            'irrigation', 'seed_brand', 'profile_picture'
        ]

class ExtraContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtraContent
        fields = ['heading', 'details']

class DairyDataSerializer(serializers.ModelSerializer):
    extra_content = ExtraContentSerializer(many=True, read_only=True)

    class Meta:
        model = DairyData
        fields = ['id', 'title', 'description', 'images', 'extra_content']
        

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'user', 'description', 'photo', 'date', 'total_likes', 'total_dislikes', 'total_comments']
        read_only_fields = ['id', 'date', 'user', 'total_likes', 'total_dislikes', 'total_comments']

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'post', 'liked_at']
        read_only_fields = ['id', 'user', 'liked_at']

class DislikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dislike
        fields = ['id', 'user', 'post', 'disliked_at']
        read_only_fields = ['id', 'user', 'disliked_at']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'user', 'post', 'comment_text', 'commented_at']
        read_only_fields = ['id', 'user', 'post','commented_at']