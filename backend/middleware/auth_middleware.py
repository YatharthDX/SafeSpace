from fastapi import Request
from fastapi.responses import JSONResponse
import logging
import traceback

# Configure logging
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

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
