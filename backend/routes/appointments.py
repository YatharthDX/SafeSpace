from fastapi import APIRouter, Depends, Body
from database.models import Appointment, SlotUpdate
from services.appointment_service import get_current_counselors_service, get_counselors_service, get_available_slots_service, create_appointment_service, update_appointment_status_service, get_pending_requests_service, update_available_slots_service
from utils.jwt import get_current_user
from typing import List


router = APIRouter()

@router.get("/current-counselors")
def get_current_counselors(current_user: dict = Depends(get_current_user)):
    return get_current_counselors_service(current_user)

@router.get("/counselors")
def get_counselors():
    return get_counselors_service()

@router.get("/counselors/available_slots")
@router.get("/counselors/available_slots")
def get_available_slots(counselor_email: str, date: str):
    return get_available_slots_service(counselor_email, date)

@router.post("/appointments")
def create_appointment(appointment: Appointment, current_user: dict = Depends(get_current_user)):
    return create_appointment_service(appointment, current_user)

@router.patch("/appointments/{appointment_id}")
def update_appointment_status(appointment_id: str, status: str, current_user: dict = Depends(get_current_user)):
    return update_appointment_status_service(appointment_id, status, current_user)

@router.get("/counselors/appointment_requests")
def get_pending_requests(current_user: dict = Depends(get_current_user)):
    return get_pending_requests_service(current_user)

@router.post("/counselors/update_slots")
def update_available_slots(slot_data: SlotUpdate, current_user: dict = Depends(get_current_user)):
    return update_available_slots_service(
        slot_data.counselor_email, 
        slot_data.date, 
        slot_data.time_slots, 
        current_user
    )

