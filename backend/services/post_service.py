from fastapi import UploadFile, HTTPException, Request
from typing import List, Optional
from bson import ObjectId
import os
import uuid
from datetime import datetime
from database.connection import blogs_collection, comments_collection ,liked_posts_collection
from services.auth_service import get_current_user_service
# from transformers import AutoTokenizer, AutoModelForSequenceClassification
# from transformers import pipeline

# # Load the model and tokenizer
# model_name = "Hate-speech-CNERG/dehatebert-mono-english"
# tokenizer = AutoTokenizer.from_pretrained(model_name)
# model = AutoModelForSequenceClassification.from_pretrained(model_name)

# classifier = pipeline("text-classification", model=model, tokenizer=tokenizer)


from database.models import BlogCreate, Blog, CommentCreate, Comment

class PostService:
    def __init__(self):
        self.blogs_collection = blogs_collection
        self.comments_collection = comments_collection

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
    
    async def get_blogs(self, skip: int = 0, limit: int = 20) -> List[Blog]:
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
    