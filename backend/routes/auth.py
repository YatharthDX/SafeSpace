# from fastapi import APIRouter, Response, UploadFile, File
from fastapi import APIRouter, Response, UploadFile, File, Depends
from database.models import EmailRequest, OTPVerification, UserRegistration, PasswordReset, LoginRequest
# from services.auth_service import send_otp_service, verify_otp_service, register_user_service, reset_password_service, login_service
from services.auth_service import send_otp_service, verify_otp_service, register_user_service, reset_password_service, login_service, get_user_details_service
from middleware.auth_middleware import get_current_user
import base64
from database.connection import users_collection


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
async def login(request: LoginRequest, response: Response):
    return login_service(request, response)

@router.post("/upload-profile-picture/")
async def upload_profile_picture(username: str, file: UploadFile = File(...)):
    image_data = await file.read()
    encoded_image = base64.b64encode(image_data).decode("utf-8")

    users_collection.update_one({"name": username}, {"$set": {"profile_picture": encoded_image}}, upsert=True)
    return {"message": "Profile picture uploaded successfully"}

# @router.get("/get-profile-picture/{username}")
# async def get_profile_picture(username: str):
#     user = users_collection.find_one({"name": username})
    
#     if not user or "profile_picture" not in user:
#         return {"message": "No profile picture found"}
    
#     image_data = base64.b64decode(user["profile_picture"])

#     return Response(content=image_data, media_type="image/jpeg")

@router.get("/getuserdetails")
async def get_user_details(current_user: dict = Depends(get_current_user)):
    return get_user_details_service(current_user)
