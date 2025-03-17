from pymongo import MongoClient

conn = MongoClient("mongodb://localhost:27017/")
db = conn["user_database"]

users_collection = db["users"]
otp_collection = db["otp"]
posts_collection = db["posts"]
appointments_collection = db["appointments"]
