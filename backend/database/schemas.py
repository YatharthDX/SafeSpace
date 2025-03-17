from pydantic import BaseModel, EmailStr

# Request schema for user registration
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

# Request schema for user login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class VerifyOTP(BaseModel):
    email: EmailStr
    otp: str
    username: str
    password: str

# Response schema for user profile
class UserResponse(BaseModel):
    username: str
    email: EmailStr

    class Config:
        from_attributes = True  # Allows ORM mode for MongoDB

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    new_password: str
