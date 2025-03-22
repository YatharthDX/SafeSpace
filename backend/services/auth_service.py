from database.connection import users_collection, redis_client
from database.models import EmailRequest, OTPVerification, UserRegistration, PasswordReset, LoginRequest
from utils.otp import generate_otp, send_email
from utils.hash import pwd_context
from utils.jwt import create_access_token
from utils.config import OTP_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM
from fastapi import HTTPException, Response, Request
import logging
from datetime import datetime
import jwt

logger = logging.getLogger(__name__)

def send_otp_service(request: EmailRequest):
    if users_collection is None or redis_client is None:
        raise HTTPException(status_code=503, detail="Service unavailable")
    if request.requestType == "signup":
        if users_collection.find_one({"email": request.email}):
            # return {"success": False, "message": "Email is already registered"}
            raise HTTPException(status_code=400, detail="Email is already registered")
    elif request.requestType == "forgot":
        if not users_collection.find_one({"email": request.email}):
            # return {"success": False, "message": "User not found"}
            raise HTTPException(status_code=404, detail="User not found")
    otp = generate_otp()
    redis_key = f"otp:{request.email}:{request.requestType}"
    redis_client.setex(redis_key, OTP_EXPIRE_MINUTES * 60, otp)
    subject = "OTP for IITK Portal"
    body = f"Your OTP for {request.requestType.upper()} is: {otp}\n\nThis OTP is valid for {OTP_EXPIRE_MINUTES} minutes."
    if not send_email(request.email, subject, body):
        # return {"success": False, "message": "Failed to send OTP"}
        raise HTTPException(status_code=500, detail="Failed to send OTP")
    logger.debug(f"OTP for {request.email}: {otp}")
    return {"success": True, "message": "OTP sent successfully"}

def verify_otp_service(request: OTPVerification):
    if redis_client is None:
        raise HTTPException(status_code=503, detail="Service unavailable")
    redis_key = f"otp:{request.email}:{request.requestType}"
    stored_otp = redis_client.get(redis_key)
    if not stored_otp or request.otp != stored_otp.decode('utf-8'):
        # return {"success": False, "message": "Invalid or expired OTP"}
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    redis_client.delete(redis_key)
    verification_key = f"verified:{request.email}:{request.requestType}"
    redis_client.setex(verification_key, 10 * 60, "1")
    return {"success": True, "message": "OTP verified successfully"}

def register_user_service(user: UserRegistration):
    if users_collection is None or redis_client is None:
        raise HTTPException(status_code=503, detail="Service unavailable")
    verification_key = f"verified:{user.email}:signup"
    if not redis_client.get(verification_key):
        logger.warning("Email not verified, proceeding for testing")
    if users_collection.find_one({"email": user.email}):
        # return {"success": False, "message": "User already exists"}
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_password = pwd_context.hash(user.password)
    new_user = {
        "email": user.email,
        "password": hashed_password,
        "name": user.name,
        "role": "student",
        "created_at": datetime.utcnow()
    }
    users_collection.insert_one(new_user)
    redis_client.delete(verification_key)
    return {"success": True, "message": "User registered successfully"}

def reset_password_service(request: PasswordReset):
    if users_collection is None or redis_client is None:
        raise HTTPException(status_code=503, detail="Service unavailable")
    verification_key = f"verified:{request.email}:forgot"
    if not redis_client.get(verification_key):
        logger.warning("Email not verified, proceeding for testing")
    user = users_collection.find_one({"email": request.email})
    if not user:
        # return {"success": False, "message": "User not found"}
        raise HTTPException(status_code=404, detail="User not found")
    hashed_password = pwd_context.hash(request.password)
    users_collection.update_one(
        {"email": request.email},
        {"$set": {"password": hashed_password, "updated_at": datetime.utcnow()}}
    )
    redis_client.delete(verification_key)
    return {"success": True, "message": "Password reset successfully"}

def login_service(request: LoginRequest, response: Response):
    if users_collection is None:
        raise HTTPException(status_code=503, detail="Service unavailable")
    user = users_collection.find_one({"email": request.email})
    if not user or not pwd_context.verify(request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    role = user.get("role", "student")
    token_data = {"sub": request.email, "role": role}
    access_token = create_access_token(token_data)
    response.set_cookie(
        key="jwt",
        value=access_token,
        httponly=True,  
        secure=False,  # Change to True in production (HTTPS required)     
        samesite="Lax"   
    )
    return {"success": True, "access_token": access_token, "token_type": "bearer"}

def get_current_user_service(request: Request):
    if users_collection is None:
        raise HTTPException(status_code=503, detail="Service unavailable")
    
    # Get the JWT token from cookies
    jwt_token = request.cookies.get("jwt")
    # print("here",jwt_token)
    if not jwt_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        # Decode the JWT token
        payload = jwt.decode(jwt_token, options={"verify_signature": False})
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get user from database
        user = users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Remove sensitive information
        user["_id"] = str(user["_id"])
        user.pop("password", None)
        # user.pop("_id", None)  # Convert ObjectId to string
        
        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        logger.error(f"Error in get_current_user_service: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

def get_user_details_service(current_user: dict):
    if users_collection is None:
        raise HTTPException(status_code=503, detail="Service unavailable")
    
    user = users_collection.find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_details = {
        "username": user.get("name"),
        "profile_picture": user.get("profile_picture")
    }
    
    return user_details

