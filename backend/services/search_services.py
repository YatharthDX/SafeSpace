import re
from typing import List, Dict, Any
from database.connection import blogs_collection
from database.models import Post, PostResponse, PostSearch

# def search_posts_by_criteria(search_query: PostSearch) -> List[PostResponse]:
#     """
#     Search posts based on text and tags, with sophisticated ranking.
    
#     Args:
#         search_query: A PostSearch object containing text and tags for searching
        
#     Returns:
#         List of posts matching the search criteria, sorted by match quality
#     """
#     post_collection = blogs_collection
    
#     # Initialize an empty query that will match all documents if no criteria provided
#     query_conditions = []
    
#     # Text matching condition - partial match in title
#     if search_query.text and search_query.text.strip():
#         text_pattern = re.escape(search_query.text.strip())
#         query_conditions.append({"title": {"$regex": text_pattern, "$options": "i"}})
        
#         # NEW: Also match text against tags
#         query_conditions.append({"relevance_tags": {"$regex": text_pattern, "$options": "i"}})
    
#     # Tag matching condition
#     if search_query.tags and len(search_query.tags) > 0:
#         # Match any of the provided tags
#         query_conditions.append({"relevance_tags": {"$in": search_query.tags}})
    
#     # Combine conditions with OR
#     query = {"$or": query_conditions} if query_conditions else {}
    
#     # If no search criteria, return all posts (limited to 100)
#     if not query_conditions:
#         cursor = post_collection.find().limit(100)
#     else:
#         # Fetch matching posts (limit to 100)
#         cursor = post_collection.find(query).limit(100)
    
#     # Convert to list of dictionaries
#     posts = list(cursor)
    
#     # Process results to add match quality metrics
#     processed_posts = []
#     for post in posts:
#         # Count how many tags match
#         tag_match_count = 0
#         if search_query.tags:
#             # Check if the post has the 'relevance_tags' field
#             post_tags = post.get("relevance_tags", [])
#             tag_match_count = sum(1 for tag in search_query.tags if tag in post_tags)
        
#         # NEW: Calculate title match quality
#         title_match_score = 0
#         if search_query.text and search_query.text.strip():
#             search_text = search_query.text.lower()
#             post_title = post.get("title", "").lower()
            
#             # If search text is found in title, calculate what percentage of search text is in title
#             if search_text in post_title:
#                 title_match_score = 100  # Exact match gets highest priority
#             else:
#                 # Calculate longest common substring length
#                 text_len = len(search_text)
#                 max_common_len = 0
#                 for i in range(text_len):
#                     for j in range(i + 1, text_len + 1):
#                         if search_text[i:j] in post_title:
#                             max_common_len = max(max_common_len, j - i)
                
#                 # Score based on percentage of search text that matches
#                 if text_len > 0:
#                     title_match_score = (max_common_len / text_len) * 100
        
#         # NEW: Check if any tag matches the search text
#         tag_text_match = 0
#         if search_query.text and search_query.text.strip():
#             search_text = search_query.text.lower()
#             post_tags = [tag.lower() for tag in post.get("relevance_tags", [])]
            
#             # Check if search text appears in any tag
#             for tag in post_tags:
#                 if search_text in tag:
#                     tag_text_match = 50  # Base score for tag match
#                     # Higher score if it's an exact match
#                     if search_text == tag:
#                         tag_text_match = 75
#                     break
        
#         # Calculate overall match score (weighted combination)
#         # Tag matches are highest priority, then title match quality, then tag-text matches
#         overall_score = (tag_match_count * 100) + title_match_score + tag_text_match
        
#         # Create PostResponse object with match quality metrics
#         processed_post = {
#             "id": str(post["_id"]),
#             "title": post["title"],
#             "content": post["content"],
#             "relevant_tags": post.get("relevance_tags", []),  # Use relevance_tags from DB
#             "tag_match_count": tag_match_count,
#             # We'll use tag_match_count to store the overall score for sorting
#             "tag_match_count": overall_score
#         }
#         processed_posts.append(processed_post)
    
#     # Sort by overall score in descending order
#     processed_posts.sort(key=lambda x: x["tag_match_count"], reverse=True)
    
#     return processed_posts

# def search_posts_by_criteria(search_query: PostSearch) -> List[PostResponse]:
#     """
#     Search posts based on text and tags, with sophisticated ranking.
    
#     Args:
#         search_query: A PostSearch object containing text and tags for searching
        
#     Returns:
#         List of posts matching the search criteria, sorted by match quality
#     """
#     post_collection = blogs_collection

#     # Initialize an empty query that will match all documents if no criteria provided
#     query_conditions = []

#     # Text matching condition - partial match in title
#     if search_query.text and search_query.text.strip():
#         text_pattern = re.escape(search_query.text.strip())
#         query_conditions.append({"title": {"$regex": text_pattern, "$options": "i"}})
        
#         # Also match text against tags
#         query_conditions.append({"relevance_tags": {"$regex": text_pattern, "$options": "i"}})

#     # Tag matching condition
#     if search_query.tags and len(search_query.tags) > 0:
#         query_conditions.append({"relevance_tags": {"$in": search_query.tags}})

#     # Combine conditions with OR if present
#     query = {"$or": query_conditions} if query_conditions else {}

#     # Always sort by most recent (descending order)
#     cursor = post_collection.find(query).sort("created_at", -1).limit(10)

#     # Convert to list of documents
#     posts = list(cursor)

#     processed_posts = []
#     for post in posts:
#         tag_match_count = 0
#         if search_query.tags:
#             post_tags = post.get("relevance_tags", [])
#             tag_match_count = sum(1 for tag in search_query.tags if tag in post_tags)

#         # Title match score
#         title_match_score = 0
#         if search_query.text and search_query.text.strip():
#             search_text = search_query.text.lower()
#             post_title = post.get("title", "").lower()
#             if search_text in post_title:
#                 title_match_score = 100
#             else:
#                 text_len = len(search_text)
#                 max_common_len = 0
#                 for i in range(text_len):
#                     for j in range(i + 1, text_len + 1):
#                         if search_text[i:j] in post_title:
#                             max_common_len = max(max_common_len, j - i)
#                 if text_len > 0:
#                     title_match_score = (max_common_len / text_len) * 100

#         # Check if any tag matches the search text
#         tag_text_match = 0
#         if search_query.text and search_query.text.strip():
#             search_text = search_query.text.lower()
#             post_tags = [tag.lower() for tag in post.get("relevance_tags", [])]
#             for tag in post_tags:
#                 if search_text in tag:
#                     tag_text_match = 50
#                     if search_text == tag:
#                         tag_text_match = 75
#                     break

#         overall_score = (tag_match_count * 100) + title_match_score + tag_text_match

#         processed_post = {
#             "id": str(post["_id"]),
#             "title": post["title"],
#             "content": post["content"],
#             "relevant_tags": post.get("relevance_tags", []),
#             "tag_match_count": overall_score
            
#         }
#         processed_posts.append(processed_post)

#     # Sort the 10 posts by score
#     processed_posts.sort(key=lambda x: x["tag_match_count"], reverse=True)

#     return processed_posts
def search_posts_by_criteria(search_query: PostSearch) -> List[PostResponse]:
    """
    Search posts based on text and tags.
    
    Args:
        search_query: A PostSearch object containing text and tags for searching.
        
    Returns:
        List of posts matching the search criteria (sorted by creation time in descending order).
    """
    # Build query conditions from search criteria
    query_conditions = []

    if search_query.text and search_query.text.strip():
        text_pattern = re.escape(search_query.text.strip())
        query_conditions.append({"title": {"$regex": text_pattern, "$options": "i"}})
        query_conditions.append({"relevance_tags": {"$regex": text_pattern, "$options": "i"}})

    if search_query.tags and len(search_query.tags) > 0:
        query_conditions.append({"relevance_tags": {"$in": search_query.tags}})

    # If any query conditions were provided, use an $or query; otherwise, return all posts.
    query = {"$or": query_conditions} if query_conditions else {}

    # Retrieve posts, sorting by "created_at" descending and limiting to 10
    cursor = blogs_collection.find(query).sort("created_at", -1).limit(10)
    posts = []
    
    # Convert documents to the expected response, mapping _id -> id and
    # ensuring "relevant_tags" is available (by using "relevance_tags" if needed).
    for document in cursor:
        document["_id"] = str(document["_id"])
        if "relevant_tags" not in document:
            document["relevant_tags"] = document.get("relevance_tags", [])
        posts.append(PostResponse(**document))
    
    return posts



def post_to_json(post: Dict[str, Any]) -> Dict[str, Any]:
    """Convert MongoDB document to Pydantic model compatible dictionary"""
    return {
        "id": str(post["_id"]),
        "title": post["title"],
        "content": post["content"],
        "relevant_tags": post.get("relevance_tags", []),  # Use relevance_tags from DB
        "tag_match_count": 0  # Default value
    }

def create_post(post: Post) -> Dict[str, Any]:
    """
    Create a new post in the database
    
    Args:
        post: Post object to be created
        
    Returns:
        Created post
    """
    post_collection = blogs_collection
    post_dict = post.dict(by_alias=True)
    
    # Remove None values
    post_dict = {k: v for k, v in post_dict.items() if v is not None}
    
    result = post_collection.insert_one(post_dict)
    created_post = post_collection.find_one({"_id": result.inserted_id})
    
    return post_to_json(created_post)

def get_all_available_tags() -> List[str]:
    """
    Get all unique tags from all posts
    
    Returns:
        List of unique tags
    """
    post_collection = blogs_collection
    
    # Use MongoDB aggregation to get unique tags
    pipeline = [
        {"$unwind": "$relevance_tags"},  # Unwind the relevance_tags array
        {"$group": {"_id": "$relevance_tags"}},
        {"$sort": {"_id": 1}}
    ]
    
    result = post_collection.aggregate(pipeline)
    tags = [doc["_id"] for doc in result]
    
    return tags