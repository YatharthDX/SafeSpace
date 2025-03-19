from fastapi import APIRouter
from database.models import EmailRequest, OTPVerification, UserRegistration, PasswordReset, LoginRequest
from services.auth_service import send_otp_service, verify_otp_service, register_user_service, reset_password_service, login_service

router = APIRouter()

@router.post("/send-otp")
async def send_otp(request: EmailRequest):
    return send_otp_service(request)

@router.post("/verify-otp")
async def verify_otp(request: OTPVerification):
    return verify_otp_service(request)

@router.post("/register")
async def register_user(user: UserRegistration):
    return register_user_service(user)

@router.post("/reset-password")
async def reset_password(request: PasswordReset):
    return reset_password_service(request)

@router.post("/login")
async def login(request: LoginRequest):
    return login_service(request)