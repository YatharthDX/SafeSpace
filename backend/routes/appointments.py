from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ..models.appointment import (
    AppointmentRequest,
    AppointmentCreate,
    DaySchedule,
    TimeSlot,
    ToggleSlotRequest,
    AppointmentStatus
)
from ..auth.auth_bearer import JWTBearer
import uuid
from datetime import datetime, timedelta

router = APIRouter()

# In-memory storage (replace with database in production)
appointment_requests = []
counselor_schedules = {}

def generate_default_slots():
    return [
        TimeSlot(time=f"{hour:02d}:00", is_available=False)
        for hour in range(9, 18)  # 9 AM to 6 PM
    ]

@router.get("/appointments/requests", response_model=List[AppointmentRequest])
async def get_appointment_requests(token: str = Depends(JWTBearer())):
    return appointment_requests

@router.post("/appointments/create", response_model=AppointmentRequest)
async def create_appointment(appointment: AppointmentCreate):
    new_appointment = AppointmentRequest(
        id=str(uuid.uuid4()),
        student_name=appointment.student_name,
        requested_date=appointment.requested_date,
        requested_time=appointment.requested_time,
        problem_description=appointment.problem_description,
        status=AppointmentStatus.PENDING
    )
    appointment_requests.append(new_appointment)
    return new_appointment

@router.post("/appointments/{appointment_id}/accept")
async def accept_appointment(appointment_id: str, token: str = Depends(JWTBearer())):
    appointment = next((a for a in appointment_requests if a.id == appointment_id), None)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appointment.status = AppointmentStatus.ACCEPTED
    return {"message": "Appointment accepted"}

@router.post("/appointments/{appointment_id}/reject")
async def reject_appointment(appointment_id: str, token: str = Depends(JWTBearer())):
    appointment = next((a for a in appointment_requests if a.id == appointment_id), None)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appointment.status = AppointmentStatus.REJECTED
    return {"message": "Appointment rejected"}

@router.get("/counselor/schedule", response_model=List[DaySchedule])
async def get_counselor_schedule(token: str = Depends(JWTBearer())):
    # Generate schedule for the next 7 days if not exists
    today = datetime.now()
    schedule = []
    
    for i in range(7):
        date = (today + timedelta(days=i)).strftime("%d %B")
        if date not in counselor_schedules:
            counselor_schedules[date] = generate_default_slots()
        
        schedule.append(DaySchedule(
            date=date,
            slots=counselor_schedules[date]
        ))
    
    return schedule

@router.post("/counselor/schedule/toggle")
async def toggle_slot_availability(request: ToggleSlotRequest, token: str = Depends(JWTBearer())):
    if request.date not in counselor_schedules:
        raise HTTPException(status_code=404, detail="Date not found in schedule")
    
    slot = next((s for s in counselor_schedules[request.date] if s.time == request.time), None)
    if not slot:
        raise HTTPException(status_code=404, detail="Time slot not found")
    
    if slot.appointment_id:
        raise HTTPException(status_code=400, detail="Cannot modify a booked slot")
    
    slot.is_available = not slot.is_available
    return {"message": "Slot availability updated"} 