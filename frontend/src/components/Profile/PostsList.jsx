import React, { useState, useEffect } from 'react';
import { FaRegUser, FaTrashAlt, FaTimes } from 'react-icons/fa';

// Custom delete confirmation modal component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, postTitle }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Delete Post</h3>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-content">
          <p>Are you sure you want to delete this post?</p>
          {postTitle && <p className="post-preview">"{postTitle}"</p>}
          <p className="warning-text">This action cannot be undone.</p>
        </div>
        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const PostsList = ({ posts, onDeletePost }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  // Update the current time every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  // Function to parse specific date format: "23/03/2025, 22:46:07"
  const parsePostTime = (timeString) => {
    // Extract parts from "DD/MM/YYYY, HH:MM:SS" format
    const [datePart, timePart] = timeString.split(', ');
    if (!datePart || !timePart) return null;
    
    const [day, month, year] = datePart.split('/');
    const [hours, minutes, seconds] = timePart.split(':');
    
    // Note: months in JavaScript Date are 0-indexed (0-11)
    return new Date(year, month - 1, day, hours, minutes, seconds);
  };

  // Function to calculate time difference
  const getTimeAgo = (postTime) => {
    if (!postTime) return "Unknown time";
    
    // Parse the specific format
    const postDate = parsePostTime(postTime);
    
    // If parsing failed, return the original string
    if (!postDate || isNaN(postDate.getTime())) {
      return postTime;
    }

    const diffMs = currentTime - postDate;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return "Just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 30) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      // For older posts, show the actual date
      return postDate.toLocaleDateString();
    }
  };

  // Updated delete handler to open modal instead
  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      onDeletePost(postToDelete.id);
      setModalOpen(false);
      setPostToDelete(null);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setPostToDelete(null);
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
                  <span className="post-time">{getTimeAgo(post.time)}</span>
                </div>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDeleteClick(post)}
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

      {/* Custom delete confirmation modal */}
      <DeleteConfirmationModal 
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        postTitle={postToDelete?.title || postToDelete?.content?.substring(0, 50)}
      />
    </div>
  );
};

export default PostsList;