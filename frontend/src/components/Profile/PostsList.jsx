import React, { useState } from 'react';
import { FaRegUser, FaRegHeart, FaHeart, FaRegComment, FaShareAlt, FaTrashAlt } from 'react-icons/fa';

const PostsList = ({ posts, onDeletePost }) => {
  const [likedPosts, setLikedPosts] = useState({});

  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
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
    <div className="posts-section">
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
                <button className="action-button">
                  <FaRegComment />
                </button>
                <button className="action-button">
                  <FaShareAlt />
                </button>
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
    </div>
  );
};

export default PostsList;