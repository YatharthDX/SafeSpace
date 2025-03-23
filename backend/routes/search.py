from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Optional
from database.models import Post, PostResponse, PostSearch
from services.search_services import search_posts_by_criteria, create_post, get_all_available_tags

router = APIRouter(tags=["search"])

@router.post("/search/", response_model=List[PostResponse])
def search_posts(search_query: PostSearch = Body(...)):
    """
    Search posts based on text and tags.
    
    - Returns posts where any input tag matches with the post's relevance tags
    - Returns posts where input text (or part of it) matches with post title
    - Posts with more tag matches are ranked higher
    """
    # Allow empty search to return all posts (limited to 100)
    return search_posts_by_criteria(search_query)

@router.get("/search-get/", response_model=List[PostResponse])
def search_posts_get(
    text: Optional[str] = Query(None, description="Text to search in titles"),
    tags: Optional[str] = Query(None, description="Comma-separated list of tags to search")
):
    """
    Search posts based on text and tags (GET method).
    
    - Returns posts where any input tag matches with the post's relevance tags
    - Returns posts where input text (or part of it) matches with post title
    - Posts with more tag matches are ranked higher
    """
    # Convert comma-separated tags string to list and clean it
    tag_list = []
    if tags:
        tag_list = [tag.strip() for tag in tags.split(",") if tag.strip()]
    
    # Create SearchQuery object
    search_query = PostSearch(text=text or "", tags=tag_list)
    
    # Reuse the existing search logic
    return search_posts_by_criteria(search_query)

@router.post("/posts/", response_model=PostResponse)
def add_post(post: Post):
    """Create a new post"""
    return create_post(post)

@router.get("/tags/", response_model=List[str])
def get_tags():
    """Get all available tags from posts"""
    return get_all_available_tags()