from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.core.cache import cache
from .serializers import *
from .utils import send_otp
import random
    
# class RegisterView(APIView):
#     def post(self, request):
#         serializer = RegisterSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SendOTPView(APIView):
    def post(self, request):
        phone_number = request.data.get('mobile')
        if not phone_number:
            return Response({"error": "Phone number is required."}, status=status.HTTP_400_BAD_REQUEST)
        otp = random.randint(100000, 999999)
        cache.set(f"otp_{phone_number}", otp, timeout=300)
        print(f"Phone Number: {phone_number}, OTP: {otp}")
        send_otp(phone_number, otp)
        return Response({"message": "OTP sent successfully to your phone."}, status=status.HTTP_200_OK)


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):

        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            response = Response({"name": user.name,"email": user.email,"access_token": str(refresh.access_token),"refresh_token": str(refresh)}, status=status.HTTP_200_OK)
            response.set_cookie(key='refresh_token',value=str(refresh),httponly=True,secure=True,samesite='Lax')
            response.set_cookie(key='access_token',value=str(refresh.access_token),httponly=True,secure=True,samesite='Lax')
            return response
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
        response.delete_cookie('refresh_token')
        response.delete_cookie('access_token')
        return response
    
class IsLoggedInView(APIView):
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return Response({"loggedIn": True,"username": request.user.name}, status=status.HTTP_200_OK)
        return Response({"loggedIn": False,"error": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)

    # def post(self, request):
    #     try:
    #         refresh_token = request.data.get("refresh")
    #         token = RefreshToken(refresh_token)
    #         token.blacklist()
    #         return Response({"message": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
    #     except Exception as e:
    #         return Response({"error": "Invalid or missing refresh token."}, status=status.HTTP_400_BAD_REQUEST)