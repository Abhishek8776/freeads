from twilio.rest import Client
import os


def send_otp(phone_number, otp):
    account_sid = os.getenv('account_sid')
    auth_token = os.getenv('auth_token')
    client = Client(account_sid, auth_token)
    message = client.messages.create(
        from_='+16282144891',
        body=f'Your OTP is {otp}',
        to=phone_number
    )
    print(message.sid)