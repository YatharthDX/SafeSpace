from database.connection import users_collection, appointments_collection, available_slots_collection
from database.models import Appointment, AvailableSlot
from fastapi import HTTPException
from bson import ObjectId
from datetime import datetime
from typing import List

def get_counselors_service():
    if users_collection is None:
        raise HTTPException(status_code=503, detail="Service unavailable")
    counselors = [
        {
            "email": user["email"],
            "name": user["name"],
            "profile_picture": user.get("profile_picture", ""),
            "description": user.get("description", "")
        }
        for user in users_collection.find({"role": "counsellor"})
    ]
    return counselors

def get_available_slots_service(counselor_email: str, date: str):
    if available_slots_collection is None:
        raise HTTPException(status_code=503, detail="Service unavailable")
    try:
        date_obj = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
    available_slots = available_slots_collection.find_one({
        "counselor_email": counselor_email,
        "date": date_obj
    })
    return {"time_slots": available_slots["time_slots"] if available_slots else []}

def create_appointment_service(appointment: Appointment, current_user: dict):
    if appointments_collection is None or available_slots_collection is None:
        raise HTTPException(status_code=503, detail="Service unavailable")
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can book appointments")
    appointment.user_email = current_user["email"]
    available_slots = available_slots_collection.find_one({
        "counselor_email": appointment.counselor_email,
        "date": appointment.date
    })
    if not available_slots or appointment.time_slot not in available_slots["time_slots"]:
        raise HTTPException(status_code=400, detail="Selected time slot is not available.")
    appointment_dict = appointment.dict()
    result = appointments_collection.insert_one(appointment_dict)
    available_slots_collection.update_one(
        {"counselor_email": appointment.counselor_email, "date": appointment.date},
        {"$pull": {"time_slots": appointment.time_slot}}
    )
    return {"message": "Appointment request submitted successfully", "appointment_id": str(result.inserted_id)}

def update_appointment_status_service(appointment_id: str, status: str, current_user: dict):
    if appointments_collection is None:
        raise HTTPException(status_code=503, detail="Service unavailable")
    if current_user["role"] != "counselor":
        raise HTTPException(status_code=403, detail="Only counselors can update appointment status")
    if status not in ["accepted", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status. Use 'accepted' or 'rejected'.")
    appointment = appointments_collection.find_one({"_id": ObjectId(appointment_id)})
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if appointment["counselor_email"] != current_user["email"]:
        raise HTTPException(status_code=403, detail="You are not authorized to update this appointment")
    appointments_collection.update_one(
        {"_id": ObjectId(appointment_id)},
        {"$set": {"status": status}}
    )
    return {"message": f"Appointment {status} successfully"}

def get_pending_requests_service(current_user: dict):
    if appointments_collection is None:
        raise HTTPException(status_code=503, detail="Service unavailable")
    if current_user["role"] != "counselor":
        raise HTTPException(status_code=403, detail="Only counselors can view appointment requests")
    pending_requests = [
        {**appt, "_id": str(appt["_id"])}
        for appt in appointments_collection.find({
            "counselor_email": current_user["email"],
            "status": "pending"
        })
    ]
    return pending_requests

def update_available_slots_service(counselor_email: str, date: str, time_slots: List[str], current_user: dict):
    if available_slots_collection is None:
        raise HTTPException(status_code=503, detail="Service unavailable")
    if current_user["role"] != "counselor" or current_user["email"] != counselor_email:
        raise HTTPException(status_code=403, detail="Only counselors can update their own slots")
    try:
        date_obj = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
    available_slots_collection.update_one(
        {"counselor_email": counselor_email, "date": date_obj},
        {"$set": {"time_slots": time_slots}},
        upsert=True
    )
    return {"message": "Available slots updated successfully"}