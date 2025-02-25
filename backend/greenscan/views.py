from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import google.generativeai as genai
from django.conf import settings
import base64
from PIL import Image
import io

@api_view(['POST'])
def analyze_plant(request):
    if 'image' not in request.FILES:
        return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Configure Gemini
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-pro')
        
        # Process the image
        image = request.FILES['image']
        img = Image.open(image)
        
        if img.mode != 'RGB':
            img = img.convert('RGB')
            
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='JPEG')
        img_bytes = img_byte_arr.getvalue()
        
        # Create structured prompt
        prompt = """Analyze this plant image and provide information in the following format:
        {
            "disease": "name of disease or 'No disease detected'",
            "severity": "Low/Medium/High",
            "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
        }
        Provide only the JSON response without any additional text."""

        # Generate response
        response = model.generate_content([
            prompt,
            {"mime_type": "image/jpeg", "data": img_bytes}
        ])

        # Clean and parse response
        try:
            clean_response = response.text.replace('```json', '').replace('```', '').strip()
            import json
            parsed_response = json.loads(clean_response)
            
            # Ensure all required fields exist
            default_response = {
                "disease": "Unknown",
                "severity": "Unknown",
                "recommendations": ["No specific recommendations available"]
            }
            
            parsed_response = {
                "disease": parsed_response.get("disease", default_response["disease"]),
                "severity": parsed_response.get("severity", default_response["severity"]),
                "recommendations": parsed_response.get("recommendations", default_response["recommendations"])
            }
            
            return Response({"analysis": parsed_response})
            
        except json.JSONDecodeError as e:
            print(f"JSON Parse Error: {e}")
            print(f"Raw Response: {response.text}")
            return Response({
                "analysis": {
                    "disease": "Analysis Error",
                    "severity": "Unknown",
                    "recommendations": ["Unable to analyze image properly. Please try again."]
                }
            })

    except Exception as e:
        print(f"Error: {str(e)}")
        return Response({
            "analysis": {
                "disease": "Error",
                "severity": "Unknown",
                "recommendations": ["An error occurred during analysis. Please try again."]
            }
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)