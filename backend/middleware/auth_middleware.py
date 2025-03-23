from fastapi import Request, HTTPException, Depends
from fastapi.responses import JSONResponse
import logging
import traceback
from jose import jwt
from database.connection import users_collection

# Configure logging
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

async def get_current_user(request: Request):
    if users_collection is None:
        raise HTTPException(status_code=503, detail="Service unavailable")
    
    # Get the JWT token from cookies
    jwt_token = request.cookies.get("jwt")
    if not jwt_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        # Decode the JWT token
        payload = jwt.decode(jwt_token, options={"verify_signature": False})
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        # Get user from database
        user = users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Remove sensitive information
        user["_id"] = str(user["_id"])
        user.pop("password", None)
        
        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        logger.error(f"Error in get_current_user: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

async def exception_handling(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        # Log the full traceback
        error_trace = traceback.format_exc()
        logger.error(f"Unhandled exception: {str(e)}\n{error_trace}")

        # Return a proper JSON response instead of a dictionary
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": "Internal server error", "details": str(e)},
        )
