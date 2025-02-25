from django.db import models

class PlantAnalysis(models.Model):
    image = models.ImageField(upload_to='plant_images/')
    disease = models.CharField(max_length=200)
    severity = models.CharField(max_length=50)
    recommendations = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)