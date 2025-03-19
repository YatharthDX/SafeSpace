from pymongo import MongoClient
import redis
from utils.config import MONGODB_URL, REDIS_HOST, REDIS_PORT
import logging

logger = logging.getLogger(__name__)

# MongoDB Connection
try:
    client = MongoClient(MONGODB_URL, serverSelectionTimeoutMS=5000)
    client.server_info()
    db = client["SafeSpace"]
    users_collection = db["users"]
    appointments_collection = db["appointments"]
    available_slots_collection = db["available_slots"]
    role_requests_collection = db["role_requests"]
    logger.info("MongoDB connection successful")
except Exception as e:
    logger.error(f"MongoDB connection error: {e}")
    client = None
    db = None
    users_collection = None
    appointments_collection = None
    available_slots_collection = None
    role_requests_collection = None

# Redis Connection
try:
    redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT)
    redis_client.ping()
    logger.info("Redis connection successful")
except Exception as e:
    logger.error(f"Redis connection error: {e}")
    redis_client = None