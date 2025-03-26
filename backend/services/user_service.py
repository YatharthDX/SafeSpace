from database.connection import users_collection, role_requests_collection
from database.models import RoleRequest
from utils.otp import send_email
from utils.config import ADMIN_EMAILS
from fastapi import HTTPException
from datetime import datetime

# def request_counselor_role_service(request: RoleRequest):
#     user = users_collection.find_one({"email": request.email})
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     if user["role"] != "student":
#         raise HTTPException(status_code=400, detail="User is already a counselor or request pending")
#     if role_requests_collection.find_one({"email": request.email, "status": "pending"}):
#         raise HTTPException(status_code=400, detail="Request already pending")
#     role_request = {
#         "email": request.email,
#         "status": "pending",
#         "timestamp": datetime.utcnow().isoformat()
#     }
#     role_requests_collection.insert_one(role_request)
#     subject = "New Counselor Role Request"
#     body = f"User {request.email} (ID: {user['_id']}) has requested a counselor role.\nApprove at: http://safespace.iitk.ac.in/admin/approve?email={request.email}"
#     for admin_email in ADMIN_EMAILS:
#         send_email(admin_email, subject, body)
#     return {"success": True, "message": "Request sent to admins for approval"}

def update_role_service(email: str, new_role: str, admin_email: str, profile_photo: str = None, description: str = None):
    if admin_email not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Unauthorized")
    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Prepare update data with role and optional fields
    update_data = {"role": new_role}
    if profile_photo:  # Assuming profile_photo is passed as base64 string
        update_data["profile_picture"] = profile_photo  # Changed field name to match your upload function
    if description:
        update_data["description"] = description
    
    # Update user document with all provided fields
    users_collection.update_one(
        {"email": email}, 
        {"$set": update_data}
    )
    
    # Update role request status
    role_requests_collection.update_one(
        {"email": email},
        {"$set": {"status": "approved" if new_role == "counsellor" else "rejected"}}
    ) 
    # Prepare and send email notification
    subject = f"Counselor Role Request {'Approved' if new_role == 'counsellor' else 'Rejected'}"
    body = f"Your request to become a counselor has been {'approved' if new_role == 'counsellor' else 'rejected'} by the admin."
    if profile_photo or description:
        body += "\nYour profile has been updated with the provided information."
    send_email(email, subject, body)
    return {"success": True, "message": f"Role updated to {new_role}"}

