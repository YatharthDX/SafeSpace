from pydantic import BaseModel, EmailStr, validator
from datetime import datetime
from typing import List

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
    



from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId



class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class Post(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    title: str
    content: str
    relevant_tags: List[str]
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: lambda v: str(v)
        }

class PostResponse(BaseModel):
    id: str
    title: str
    content: str
    relevant_tags: List[str]

class PostSearch(BaseModel):
    text: Optional[str] = ""
    tags: Optional[List[str]] = []