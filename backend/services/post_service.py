from fastapi import UploadFile, HTTPException, Request
from typing import List, Optional
from bson import ObjectId
import os
import uuid
from datetime import datetime
from database.connection import blogs_collection, comments_collection ,liked_posts_collection
from services.auth_service import get_current_user_service
from detoxify import Detoxify
from database.models import BlogCreate, Blog, CommentCreate, Comment, ClassifyRequest, ReportRequest
import platform
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from utils.config import EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD
from pydantic import BaseModel, EmailStr

from fastapi import UploadFile
import os
current_os = platform.system()
if(current_os=="Darwin"):
    import google.generativeai as genai
    from google.generativeai import types
else:
    from google import genai
    from google.genai import types

import json 
model = Detoxify('original')


class PostService:
    def __init__(self):
        self.blogs_collection = blogs_collection
        self.comments_collection = comments_collection

    async def classify_severity(self, classify_request: ClassifyRequest) -> dict:
        client = genai.Client(
        api_key=os.environ["GENAI_API_KEY"],
        )
        input_text = classify_request.text
        # Set up the conversation for severity detection only.
        contents = [
            types.Content(
                role="user",
                parts=[
                    types.Part.from_text(
                        text=(
                            f'for the given input "{input_text}"   return the severity of the mental issue from the following options : severe, moderate, mild, none'
                        )
                    ),
                ],
            ),
        ]

        generate_content_config = types.GenerateContentConfig(
            temperature=1,
            top_p=0.95,
            top_k=40,
            max_output_tokens=8192,
            response_mime_type="application/json",
            response_schema=genai.types.Schema(
                type=genai.types.Type.OBJECT,
                required=["severity"],
                properties={
                    "severity": genai.types.Schema(
                        type=genai.types.Type.ARRAY,
                        items=genai.types.Schema(
                            type=genai.types.Type.STRING,
                        ),
                    ),
                },
            ),
        )
        output_chunks = []
        for chunk in client.models.generate_content_stream(
            model="gemini-2.0-flash",
            contents=contents,
            config=generate_content_config,
        ):
            output_chunks.append(chunk.text)

        # Join the chunks into a complete string
        output_text = "".join(output_chunks)

        try:
            # Parse the JSON text to a Python dictionary
            result = json.loads(output_text)
            print(type(result))
            return result
        except json.JSONDecodeError:
            print("Failed to parse output as JSON.")
            return None 

    async def classify_text(self, classify_request: ClassifyRequest) -> str:
        result = model.predict(classify_request.text)
        if result['toxicity'] > 0.6 or result['severe_toxicity'] > 0.6 or result['obscene'] > 0.6 or result['threat'] > 0.6 or result['insult'] > 0.6 or result['identity_attack'] > 0.6:
            return "HATE"
        else:
            return "NOT HATE"

    async def create_blog(self, blog: BlogCreate) -> Blog:
        """Create a new blog post"""
        blog_dict = blog.dict()
        blog_dict["created_at"] = datetime.now()
        blog_dict["updated_at"] = datetime.now()
        blog_dict["likes"] = 0
        blog_dict["image_url"] = blog_dict.get("image_url")
        
        result = self.blogs_collection.insert_one(blog_dict)
        blog_id = str(result.inserted_id)
        
        created_blog = self.blogs_collection.find_one({"_id": ObjectId(blog_id)})
        created_blog["_id"] = str(created_blog["_id"])
        
        return Blog(**created_blog)
    
    async def get_blogs(self, skip: int = 0, limit: int = 10) -> List[Blog]:
        """Get all blogs with pagination"""
        blogs = []
        cursor = self.blogs_collection.find().skip(skip).limit(limit).sort("created_at", -1)
        
        # Using a synchronous approach instead of async for
        for document in cursor:
            document["_id"] = str(document["_id"])
            blogs.append(Blog(**document))
            
        return blogs
    
    async def get_blog(self, blog_id: str) -> Blog:
        """Get a blog by ID"""
        if not ObjectId.is_valid(blog_id):
            raise ValueError("Invalid blog ID format")
            
        blog = self.blogs_collection.find_one({"_id": ObjectId(blog_id)})
        if blog is None:
            raise KeyError("Blog not found")
            
        blog["_id"] = str(blog["_id"])
        return Blog(**blog)
    
    async def update_blog(self, blog_id: str, blog_update: BlogCreate) -> Blog:
        """Update a blog by ID"""
        if not ObjectId.is_valid(blog_id):
            raise ValueError("Invalid blog ID format")
            
        # Check if blog exists
        blog = self.blogs_collection.find_one({"_id": ObjectId(blog_id)})
        if blog is None:
            raise KeyError("Blog not found")
        
        # Update fields
        update_data = blog_update.dict()
        update_data["updated_at"] = datetime.now()
        
        self.blogs_collection.update_one(
            {"_id": ObjectId(blog_id)},
            {"$set": update_data}
        )
        
        # Get updated blog
        updated_blog = self.blogs_collection.find_one({"_id": ObjectId(blog_id)})
        updated_blog["_id"] = str(updated_blog["_id"])
        
        return Blog(**updated_blog)
    
    async def delete_blog(self, blog_id: str) -> None:
        """Delete a blog by ID"""
        if not ObjectId.is_valid(blog_id):
            raise ValueError("Invalid blog ID format")
            
        # Check if blog exists
        blog = self.blogs_collection.find_one({"_id": ObjectId(blog_id)})
        if blog is None:
            raise KeyError("Blog not found")
        
        # Delete blog
        self.blogs_collection.delete_one({"_id": ObjectId(blog_id)})
        
        # Delete all associated comments
        self.comments_collection.delete_many({"blog_id": blog_id})
    
    async def upload_blog_image(self, blog_id: str, file: UploadFile) -> str:
        """Upload an image for a blog post"""
        if not ObjectId.is_valid(blog_id):
            raise ValueError("Invalid blog ID format")
            
        # Check if blog exists
        blog = self.blogs_collection.find_one({"_id": ObjectId(blog_id)})
        if blog is None:
            raise KeyError("Blog not found")
        
        # Create uploads directory if it doesn't exist
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Save the file
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Update blog with image URL
        image_url = f"/uploads/{unique_filename}"
        self.blogs_collection.update_one(
            {"_id": ObjectId(blog_id)},
            {"$set": {"image_url": image_url, "updated_at": datetime.now()}}
        )
        
        return image_url
    
    async def get_comments(self, blog_id: str) -> List[Comment]:
        """Get all comments for a blog"""
        if not ObjectId.is_valid(blog_id):
            raise ValueError("Invalid blog ID format")
            
        comments = []
        cursor = self.comments_collection.find({"blog_id": blog_id}).sort("created_at", -1)
        
        # Using a synchronous approach instead of async for
        for document in cursor:
            document["_id"] = str(document["_id"])
            comments.append(Comment(**document))
            
        return comments
    
    async def create_comment(self, blog_id: str, comment: CommentCreate) -> Comment:
        """Create a new comment for a blog"""
        if not ObjectId.is_valid(blog_id):
            raise ValueError("Invalid blog ID format")
            
        # Check if blog exists
        blog = self.blogs_collection.find_one({"_id": ObjectId(blog_id)})
        if blog is None:
            raise KeyError("Blog not found")
        
        comment_dict = comment.dict()
        comment_dict["blog_id"] = blog_id
        comment_dict["created_at"] = datetime.now()
        
        result = self.comments_collection.insert_one(comment_dict)
        comment_id = str(result.inserted_id)
        
        created_comment = self.comments_collection.find_one({"_id": ObjectId(comment_id)})
        created_comment["_id"] = str(created_comment["_id"])
        
        return Comment(**created_comment)
    
    async def update_likes(self, blog_id: str, likes: int) -> dict:
        """Update likes count for a blog"""
        if not ObjectId.is_valid(blog_id):
            raise ValueError("Invalid blog ID format")
            
        # Check if blog exists
        blog = self.blogs_collection.find_one({"_id": ObjectId(blog_id)})
        if blog is None:
            raise KeyError("Blog not found")
        
        self.blogs_collection.update_one(
            {"_id": ObjectId(blog_id)},
            {"$set": {"likes": likes, "updated_at": datetime.now()}}
        )
        
        return {"message": "Likes updated successfully", "likes": likes}
    
    async def increment_likes(self, blog_id: str, user_id: str) -> dict:
        """Increment likes count for a blog and track user's liked post"""
        if not ObjectId.is_valid(blog_id):
            raise ValueError("Invalid blog ID format")
            
        # Get current user
        
        
        # Check if blog exists
        blog = self.blogs_collection.find_one({"_id": ObjectId(blog_id)})
        if blog is None:
            raise KeyError("Blog not found")
        
        # Increment likes in blogs collection
        self.blogs_collection.update_one(
            {"_id": ObjectId(blog_id)},
            {"$inc": {"likes": 1}, "$set": {"updated_at": datetime.now()}}
        )
        
        # Add to user's liked posts
        liked_posts_collection.update_one(
            {"user_id": user_id},
            {"$addToSet": {"post_ids": blog_id}},
            upsert=True
        )
        
        updated_blog = self.blogs_collection.find_one({"_id": ObjectId(blog_id)})
        return {"message": "Blog liked successfully", "likes": updated_blog["likes"]}
    
    async def decrement_likes(self, blog_id: str, user_id: str) -> dict:
        """Decrement likes count for a blog and remove from user's liked posts"""
        if not ObjectId.is_valid(blog_id):
            raise ValueError("Invalid blog ID format")
            
        # Get current user
        
            
        # Check if blog exists
        blog = self.blogs_collection.find_one({"_id": ObjectId(blog_id)})
        if blog is None:
            raise KeyError("Blog not found")
        
        # Ensure likes don't go below 0
        if blog["likes"] > 0:
            self.blogs_collection.update_one(
                {"_id": ObjectId(blog_id)},
                {"$inc": {"likes": -1}, "$set": {"updated_at": datetime.now()}}
            )
            
            # Remove from user's liked posts
            liked_posts_collection.update_one(
                {"user_id": user_id},
                {"$pull": {"post_ids": blog_id}}
            )
        
        updated_blog = self.blogs_collection.find_one({"_id": ObjectId(blog_id)})
        return {"message": "Blog unliked successfully", "likes": updated_blog["likes"]}
    
    async def get_user_liked_posts(self, user_id: str) -> List[str]:
        """Get list of post IDs that a user has liked"""
        if not ObjectId.is_valid(user_id):
            raise ValueError("Invalid user ID format")
            
        # Get user's liked posts from liked_posts_collection
        liked_posts = liked_posts_collection.find_one({"user_id": user_id})
        if not liked_posts:
            return []
            
        return liked_posts.get("post_ids", [])
    
    async def get_user_blogs(self, user_id: str, skip: int = 0, limit: int = 20) -> List[Blog]:
        """Get all blogs created by a specific user with pagination"""
        if not ObjectId.is_valid(user_id):
            raise ValueError("Invalid user ID format")
            
        blogs = []
        cursor = self.blogs_collection.find({"author_id": user_id}).skip(skip).limit(limit).sort("created_at", -1)
        
        # Using a synchronous approach instead of async for
        for document in cursor:
            document["_id"] = str(document["_id"])
            blog = Blog(**document)
            blogs.append(blog)
            
        return blogs 
    

def send_report_email(report: ReportRequest):
    """
    Send an email report about a blog creator
    """
    try:
        sender_email = EMAIL_USERNAME
        sender_password = EMAIL_PASSWORD
        recipient_email = EMAIL_USERNAME

        # Create message
        message = MIMEMultipart()
        message['From'] = sender_email
        message['To'] = recipient_email
        message['Subject'] = f"Blog Report: {report.reported_author_name}"

        # Email body
        body = f"""
        Blog Report Details:
        
        Blog ID: {report.blog_id}
        Reported Author: {report.reported_author_name}
        Author ID: {report.reported_author_id}
        Reporter Email: {report.reporter_email}
        
        Reason for Report: {report.reason}
        
        Additional Description:
        {report.description or 'No additional description provided'}
        
        Please review and take appropriate action.
        """

        message.attach(MIMEText(body, 'plain'))

        # Send email
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(message)

        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

