import React from "react";
import {
  FaRegUser,
  FaRegComment,
  FaHeart,
  FaRegHeart,
  FaFlag,
} from "react-icons/fa";

const Post = ({ 
  post, 
  avatars, 
  likedPosts, 
  activeCommentPost, 
  toggleLike, 
  toggleCommentSection, 
  handleReportPost,
  currentUserRole 
}) => {
  const postId = post._id || post.id;
  const authorAvatar = avatars[post.author_id];

  return (
    <div className="post">
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
        
        {(((post.relevance_tags || post.relevant_relevance_tags || []).length > 0) || (post.severity_tag !== "")) && (
          <div className="post-tags">
            {(post.relevance_tags || post.relevant_relevance_tags || []).map((relevance_tag, index) => (
              <span 
                key={index}
                className="tag"
              >
                {relevance_tag}
              </span>
            ))}
            {(post.severity_tag !== "" && currentUserRole !== "student") && (
              <span className="tag"
              style={{backgroundColor: post.severity_tag === "moderate" ? "orange" : post.severity_tag === "severe" ? "red" : "yellow"}}>
                {post.severity_tag}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;