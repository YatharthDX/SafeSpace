import React, { useState, useEffect } from "react";
import {
  FaRegUser,
  FaRegComment,
  FaHeart,
  FaRegHeart,
  FaShareAlt,
  FaPlus,
  FaTimes,
  FaFlag,
} from "react-icons/fa";
import Navbar from "../components/Public/navbar";
import ReportModal from "../components/Posts/ReportModal"; // Import the new ReportModal component
import "../css/Home.css";
import { useNavigate } from "react-router-dom";
import { getPosts, likePost, unlikePost, getComments, addComment, getUserLikedPosts } from "../api/posts";
import { getCurrentUser } from "../chat-services/pyapi";
import { classifyText } from "../api/posts";
import { jwtDecode } from "jwt-decode";

const avatarImages = {
  1: () => import('../assets/1.png'),
  2: () => import('../assets/2.png'),
  3: () => import('../assets/3.png'),
  4: () => import('../assets/4.png'),
  5: () => import('../assets/5.png'),
  6: () => import('../assets/6.png'),
  7: () => import('../assets/7.png'),
  8: () => import('../assets/8.png'),
  9: () => import('../assets/9.png'),
  10: () => import('../assets/10.png')
};

const Home = () => {
  const [avatars, setAvatars] = React.useState({});
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allTags, setAllTags] = useState([]);
  const current_user = localStorage.getItem('token');
  const current_user_json = jwtDecode(current_user);
  const current_user_role = current_user_json.role;
  // State for selected tags
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [newComment, setNewComment] = useState("");

  const HandleCreate = () => {
    navigate("/createpost");
  };

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

  useEffect(() => {
    fetchPosts();
  }, [selectedTags, searchText]);

  const fetchAvatar = async (authorId) => {
    try {
      const token = localStorage.getItem("token");
      console.log(`Fetching avatar for author ${authorId} with token: ${token ? 'present' : 'missing'}`);
      const response = await fetch(
        `http://127.0.0.1:8000/api/auth/get-avatar/?id=${authorId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        console.error(`Avatar fetch failed for ${authorId}: ${response.status}`);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      // Assuming the API returns an object like { avatar: 1 } or { avatar_number: 1 }
      // Adjust the key based on your actual API response structure
      const avatarNumber = data.avatar || data.avatar_number || data.number || 1; // Fallback to 1 if no valid number
      console.log(`Avatar fetch for author ${authorId}: number ${avatarNumber} (raw data: ${JSON.stringify(data)})`);
      
      if (avatarNumber && avatarImages[avatarNumber]) {
        const avatarModule = await avatarImages[avatarNumber]();
        console.log(`Avatar module loaded for ${authorId}: ${avatarModule.default}`);
        return avatarModule.default;
      }
      console.log(`No avatar found for ${authorId} - invalid number: ${avatarNumber}`);
      return null;
    } catch (error) {
      console.error(`Error fetching avatar for ${authorId}:`, error);
      return null;
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      const currentUser = await getCurrentUser();
      let likedPostIds = [];
      if (currentUser) {
        likedPostIds = await getUserLikedPosts();
        setLikedPosts(new Set(likedPostIds));
      }

      let fetchedPosts;
      if (selectedTags.length > 0 || searchText) {
        const tagsParam = selectedTags.join(',');
        const url = `http://127.0.0.1:8000/search_blog/search-get/?text=${encodeURIComponent(searchText)}&tags=${encodeURIComponent(tagsParam)}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Search request failed');
        }
        
        fetchedPosts = await response.json();
      } else {
        fetchedPosts = await getPosts();
      }
      
      const updatedPosts = fetchedPosts.map(post => ({
        ...post,
        isLiked: likedPostIds.includes(post._id || post.id)
      }));
      
      setPosts(updatedPosts);

      const uniqueAuthorIds = [...new Set(updatedPosts.map(post => post.author_id))];
      const avatarPromises = uniqueAuthorIds.map(async (authorId) => {
        const avatarSrc = await fetchAvatar(authorId);
        return { authorId, avatarSrc };
      });
      
      const avatarResults = await Promise.all(avatarPromises);
      const newAvatars = avatarResults.reduce((acc, { authorId, avatarSrc }) => {
        if (avatarSrc) acc[authorId] = avatarSrc;
        return acc;
      }, {});
      console.log('Updated avatars state:', newAvatars);
      setAvatars(prev => ({ ...prev, ...newAvatars }));

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

  const handleSearch = (text, tags) => {
    setSearchText(text);
    if (tags && tags.length > 0) {
      setSelectedTags(prevTags => {
        if (prevTags.includes(tags[0])) {
          return prevTags;
        }
        return [...prevTags, ...tags];
      });
    }
  };

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

  const toggleCommentSection = async (postId) => {
    if (activeCommentPost === postId) {
      setActiveCommentPost(null);
    } else {
      setActiveCommentPost(postId);
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

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    try {
      const classifyData = {
        text: newComment
      }
      const classification = await classifyText(classifyData);
      if (classification === "HATE") {
        alert("Please refrain from using hate speech in your comment");
        return;
      }

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
      
      setNewComment("");
    } catch (err) {
      setError(err.message || "Failed to add comment. Please try again.");
    }
  };
  
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
    <div className="home-container">
      <Navbar onSearch={handleSearch} />

      {/* Report Modal */}
      <ReportModal 
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setSelectedPostForReport(null);
        }}
        onSubmit={submitReport}
      />

      <div className="home-main-content">
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

          <button className="create-post-btn" onClick={HandleCreate}>
            <FaPlus className="plus-icon" />
            <span>Create Post</span>
          </button>
        </div>

        <div className={`posts-container ${!activeCommentPost ? 'comments-closed' : ''}`}>
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
              const authorAvatar = avatars[post.author_id];
              console.log(`Rendering post ${postId} - Avatar available: ${!!authorAvatar}`);

              return (
                <div key={postId} className="post">
                  <div className="post-header">
                    <div className="post-user">
                      <div className="user-avatar">
                        {authorAvatar ? (
                          <img src={authorAvatar} alt="User avatar" className="avatar-image" />
                        ) : (
                          <FaRegUser />
                        )}
                      </div>
                      <div className="user-info">
                        <span className="username">{post.author}</span>
                        <span className="post-time">{post.time}</span>
                      </div>
                    </div>
                    {/* Report button added to post header */}
                    <button
                      className="action-button report-button"
                      onClick={() => handleReportPost(postId)}
                    >
                      <FaFlag />
                    </button>
                  </div>

                  <div className="post-content">
                    {post.title && <h3 className="post-title">{post.title}</h3>}
                    <p className="post-text">{post.content}</p>
                    {post.image && post.image.trim() !== "" && (
                      <img src={post.image} alt="Post" className="post-image" />
                    )}
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
                    
                    {(((post.relevance_tags || post.relevant_relevance_tags || [] ).length > 0)||(post.severity_tag !== "")) && (
                      <div className="post-tags">
                        {(post.relevance_tags || post.relevant_relevance_tags || []).map((relevance_tag, index) => (
                          <span 
                            key={index}
                            className="tag"
                          >
                            {relevance_tag}
                          </span>
                        ))}
                        {(post.severity_tag !== "" && current_user_role !=="student") && (
                          <span className="tag"
                          style={{backgroundColor:post.severity_tag === "moderate" ? "orange" : post.severity_tag === "severe" ? "red" : "yellow"}}>
                            {post.severity_tag}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {activeCommentPost && (
          <div className={`comments-panel ${activeCommentPost ? 'open' : ''}`}>
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
              {(() => {
                const post = posts.find(p => (p._id || p.id) === activeCommentPost);
                if (!post) return null;
                const authorAvatar = avatars[post.author_id];
                
                return (
                  <>
                    <div className="post-user">
                      <div className="user-avatar">
                        {authorAvatar ? (
                          <img src={authorAvatar} alt="User avatar" className="avatar-image" />
                        ) : (
                          <FaRegUser />
                        )}
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
              {comments[activeCommentPost]?.map((comment) => {
                const commentAvatar = avatars[comment.author_id];
                console.log(`Rendering comment ${comment._id} - Avatar available: ${!!commentAvatar}`);
                return (
                  <div key={comment._id} className="comment">
                    <div className="comment-header">
                      <div className="post-user">
                        <div className="user-avatar">
                          {commentAvatar ? (
                            <img src={commentAvatar} alt="User avatar" className="avatar-image" />
                          ) : (
                            <FaRegUser />
                          )}
                        </div>
                        <div className="user-info">
                          <span className="username">{comment.author}</span>
                          <span className="post-time">{comment.time}</span>
                        </div>
                      </div>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                  </div>
                );
              })}
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