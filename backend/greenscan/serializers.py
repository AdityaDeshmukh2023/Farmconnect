from rest_framework import serializers
from .models import PlantAnalysis

class PlantAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlantAnalysis
        fields = ['id', 'image', 'disease', 'severity', 'recommendations', 'created_at']