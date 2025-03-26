from pydantic import BaseModel, EmailStr, validator, Field, field_serializer, ConfigDict
from typing import List, Optional, Any
from bson import ObjectId
from pydantic_core import core_schema
from datetime import datetime


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

class AvatarRequest(BaseModel):
    avatar: str

# Appointments

class Appointment(BaseModel):
    user_name: str
    user_email: EmailStr
    counselor_email: EmailStr
    date: datetime
    time_slot: str
    description: str
    contact_no: str
    status: str

class AvailableSlot(BaseModel):
    counselor_email: EmailStr
    date: datetime
    time_slots: List[str]

class RoleRequest(BaseModel):
    email: str
    
# search post


# PyObjectId for handling MongoDB ObjectId with Pydantic v2
class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, _source_type: Any, _handler: Any
    ) -> core_schema.CoreSchema:
        return core_schema.no_info_plain_validator_function(cls.validate)
    
    @classmethod
    def validate(cls, value: Any) -> ObjectId:
        """Ensure the value is a valid ObjectId."""
        if not isinstance(value, ObjectId):
            try:
                return ObjectId(value)
            except Exception:
                raise ValueError("Invalid ObjectId format")
        return value

class Post(BaseModel):
    """Database post model"""
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
    
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    title: str
    content: str
    relevant_tags: List[str]
    
    @field_serializer('id')
    def serialize_id(self, id: PyObjectId) -> str:
        return str(id)
    
    def dict(self, *args, **kwargs):
        """Compatibility method for Pydantic v2"""
        return self.model_dump(*args, **kwargs)

class PostResponse(BaseModel):
    """API response model for posts, including tag match count for sorting"""
    id: str
    title: str
    content: str
    relevant_tags: List[str]
    tag_match_count: Optional[float] = 0  

class PostSearch(BaseModel):
    """Search query model"""
    text: str = ""
    tags: List[str] = Field(default_factory=list) # Default to empty list


# Blog-related models
class BlogCreate(BaseModel):
    title: str
    content: str
    author: str
    author_id: str
    relevance_tags: List[str] = []
    severity_tag: str
    image: Optional[str] = None

class ClassifyRequest(BaseModel):
    text: str

class Blog(BaseModel):
    id: str = Field(alias="_id")
    title: str
    content: str
    author: str
    author_id: str
    relevance_tags: List[str] = []
    severity_tag: str
    image: Optional[str] = None
    likes: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = {
        "populate_by_name": True,
        "json_schema_extra": {
            "example": {
                "_id": "60d21b4967d0d8992e610c85",
                "title": "My Experience",
                "content": "This is my story...",
                "author": "John Doe",
                "relevance_tags": ["anxiety", "depression", "support"],
                "severity_tag": "moderate",
                "image": "/uploads/image.jpg",
                "likes": 10,
                "created_at": "2021-06-22T19:40:09.603Z",
                "updated_at": "2021-06-22T19:40:09.603Z"
            }
        }
    }

class CommentCreate(BaseModel):
    content: str
    author: str
    author_id: str

class Comment(BaseModel):
    id: str = Field(alias="_id")
    blog_id: str
    content: str
    author: str
    author_id: str
    created_at: datetime

    model_config = {
        "populate_by_name": True,
        "json_schema_extra": {
            "example": {
                "_id": "60d21b4967d0d8992e610c86",
                "blog_id": "60d21b4967d0d8992e610c85",
                "content": "Thank you for sharing your story",
                "author": "Jane Smith",
                "author_id": "60d21b4967d0d8992e610c85",
                "created_at": "2021-06-22T19:40:09.603Z"
            }
        }
    }


class LikesUpdate(BaseModel):
    likes: int

class SlotUpdate(BaseModel):
    counselor_email: str
    date: datetime
    time_slots: List[str]

class StatusUpdate(BaseModel):
    status: str

class LikedPosts(BaseModel):
    user_id: str
    post_ids: List[str]
