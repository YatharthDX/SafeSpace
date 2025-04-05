import React from "react";
import { FaRegUser, FaTimes } from "react-icons/fa";

const CommentSection = ({ 
  activeCommentPost, 
  posts, 
  comments, 
  avatars, 
  newComment, 
  handleCommentChange, 
  handleCommentSubmit, 
  closeComments 
}) => {
  const post = posts.find(p => (p._id || p.id) === activeCommentPost);
  if (!post) return null;
  
  const authorAvatar = avatars[post.author_id];

  return (
    <div className={`comments-panel ${activeCommentPost ? 'open' : ''}`}>
      <div className="comments-header">
        <h3>Comments</h3>
        <button
          className="close-comments"
          onClick={closeComments}
        >
          <FaTimes />
        </button>
      </div>

      <div className="post-preview">
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
      </div>

      <div className="comments-list">
        {comments[activeCommentPost]?.map((comment) => {
          const commentAvatar = avatars[comment.author_id];
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
  );
};

export default CommentSection;