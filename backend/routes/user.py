from fastapi import APIRouter, Depends
from database.models import RoleRequest
from services.user_service import request_counselor_role_service, update_role_service
from utils.jwt import get_current_user

router = APIRouter()

@router.post("/request-counselor-role")
async def request_counselor_role(request: RoleRequest, current_user: dict = Depends(get_current_user)):
    return request_counselor_role_service(request)

@router.post("/update-role")
async def update_role(email: str, new_role: str, admin_email: str):
    return update_role_service(email, new_role, admin_email)