from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Optional
from database.models import Post, PostResponse, PostSearch
from services.search_services import search_posts_by_criteria, create_post

router = APIRouter(tags=["search"])

@router.post("/search/", response_model=List[PostResponse])
def search_posts(search_query: PostSearch = Body(...)):
    """
    Search posts based on text and tags.
    
    - Returns posts where any input tag matches with the post's relevant tags
    - Returns posts where input text (or part of it) matches with either post title or tags
    """
    if not search_query.text and not search_query.tags:
        raise HTTPException(status_code=400, detail="At least one search parameter (text or tags) is required")
    
    return search_posts_by_criteria(search_query)

@router.get("/search-get/", response_model=List[PostResponse])
def search_posts_get(
    text: Optional[str] = Query(None, description="Text to search in titles and tags"),
    tags: Optional[str] = Query(None, description="Comma-separated list of tags to search")
):
    """
    Search posts based on text and tags (GET method).
    
    - Returns posts where any input tag matches with the post's relevant tags
    - Returns posts where input text (or part of it) matches with either post title or tags
    """
    # Convert comma-separated tags string to list
    tag_list = tags.split(",") if tags else []
    
    # Create SearchQuery object
    search_query = PostSearch(text=text or "", tags=tag_list)
    
    # Reuse the existing search logic
    return search_posts_by_criteria(search_query)

@router.post("/posts/", response_model=PostResponse)
def add_post(post: Post):
    """Create a new post (for testing purposes)"""
    return create_post(post)