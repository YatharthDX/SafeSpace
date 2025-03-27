from fastapi import APIRouter, Response, UploadFile, File, Request, Depends
from database.models import NameOnly, EmailRequest, OTPVerification, UserRegistration, PasswordReset, LoginRequest, AvatarRequest
from utils.jwt import get_current_user
from services.auth_service import get_avatar_service, change_avatar_service, logout_service, send_otp_service, verify_otp_service, register_user_service, reset_password_service, login_service, get_user_details_service
import base64
from database.connection import users_collection
from services.auth_service import get_current_user_service



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

@router.get("/get-profile-picture/{username}")
async def get_profile_picture(username: str):
    user = users_collection.find_one({"name": username})
    
    if not user or "profile_picture" not in user:
        return {"message": "No profile picture found"}
    
    image_data = base64.b64decode(user["profile_picture"])

    return Response(content=image_data, media_type="image/jpeg")

@router.get("/me")
async def get_current_user_new(request: Request):
    return get_current_user_service(request)

@router.get("/getuserdetails")
async def get_user_details(current_user: dict = Depends(get_current_user)):
    return get_user_details_service(current_user)

@router.post("/logout")
async def logout_user(response: Response):
    return logout_service(response)

@router.post("/change-avatar")
async def change_avatar(request: AvatarRequest, current_user: dict = Depends(get_current_user)):
    return change_avatar_service(request.avatar, current_user)

@router.get("/get-avatar/")
async def get_avatar(id: str, current_user: dict = Depends(get_current_user)):
    return get_avatar_service(id, current_user)