import React, { useState, useEffect } from "react";
import {
  FaRegUser,
  FaRegComment,
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaPlus,
  FaTimes,
  FaTag,
} from "react-icons/fa";
import Navbar from "../components/Public/navbar";
import "../css/Home.css";
import { useNavigate } from "react-router-dom";
import { getPosts, likePost, unlikePost, getComments, addComment, getUserLikedPosts } from "../api/posts";
import { getCurrentUser } from "../chat-services/pyapi";

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allTags, setAllTags] = useState([]);
  
  // State for selected tags
  const [selectedTags, setSelectedTags] = useState([]);
  
  // State for search text from navbar
  const [searchText, setSearchText] = useState("");

  // State for liked posts
  const [likedPosts, setLikedPosts] = useState(new Set());

  // State for active comment section
  const [activeCommentPost, setActiveCommentPost] = useState(null);

  // State for comment input
  const [newComment, setNewComment] = useState("");

  const HandleCreate = () => {
    navigate("/createpost");
  };

  // Fetch all available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/search_blog/tags/");
        if (response.ok) {
          const tags = await response.json();
          setAllTags(tags);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    
    fetchTags();
  }, []);

  // Fetch posts on component mount and when search criteria change
  useEffect(() => {
    fetchPosts();
  }, [selectedTags, searchText]);

  // Fetch posts from API with search parameters
  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // Get user and liked posts
      const currentUser = await getCurrentUser();
      let likedPostIds = [];
      if (currentUser) {
        likedPostIds = await getUserLikedPosts();
        setLikedPosts(new Set(likedPostIds));
      }

      // Prepare search parameters
      let fetchedPosts;
      if (selectedTags.length > 0 || searchText) {
        // Use search API with parameters
        const tagsParam = selectedTags.join(',');
        const url = `http://127.0.0.1:8000/search_blog/search-get/?text=${encodeURIComponent(searchText)}&tags=${encodeURIComponent(tagsParam)}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Search request failed');
        }
        
        fetchedPosts = await response.json();
      } else {
        // No search criteria, get all posts
        fetchedPosts = await getPosts();
      }
      
      // Update posts with correct likes count and liked state
      const updatedPosts = fetchedPosts.map(post => ({
        ...post,
        isLiked: likedPostIds.includes(post._id || post.id)
      }));
      
      setPosts(updatedPosts);

      // Initialize comments state for each post
      const commentsState = {};
      for (const post of updatedPosts) {
        const postId = post._id || post.id;
        const postComments = await getComments(postId);
        commentsState[postId] = postComments;
      }
      setComments(commentsState);
    } catch (err) {
      setError(err.message || "Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search from navbar
  const handleSearch = (text, tags) => {
    setSearchText(text);
    if (tags && tags.length > 0) {
      setSelectedTags(prevTags => {
        // If tag is already selected, don't add it again
        if (prevTags.includes(tags[0])) {
          return prevTags;
        }
        return [...prevTags, ...tags];
      });
    }
  };

  // Toggle like function
  const toggleLike = async (postId) => {
    try {
      if (likedPosts.has(postId)) {
        await unlikePost(postId);
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        await likePost(postId);
        setLikedPosts(prev => new Set([...prev, postId]));
      }
      
      // Update the post's likes count in the posts state
      setPosts(prevPosts =>
        prevPosts.map(post => {
          const currentPostId = post._id || post.id;
          return currentPostId === postId
            ? {
                ...post,
                likes: likedPosts.has(postId) ? post.likes - 1 : post.likes + 1
              }
            : post
        })
      );
    } catch (err) {
      setError(err.message || "Failed to update like status. Please try again.");
    }
  };

  // Toggle comment section
  const toggleCommentSection = async (postId) => {
    if (activeCommentPost === postId) {
      setActiveCommentPost(null);
    } else {
      setActiveCommentPost(postId);
      // Fetch comments if not already loaded
      if (!comments[postId]) {
        try {
          const postComments = await getComments(postId);
          setComments(prev => ({ ...prev, [postId]: postComments }));
        } catch (err) {
          setError(err.message || "Failed to fetch comments. Please try again.");
        }
      }
    }
  };

  // Handle comment input change
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    try {
      const currentUser = await getCurrentUser();
      const commentData = {
        content: newComment,
        author: currentUser.name,
        author_id: currentUser._id,
      };
      
      await addComment(activeCommentPost, commentData);
      
      // Refresh comments
      const updatedComments = await getComments(activeCommentPost);
      setComments(prev => ({ ...prev, [activeCommentPost]: updatedComments }));
      
      // Clear the input
      setNewComment("");
    } catch (err) {
      setError(err.message || "Failed to add comment. Please try again.");
    }
  };
  
  // Handle tag selection (toggle)
  const toggleTagSelection = (tag) => {
    setSelectedTags(prevSelectedTags => {
      if (prevSelectedTags.includes(tag)) {
        return prevSelectedTags.filter(t => t !== tag);
      } else {
        return [...prevSelectedTags, tag];
      }
    });
  };
  
  return (
    <div
      className={`home-container ${
        activeCommentPost ? "with-comments-open" : ""
      }`}
    >
      {/* Navbar with search function */}
      <Navbar onSearch={handleSearch} />

      <div className="home-main-content">
        {/* Left sidebar with tags and create post button */}
        <div className="left-sidebar">
          <div className="sidebar-section">
            <div className="tag-header">
              <div className="tag-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
              </div>
              <h2>Filter by Tags</h2>
            </div>

            <div className="tags-list">
              {allTags.map((tag, index) => (
                <div 
                  key={index} 
                  className={`tag-item ${selectedTags.includes(tag) ? 'active' : ''}`}
                  onClick={() => toggleTagSelection(tag)}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* Create post button in the sidebar */}
          <button className="create-post-btn" onClick={HandleCreate}>
            <FaPlus className="plus-icon" />
            <span>Create Post</span>
          </button>
        </div>

        {/* Main posts area */}
        <div className="posts-container">
          {loading ? (
            <div className="loading-indicator">Loading posts...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : posts.length === 0 ? (
            <div className="no-posts-message">
              No posts found. Try different search criteria or create a new post!
            </div>
          ) : (
            posts.map((post) => {
              const postId = post._id || post.id;
              return (
                <div key={postId} className="post">
                  <div className="post-header">
                    <div className="post-user">
                      <div className="user-avatar">
                        <FaRegUser />
                      </div>
                      <div className="user-info">
                        <span className="username">{post.author}</span>
                        <span className="post-time">{post.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="post-content">
                    {post.title && <h3 className="post-title">{post.title}</h3>}
                    <p className="post-text">{post.content}</p>
                  </div>

                  <div className="post-footer">
                    <div className="post-actions">
                      <button
                        className={`action-button ${
                          likedPosts.has(postId) ? "active" : ""
                        }`}
                        onClick={() => toggleLike(postId)}
                      >
                        {likedPosts.has(postId) ? <FaHeart /> : <FaRegHeart />}
                      </button>
                      <button
                        className={`action-button ${
                          activeCommentPost === postId ? "active" : ""
                        }`}
                        onClick={() => toggleCommentSection(postId)}
                      >
                        <FaRegComment />
                      </button>
                    </div>
                    
                    {/* Display tags from both possible fields */}
                    {(post.relevance_tags || post.relevant_tags || []).length > 0 && (
                      <div className="post-tags">
                        {(post.relevance_tags || post.relevant_tags || []).map((tag, index) => (
                          <span 
                            key={index} 
                            className="tag"
                            onClick={() => toggleTagSelection(tag)}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Comment Section */}
        {activeCommentPost && (
          <div className="comments-panel">
            <div className="comments-header">
              <h3>Comments</h3>
              <button
                className="close-comments"
                onClick={() => setActiveCommentPost(null)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="post-preview">
              {/* Find post by id or _id */}
              {(() => {
                const post = posts.find(p => (p._id || p.id) === activeCommentPost);
                if (!post) return null;
                
                return (
                  <>
                    <div className="post-user">
                      <div className="user-avatar">
                        <FaRegUser />
                      </div>
                      <div className="user-info">
                        <span className="username">{post.author}</span>
                        <span className="post-time">{post.time}</span>
                      </div>
                    </div>
                    <p className="post-text-preview">
                      {post.content?.substring(0, 100)}
                      {post.content?.length > 100 ? "..." : ""}
                    </p>
                  </>
                );
              })()}
            </div>

            <div className="comments-list">
              {comments[activeCommentPost]?.map((comment) => (
                <div key={comment._id} className="comment">
                  <div className="comment-header">
                    <div className="post-user">
                      <div className="user-avatar">
                        <FaRegUser />
                      </div>
                      <div className="user-info">
                        <span className="username">{comment.author}</span>
                        <span className="post-time">{comment.time}</span>
                      </div>
                    </div>
                  </div>
                  <p className="comment-text">{comment.content}</p>
                </div>
              ))}
            </div>

            <form className="comment-form" onSubmit={handleCommentSubmit}>
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={handleCommentChange}
                className="comment-input"
              />
              <button
                type="submit"
                className="post-comment-btn"
                disabled={newComment.trim() === ""}
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;