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
// import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Popular tags list
  const popularTags = [
    "anxiety", "depression", "stress", "academic", "social",
    "relationships", "family", "health", "career"
  ];
  
  // State for selected tags
  const [selectedTags, setSelectedTags] = useState([]);

  // State for liked posts
  const [likedPosts, setLikedPosts] = useState(new Set());

  // State for active comment section
  const [activeCommentPost, setActiveCommentPost] = useState(null);

  // State for comment input
  const [newComment, setNewComment] = useState("");

  // const { isAuthenticated } = useAuth();

  const HandleCreate = () => {
    navigate("/createpost");
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      // First get the current user and their liked posts
      const currentUser = await getCurrentUser();
      let likedPostIds = [];
      if (currentUser) {
        console.log("currentUser",currentUser)
        likedPostIds = await getUserLikedPosts();
        setLikedPosts(new Set(likedPostIds));
      }

      // Then fetch all posts
      const fetchedPosts = await getPosts();
      
      // Update posts with correct likes count and liked state
      const updatedPosts = fetchedPosts.map(post => ({
        ...post,
        isLiked: likedPostIds.includes(post._id)
      }));
      
      setPosts(updatedPosts);

      // Initialize comments state for each post
      const commentsState = {};
      for (const post of updatedPosts) {
        const postComments = await getComments(post._id);
        commentsState[post._id] = postComments;
      }
      setComments(commentsState);
    } catch (err) {
      setError(err.message || "Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
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
        prevPosts.map(post =>
          post._id === postId
            ? {
                ...post,
                likes: likedPosts.has(postId) ? post.likes - 1 : post.likes + 1
              }
            : post
        )
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
        author: currentUser.name, // This should come from auth context
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
      {/* Navbar will be included from your existing components */}
      <Navbar />

      <div className="home-main-content">
        {/* Left sidebar with popular tags and create post button */}
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
              <h2>Popular Tags</h2>
            </div>

            <div className="tags-list">
              {popularTags.map((tag, index) => (
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
          {posts.map((post) => (
            <div key={post._id} className="post">
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
                      likedPosts.has(post._id) ? "active" : ""
                    }`}
                    onClick={() => toggleLike(post._id)}
                  >
                    {likedPosts.has(post._id) ? <FaHeart /> : <FaRegHeart />}
                  </button>
                  <button
                    className={`action-button ${
                      activeCommentPost === post._id ? "active" : ""
                    }`}
                    onClick={() => toggleCommentSection(post._id)}
                  >
                    <FaRegComment />
                  </button>
                  {/* <button className="action-button">
                    <FaShareAlt />
                  </button> */}
                </div>
                {post.relevance_tags && post.relevance_tags.length > 0 && (
                  <div className="post-tags">
                    {post.relevance_tags.map((relevance_tag, index) => (
                      <span 
                        key={index} 
                        className="tag"
                      >
                        {relevance_tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Comment Section (Instagram-style) */}
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
              <div className="post-user">
                <div className="user-avatar">
                  <FaRegUser />
                </div>
                <div className="user-info">
                  <span className="username">
                    {
                      posts.find((post) => post._id === activeCommentPost)
                        ?.author
                    }
                  </span>
                  <span className="post-time">
                    {posts.find((post) => post._id === activeCommentPost)?.time}
                  </span>
                </div>
              </div>
              <p className="post-text-preview">
                {posts
                  .find((post) => post._id === activeCommentPost)
                  ?.content.substring(0, 100)}
                {posts.find((post) => post._id === activeCommentPost)?.content
                  .length > 100
                  ? "..."
                  : ""}
              </p>
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