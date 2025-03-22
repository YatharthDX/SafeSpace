import re
from database.connection import post_c
from database.models import Post, PostResponse, PostSearch
def search_posts_by_criteria(search_query: PostSearch) -> list:
    """
    Search posts based on text and tags.
    
    Args:
        search_query: A PostSearch object containing text and tags for searching
        
    Returns:
        List of posts matching the search criteria
    """
    post_collection = get_post_collection()
    
    # Create query conditions
    query_conditions = []
    
    # Tag matching condition
    if search_query.tags and len(search_query.tags) > 0:
        query_conditions.append({"relevant_tags": {"$in": search_query.tags}})
    
    # Text matching conditions
    if search_query.text:
        # Create regex pattern for case-insensitive partial matching
        text_pattern = re.escape(search_query.text)
        query_conditions.append({"title": {"$regex": text_pattern, "$options": "i"}})
        query_conditions.append({"relevant_tags": {"$in": [search_query.text]}})
    
    # Combine all conditions with OR
    query = {"$or": query_conditions} if query_conditions else {}
    
    # Fetch matching posts
    posts = list(post_collection.find(query).limit(100))  # Limit to 100 results
    
    # Convert MongoDB documents to Pydantic models
    return [post_to_json(post) for post in posts]

def post_to_json(post):
    """Convert MongoDB document to Pydantic model compatible dictionary"""
    return {
        "id": str(post["_id"]),
        "title": post["title"],
        "content": post["content"],
        "relevant_tags": post["relevant_tags"]
    }

def create_post(post: Post):
    """
    Create a new post in the database
    
    Args:
        post: Post object to be created
        
    Returns:
        Created post
    """
    post_collection = get_post_collection()
    post_dict = {k: v for k, v in post.dict(by_alias=True).items() if v is not None}
    
    result = post_collection.insert_one(post_dict)
    created_post = post_collection.find_one({"_id": result.inserted_id})
    
    return post_to_json(created_post)