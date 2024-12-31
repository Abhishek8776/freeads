from rest_framework import serializers
from .models import *




class StateSerializer(serializers.ModelSerializer):
    country_name = serializers.CharField(source='country.name', read_only=True)
    class Meta:
        model = State
        fields = ['id', 'name', 'country_name', 'created_at', 'updated_at']

class CountrySerializer(serializers.ModelSerializer):
    states = StateSerializer(many=True, read_only=True)
    class Meta:
        model = Category
        fields = ['id', 'name', 'states', 'created_at', 'updated_at']

class SubcategorySerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    class Meta:
        model = Subcategory
        fields = ['id', 'name', 'category_name', 'created_at', 'updated_at']


class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubcategorySerializer(many=True, read_only=True)
    class Meta:
        model = Category
        fields = ['id', 'name', 'subcategories', 'created_at', 'updated_at']



class AdsImagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdsImages
        fields = ['id', 'url']


class AdsSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    subcategory_name = serializers.CharField(source='subcategory.name', read_only=True)
    country_name = serializers.CharField(source='Country.name', read_only=True)
    state_name = serializers.CharField(source='State.name', read_only=True)
    ads_images = AdsImagesSerializer(many=True, write_only=True)
    class Meta:
        model = Ads
        fields = ['id', 'category', 'category_name','subcategory', 'subcategory_name', 'Country','country_name','State' ,'state_name', 'duration', 'caption', 'details', 'contact_details','cost', 'ads_images','is_featured']
        extra_kwargs = {
            'category': {'required': True},
            'subcategory': {'required': True},
            'Country': {'required': True},
            'State': {'required': True},
            'duration': {'required': True},
            'caption': {'required': True},
            'details': {'required': True},
            'contact_details': {'required': True},
            'cost': {'required': True}
        }

    def create(self, validated_data):
        ads_images_data = validated_data.pop('ads_images', [])
        user = self.context['request'].user
        ads = Ads.objects.create(user=user, **validated_data)
        AdsImages.objects.bulk_create(
            [AdsImages(Ad=ads, **image_data) for image_data in ads_images_data]
        )
        return ads

