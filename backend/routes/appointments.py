from fastapi import APIRouter, Depends, Body
from database.models import Appointment, SlotUpdate, StatusUpdate
from services.appointment_service import get_counselors_service, get_available_slots_service, create_appointment_service, update_appointment_status_service, get_requests_service, update_available_slots_service,get_appointments_service
from utils.jwt import get_current_user
from typing import List
from datetime import datetime


router = APIRouter()


@router.get("/counselors")
def get_counselors():
    return get_counselors_service()


@router.get("/counselors/available_slots")
def get_available_slots(counselor_email: str, date: datetime):
    return get_available_slots_service(counselor_email, date)

@router.post("/appointments")
def create_appointment(appointment: Appointment, current_user: dict = Depends(get_current_user)):
    return create_appointment_service(appointment, current_user)

@router.patch("/appointments/{appointment_id}")
def update_appointment_status(appointment_id: str, status_update: StatusUpdate, current_user: dict = Depends(get_current_user)):
    return update_appointment_status_service(appointment_id, status_update.status, current_user)

@router.get("/counselors/appointment_requests")
def get_requests(current_user: dict = Depends(get_current_user)):
    return get_requests_service(current_user)

@router.post("/counselors/update_slots")
def update_available_slots(slot_data: SlotUpdate, current_user: dict = Depends(get_current_user)):
    return update_available_slots_service(
        slot_data.counselor_email, 
        slot_data.date, 
        slot_data.time_slots, 
        current_user
    )

@router.get("/getappointments")
async def get_appointments(current_user: dict = Depends(get_current_user)):
    return get_appointments_service(current_user)