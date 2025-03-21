from pydantic import BaseModel, EmailStr, validator, Field
from datetime import datetime
from typing import List, Optional

class EmailRequest(BaseModel):
    email: EmailStr
    requestType: str

    @validator('email')
    def validate_email_domain(cls, v):
        if not v.endswith('@iitk.ac.in'):
            raise ValueError('Only @iitk.ac.in email addresses are allowed')
        return v

    @validator('requestType')
    def validate_request_type(cls, v):
        if v not in ['signup', 'forgot']:
            raise ValueError('Request type must be either "signup" or "forgot"')
        return v

class OTPVerification(BaseModel):
    email: EmailStr
    otp: str
    requestType: str

class UserRegistration(BaseModel):
    email: EmailStr
    password: str
    name: str

class PasswordReset(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class Appointment(BaseModel):
    user_name: str
    user_email: EmailStr
    counselor_email: EmailStr
    date: datetime
    time_slot: str
    description: str
    contact_no: str
    status: str = "pending"

class AvailableSlot(BaseModel):
    counselor_email: EmailStr
    date: datetime
    time_slots: List[str]

class RoleRequest(BaseModel):
    email: str
    
# Blog-related models
class BlogCreate(BaseModel):
    title: str
    content: str
    author: str
    relevance_tags: List[str] = []
    severity_tag: str
    image_url: Optional[str] = None

class Blog(BaseModel):
    id: str = Field(alias="_id")
    title: str
    content: str
    author: str
    relevance_tags: List[str] = []
    severity_tag: str
    image_url: Optional[str] = None
    likes: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "60d21b4967d0d8992e610c85",
                "title": "My Experience",
                "content": "This is my story...",
                "author": "John Doe",
                "relevance_tags": ["anxiety", "depression", "support"],
                "severity_tag": "moderate",
                "image_url": "/uploads/image.jpg",
                "likes": 10,
                "created_at": "2021-06-22T19:40:09.603Z",
                "updated_at": "2021-06-22T19:40:09.603Z"
            }
        }

class CommentCreate(BaseModel):
    content: str
    author: str

class Comment(BaseModel):
    id: str = Field(alias="_id")
    blog_id: str
    content: str
    author: str
    created_at: datetime

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "60d21b4967d0d8992e610c86",
                "blog_id": "60d21b4967d0d8992e610c85",
                "content": "Thank you for sharing your story",
                "author": "Jane Smith",
                "created_at": "2021-06-22T19:40:09.603Z"
            }
        }

class LikesUpdate(BaseModel):
    likes: int