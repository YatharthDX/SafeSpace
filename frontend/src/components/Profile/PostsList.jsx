import React, { useState } from 'react';
import { FaRegUser, FaRegHeart, FaHeart, FaRegComment, FaShareAlt, FaTrashAlt, FaTimes } from 'react-icons/fa';

const PostsList = ({ posts, onDeletePost }) => {
  // Sample comments data - In a real app, this would likely come from props or an API
  const sampleComments = {
    1: [
      {
        id: 1,
        author: "Helpful Panda",
        time: "2 hours ago",
        content: "Make sure to take breaks between study sessions! It really helps."
      },
      {
        id: 2,
        author: "Caring Cat",
        time: "1 hour ago",
        content: "I went through the same thing last semester. Remember to hydrate and get some sleep!"
      }
    ],
    2: [
      {
        id: 1,
        author: "Happy Penguin",
        time: "45 minutes ago",
        content: "Same feeling here!"
      }
    ],
    3: [
      {
        id: 1,
        author: "Friendly Owl",
        time: "10 hours ago",
        content: "Have you tried joining some campus clubs? That really helped me when I was feeling homesick."
      },
      {
        id: 2,
        author: "Gentle Fox",
        time: "8 hours ago",
        content: "Schedule regular video calls with your family. It makes a big difference!"
      }
    ]
  };

  const [likedPosts, setLikedPosts] = useState({});
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [newComment, setNewComment] = useState("");

  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const toggleCommentSection = (postId) => {
    if (activeCommentPost === postId) {
      setActiveCommentPost(null);
    } else {
      setActiveCommentPost(postId);
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    // In a real app, you would send this to your API
    console.log(`New comment on post ${activeCommentPost}: ${newComment}`);

    // Clear the input
    setNewComment("");
  };
  
  const handleDelete = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDeletePost(postId);
    }
  };

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <p>no posts yet</p>
      </div>
    );
  }

  return (
    <div className={`posts-section ${activeCommentPost ? "with-comments-open" : ""}`}>
      <div className="appointments-header">
        <h2>My Posts</h2>
        <div className="appointment-count">{posts.length} posts</div>
      </div>
      
      <div className="posts-container">
        {posts.map((post) => (
          <div key={post.id} className="post">
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
              <button
                className="delete-button"
                onClick={() => handleDelete(post.id)}
                aria-label="Delete post"
              >
                <FaTrashAlt />
              </button>
            </div>

            <div className="post-content">
              {post.title && <h3 className="post-title">{post.title}</h3>}
              <p className="post-text">{post.content}</p>
            </div>

            <div className="post-footer">
              <div className="post-actions">
                <button
                  className={`action-button ${
                    likedPosts[post.id] ? "active" : ""
                  }`}
                  onClick={() => toggleLike(post.id)}
                >
                  {likedPosts[post.id] ? <FaHeart /> : <FaRegHeart />}
                </button>
                <button
                  className={`action-button ${
                    activeCommentPost === post.id ? "active" : ""
                  }`}
                  onClick={() => toggleCommentSection(post.id)}
                >
                  <FaRegComment />
                </button>
                {/* <button className="action-button">
                  <FaShareAlt />
                </button> */}
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
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
                    posts.find((post) => post.id === activeCommentPost)
                      ?.author
                  }
                </span>
                <span className="post-time">
                  {posts.find((post) => post.id === activeCommentPost)?.time}
                </span>
              </div>
            </div>
            <p className="post-text-preview">
              {posts
                .find((post) => post.id === activeCommentPost)
                ?.content.substring(0, 100)}
              {posts.find((post) => post.id === activeCommentPost)?.content
                .length > 100
                ? "..."
                : ""}
            </p>
          </div>

          <div className="comments-list">
            {sampleComments[activeCommentPost]?.map((comment) => (
              <div key={comment.id} className="comment">
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
            {!sampleComments[activeCommentPost] && (
              <div className="no-comments">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
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
  );
};

export default PostsList;