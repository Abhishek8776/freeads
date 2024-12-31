from rest_framework import serializers
from django.contrib.auth import authenticate
from django.core.cache import cache
from .models import CustomUser



class RegisterSerializer(serializers.ModelSerializer):
    otp = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = CustomUser
        fields = ['id', 'name', 'mobile', 'email', 'password', 'otp']
        extra_kwargs = {
            'name': {'required': True},
            'mobile': {'required': True},
            'email': {'required': False},
            'password': {'required': True},
            'otp' : {'required': True},
        }

    def validate(self, data):
        if CustomUser.objects.filter(mobile=data['mobile']).exists():
            raise serializers.ValidationError({"mobile": "Mobile number already registered."})
        if CustomUser.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Email already registered."})
        cached_otp = cache.get(f"otp_{data['mobile']}")        
        print(f"Cached OTP: {cached_otp}, Provided OTP: {data['otp']}")
        if cached_otp is None:
            raise serializers.ValidationError({"otp": "OTP expired or not found."})
        if str(cached_otp) != str(data['otp']):
            raise serializers.ValidationError({"otp": "Invalid OTP."})
        return data

    def create(self, validated_data):
        validated_data.pop('otp', None)
        return CustomUser.objects.create_user(
            name=validated_data['name'],
            mobile=validated_data['mobile'],
            email=validated_data['email'],
            password=validated_data['password']
        )



class LoginSerializer(serializers.ModelSerializer):
    mobile = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    class Meta:
        model = CustomUser
        fields = ['mobile', 'password']
    def validate(self, data):
        mobile = data.get('mobile')
        password = data.get('password')
        try:
            user = CustomUser.objects.get(mobile=mobile)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError({"mobile":"Invalid mobile or password."})
        if not user.check_password(password):
            raise serializers.ValidationError({"password":"Invalid mobile or password."})
        if not user.is_active:
            raise serializers.ValidationError({"mobile":"This account is inactive."})
        return user
