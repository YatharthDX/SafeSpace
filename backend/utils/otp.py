import random
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from utils.config import EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD
import logging

logger = logging.getLogger(__name__)

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

def send_email(to_email, subject, body):
    if not EMAIL_USERNAME or not EMAIL_PASSWORD:
        logger.warning("Email credentials not provided, skipping email send")
        return True
    message = MIMEMultipart()
    message["From"] = EMAIL_USERNAME
    message["To"] = to_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))
    try:
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        server.login(EMAIL_USERNAME, EMAIL_PASSWORD)
        server.send_message(message)
        server.quit()
        logger.info(f"Email sent successfully to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Error sending email: {e}")
        return False