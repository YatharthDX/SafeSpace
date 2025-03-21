import React, { useState } from "react";
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

const Home = () => {
  const posts = [
    {
      id: 1,
      author: "Single Sock",
      time: "3 hours ago",
      title: "4 exams in 3 days, I'm exhausted.",
      content:
        "I'm completely drained. I've been studying non-stop for the past week, trying to prepare for four exams that are scheduled within three days. No matter how much I study, I feel like I'm not ready and it's making me anxious. I can't sleep properly and when I do I just dream about the exams. I'm worried I'll burn out before I even get through them all.",
      tags: ["tag 3", "tag 8"],
    },
    {
      id: 2,
      author: "Playful Raccoon",
      time: "1 hour ago",
      title: "",
      content: "us bhai us",
      tags: [],
    },
    {
      id: 3,
      author: "Skipping Stone",
      time: "17 hours ago",
      title: "Feeling homesick.",
      content:
        "Ever since I came to college I miss my family, friends back home and even the little things like meals together. It's hard to focus on classes or make new friends because I keep thinking about how much I wish I were home. I thought it would get better with time, but it hasn't and I feel really alone.",
      tags: ["tag 1"],
    },
  ];

  // Sample comments data
  const sampleComments = {
    1: [
      {
        id: 1,
        author: "Helpful Panda",
        time: "2 hours ago",
        content:
          "Make sure to take breaks between study sessions! It really helps.",
      },
      {
        id: 2,
        author: "Caring Cat",
        time: "1 hour ago",
        content:
          "I went through the same thing last semester. Remember to hydrate and get some sleep!",
      },
    ],
    2: [
      {
        id: 1,
        author: "Happy Penguin",
        time: "45 minutes ago",
        content: "Same feeling here!",
      },
    ],
    3: [
      {
        id: 1,
        author: "Friendly Owl",
        time: "10 hours ago",
        content:
          "Have you tried joining some campus clubs? That really helped me when I was feeling homesick.",
      },
      {
        id: 2,
        author: "Gentle Fox",
        time: "8 hours ago",
        content:
          "Schedule regular video calls with your family. It makes a big difference!",
      },
      {
        id: 3,
        author: "Wise Turtle",
        time: "5 hours ago",
        content:
          "It takes time to adjust, but it does get better. Hang in there!",
      },
      {
        id: 4,
        author: "Wise Turtle",
        time: "5 hours ago",
        content:
          "It takes time to adjust, but it does get better. Hang in there!",
      },
      {
        id: 5,
        author: "Wise Turtle",
        time: "5 hours ago",
        content:
          "It takes time to adjust, but it does get better. Hang in there!",
      },
      {
        id: 6,
        author: "Wise Turtle",
        time: "5 hours ago",
        content:
          "It takes time to adjust, but it does get better. Hang in there!",
      },
    ],
  };

  const navigate = useNavigate();
  // Popular tags list
  const popularTags = [
    "tag 1",
    "tag 2",
    "tag 3",
    "tag 4",
    "tag 5",
    "tag 6",
    "tag 7",
    "tag 8",
    "tag 9",
  ];
  
  // State for selected tags
  const [selectedTags, setSelectedTags] = useState([]);

  const HandleCreate = () => {
    navigate("/createpost");
  };

  // State for liked posts
  const [likedPosts, setLikedPosts] = useState({});

  // State for active comment section
  const [activeCommentPost, setActiveCommentPost] = useState(null);

  // State for comment input
  const [newComment, setNewComment] = useState("");

  // Toggle like function
  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Toggle comment section
  const toggleCommentSection = (postId) => {
    if (activeCommentPost === postId) {
      setActiveCommentPost(null);
    } else {
      setActiveCommentPost(postId);
    }
  };

  // Handle comment input change
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    // In a real app, you would send this to your API
    console.log(`New comment on post ${activeCommentPost}: ${newComment}`);

    // Clear the input
    setNewComment("");
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
                      <span 
                        key={index} 
                        className="tag"
                      >
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