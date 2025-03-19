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
    user_email: EmailStr
    counselor_email: EmailStr
    date: datetime
    time_slot: str
    description: str
    status: str = "pending"

class AvailableSlot(BaseModel):
    counselor_email: EmailStr
    date: datetime
    time_slots: List[str]

class RoleRequest(BaseModel):
    email: str
    