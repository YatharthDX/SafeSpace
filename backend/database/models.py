from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from enum import Enum

# User
class User(BaseModel):
    username: str
    email: EmailStr
    password: str  # This will be hashed before storing

# New model for login
class LoginUser(BaseModel):
    email: EmailStr
    password: str