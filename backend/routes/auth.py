from fastapi import APIRouter, HTTPException, Depends
from models.user import User
from config.db import users_collection, otp_collection, conn
from schemas.user import UserCreate, VerifyOTP, ForgotPasswordRequest, ResetPasswordRequest
from datetime import datetime, timezone
from utils.hash import hash_password, verify_password
from utils.otp import generate_otp, send_otp_email, store_otp, verify_otp
from utils.jwt import create_access_token

auth = APIRouter()

@auth.post("/register")
async def register(user: User):
    
    allowed_domain = "iitk.ac.in"
    # Extract domain from email
    domain = user.email.split("@")[-1]
    if domain != allowed_domain:
        raise HTTPException(status_code=400, detail="Only IITK email ID is allowed")

    existing_user = users_collection.find_one({"email": user.email })
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # user.password = hash_password(user.password)
    # users_collection.insert_one(user.dict())
    # return {"message": "User registered successfully"}
    otp = generate_otp()
    send_otp_email(user.email, otp)
    store_otp(user.email, otp)

    return {"message": "OTP sent to email"}

@auth.post("/verify-otp-registration")
async def verify_otp_registration(data: VerifyOTP):
    if not verify_otp(data.email, data.otp):  # ✅ Now checking OTP expiry
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")


    users_collection.insert_one({
        "username": data.username,
        "email": data.email,
        "password": hash_password(data.password)
    })
    
    return {"message": "User registered successfully"}

# 📌 1. Send OTP to user's email
@auth.post("/forgot-password/")
async def forgot_password(request: ForgotPasswordRequest):
    db_user = users_collection.find_one({"email": request.email})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    otp = generate_otp()
    send_otp_email(request.email, otp)
    store_otp(request.email, otp) 
    
    return {"message": "OTP sent to your email"}


# 📌 2. Verify OTP
@auth.post("/verify-otp-forgot-pass/")
async def verify_otp_forgot_pass(data: VerifyOTP):
    if not verify_otp(data.email, data.otp):  # ✅ Now checking OTP expiry
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    return {"message": "OTP verified successfully"}

# 📌 3. Reset Password
@auth.post("/reset-password/")
async def reset_password(request: ResetPasswordRequest):
    user = conn.local.user.find_one({"email": request.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    hashed_password = hash_password(request.new_password)
    conn.local.user.update_one({"email": request.email}, {"$set": {"hashed_password": hashed_password}})
    
    return {"message": "Password reset successfully"}

@auth.post("/login")
async def login(user: User):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": db_user["email"]})
    response.set_cookie(
        key="jwt",
        value=token,
        httponly=True,  
        secure=True,     
        samesite="Lax"   
    )
    return {"message":"Login Successful"}
