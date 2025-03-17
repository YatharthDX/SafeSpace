import random
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config.db import users_collection, otp_collection
from datetime import datetime, timedelta, timezone

EMAIL = "example@gmail.com"
PASSWORD = "pass"

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(email: str, otp: str):
    subject = "Your OTP Code"
    body = f"Your OTP code is {otp}. It will expire in 5 minutes."

    msg = MIMEMultipart()
    msg["From"] = EMAIL
    msg["To"] = email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(EMAIL, PASSWORD)
        server.sendmail(EMAIL, email, msg.as_string())
        server.quit()
    except Exception as e:
        print("Failed to send OTP:", e)

def store_otp(email: str, otp: str):
    otp_collection.insert_one({
        "email": email,
        "otp": otp,
        "expires_at": datetime.now(timezone.utc) + timedelta(minutes=5)
    })

def verify_otp(email: str, otp: str) -> bool:
    otp_entry = otp_collection.find_one({"email": email, "otp": otp})

    if not otp_entry:
        return False  # OTP not found

    # Convert expires_at to timezone-aware UTC datetime
    expires_at = otp_entry["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)  # Handle string format if stored as text

    if expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        return False  # OTP expired

    return True  # OTP is valid