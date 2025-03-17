from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from enum import Enum

# User
class User(BaseModel):
    username: str
    email: EmailStr
    password: str  # This will be hashed before storing

# Appointment
class AppointmentStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

class TimeSlot(BaseModel):
    time: str
    is_available: bool
    appointment_id: Optional[str] = None

class DaySchedule(BaseModel):
    date: str
    slots: List[TimeSlot]

class AppointmentRequest(BaseModel):
    id: str
    student_name: str
    requested_date: str
    requested_time: str
    problem_description: str
    status: AppointmentStatus = AppointmentStatus.PENDING

class AppointmentCreate(BaseModel):
    student_name: str
    requested_date: str
    requested_time: str
    problem_description: str

class ToggleSlotRequest(BaseModel):
    date: str
    time: str 