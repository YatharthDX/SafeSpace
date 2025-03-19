from fastapi import Request
import logging
import traceback

logger = logging.getLogger(__name__)

async def exception_handling(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        logger.error(f"Unhandled exception: {str(e)}")
        logger.error(traceback.format_exc())
        return {"success": False, "error": "Internal server error", "details": str(e)}