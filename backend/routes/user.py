from fastapi import APIRouter, Depends, HTTPException
from database.connection import users_collection
from utils.jwt import decode_access_token

user = APIRouter()

def get_current_user(token: str = Depends(decode_access_token)):
    if not token:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return token["sub"]  # Return email

@user.get("/profile")
async def get_profile(email: str = Depends(get_current_user)):
    user_data = users_collection.find_one({"email": email}, {"_id": 0, "password": 0})
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data
