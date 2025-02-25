from django.db import models


class Posts(models.Model):
    title = models.CharField(max_length=100)
    email= models.EmailField()
   
 
    desc = models.CharField(max_length=100)

    rdoc = models.FileField(upload_to='rdocs',blank=True)
