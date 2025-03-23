from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from typing import List, Optional
from bson import ObjectId

from database.models import BlogCreate, Blog, CommentCreate, Comment, LikesUpdate
from services.post_service import PostService
router = APIRouter(tags=["posts"])
from pydantic import BaseModel

class LikeRequest(BaseModel):
    user_id: str
# Dependency for PostService
def get_post_service():
    return PostService()

@router.get("/", response_description="Home endpoint")
async def home():
    return {"message": "Welcome to the Blog API"}

@router.post("/blogs", response_model=Blog, response_description="Create a new blog post")
async def create_blog(
    blog: BlogCreate,
    post_service: PostService = Depends(get_post_service)
):
    return await post_service.create_blog(blog)

@router.get("/blogs", response_model=List[Blog], response_description="Get all blogs")
async def get_blogs(
    skip: int = 0, 
    limit: int = 20,
    post_service: PostService = Depends(get_post_service)
):
    return await post_service.get_blogs(skip, limit)

@router.get("/blogs/{blog_id}", response_model=Blog, response_description="Get a blog by id")
async def get_blog(
    blog_id: str,
    post_service: PostService = Depends(get_post_service)
):
    try:
        return await post_service.get_blog(blog_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid blog ID format")
    except KeyError:
        raise HTTPException(status_code=404, detail="Blog not found")

@router.put("/blogs/{blog_id}", response_model=Blog, response_description="Update a blog")
async def update_blog(
    blog_id: str,
    blog_update: BlogCreate,
    post_service: PostService = Depends(get_post_service)
):
    try:
        return await post_service.update_blog(blog_id, blog_update)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid blog ID format")
    except KeyError:
        raise HTTPException(status_code=404, detail="Blog not found")

@router.delete("/blogs/{blog_id}", response_description="Delete a blog")
async def delete_blog(
    blog_id: str,
    post_service: PostService = Depends(get_post_service)
):
    try:
        await post_service.delete_blog(blog_id)
        return {"message": "Blog deleted successfully"}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid blog ID format")
    except KeyError:
        raise HTTPException(status_code=404, detail="Blog not found")

@router.post("/blogs/{blog_id}/upload-image", response_description="Upload image for a blog post")
async def upload_blog_image(
    blog_id: str,
    file: UploadFile = File(...),
    post_service: PostService = Depends(get_post_service)
):
    try:
        image_url = await post_service.upload_blog_image(blog_id, file)
        return {"message": "Image uploaded successfully", "image_url": image_url}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid blog ID format")
    except KeyError:
        raise HTTPException(status_code=404, detail="Blog not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

@router.get("/blogs/{blog_id}/comments", response_model=List[Comment], response_description="Get comments for a blog")
async def get_comments(
    blog_id: str,
    post_service: PostService = Depends(get_post_service)
):
    try:
        return await post_service.get_comments(blog_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid blog ID format")

@router.post("/blogs/{blog_id}/comments", response_model=Comment, response_description="Add comment to a blog")
async def create_comment(
    blog_id: str,
    comment: CommentCreate,
    post_service: PostService = Depends(get_post_service)
):
    try:
        return await post_service.create_comment(blog_id, comment)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid blog ID format")
    except KeyError:
        raise HTTPException(status_code=404, detail="Blog not found")

@router.put("/blogs/{blog_id}/likes", response_description="Update likes for a blog")
async def update_likes(
    blog_id: str,
    update: LikesUpdate,
    post_service: PostService = Depends(get_post_service)
):
    try:
        return await post_service.update_likes(blog_id, update.likes)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid blog ID format")
    except KeyError:
        raise HTTPException(status_code=404, detail="Blog not found")

@router.post("/blogs/{blog_id}/like", response_description="Like a blog post")
async def like_blog(
    blog_id: str,
    like_request: LikeRequest,
    post_service: PostService = Depends(get_post_service)
):
    try:
        return await post_service.increment_likes(blog_id, like_request.user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid blog ID or user ID format")
    except KeyError:
        raise HTTPException(status_code=404, detail="Blog not found")

@router.post("/blogs/{blog_id}/unlike", response_description="Unlike a blog post")
async def unlike_blog(
    blog_id: str,
    like_request: LikeRequest,
    post_service: PostService = Depends(get_post_service)
):
    try:
        return await post_service.decrement_likes(blog_id, like_request.user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid blog ID or user ID format")
    except KeyError:
        raise HTTPException(status_code=404, detail="Blog not found")

@router.get("/user/liked-posts", response_description="Get user's liked posts")
async def get_user_liked_posts(
    user_id: str,
    post_service: PostService = Depends(get_post_service)
):
    try:
        return await post_service.get_user_liked_posts(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/user/{user_id}/blogs", response_description="Get blogs by a particular user")
async def get_user_blogs(
    user_id: str,
    post_service: PostService = Depends(get_post_service)
):
    try:
        return await post_service.get_user_blogs(user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))