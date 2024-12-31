from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import *

from .models import *
from .serializers import *


class CategoryView(APIView):
    def get(self, request, pk=None):
        if pk:
            try:
                category = Category.objects.get(pk=pk)
            except Category.DoesNotExist:
                return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = CategorySerializer(category)
            return Response(serializer.data)
        else:
            categories = Category.objects.all()
            serializer = CategorySerializer(categories, many=True)
            return Response(serializer.data)


class SubcategoryView(APIView):
    def get(self, request, pk=None):
        if pk:
            try:
                subcategory = Subcategory.objects.get(pk=pk)
            except Subcategory.DoesNotExist:
                return Response({"error": "Subcategory not found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = SubcategorySerializer(subcategory)
            return Response(serializer.data)
        else:
            subcategories = Subcategory.objects.all()
            serializer = SubcategorySerializer(subcategories, many=True)
            return Response(serializer.data)


class CountryView(APIView):
    def get(self, request, pk=None):
        if pk:
            try:
                country = Country.objects.get(pk=pk)
            except Country.DoesNotExist:
                return Response({"error": "country not found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = CountrySerializer(country)
            return Response(serializer.data)
        else:
            countries = Country.objects.all()
            serializer = CountrySerializer(countries, many=True)
            return Response(serializer.data)


class StateView(APIView):
    def get(self, request, pk=None):
        if pk:
            try:
                state = State.objects.get(pk=pk)
            except State.DoesNotExist:
                return Response({"error": "State not found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = StateSerializer(state)
            return Response(serializer.data)
        else:
            states = State.objects.all()
            serializer = StateSerializer(states, many=True)
            return Response(serializer.data)   


class AdsView(APIView):

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]
        
    def get(self, request):
        ads = Ads.objects.all()
        serializer = AdsSerializer(ads, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        print(request.data)
        serializer = AdsSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

