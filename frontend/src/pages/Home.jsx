import React, { useState } from "react";
import {
  FaRegUser,
  FaRegComment,
  FaRegHeart,
  FaHeart,
  FaShareAlt,
  FaPlus,
} from "react-icons/fa";
import Navbar from "../components/Public/navbar";
import "../css/Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  // Sample posts data based on your screenshot
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

  const HandleCreate = () => {
    navigate("/createpost");
  };
  // State for liked posts
  const [likedPosts, setLikedPosts] = useState({});

  // Toggle like function
  const toggleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div className="home-container">
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
                <div key={index} className="tag-item">
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
    </div>
  );
};

export default Home;
