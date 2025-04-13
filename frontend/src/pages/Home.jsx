import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import Navbar from "../components/Public/navbar";
import ReportModal from "../components/Posts/ReportModal";
import Post from "../components/Posts/PostsContainer"; // Import the new Post component
import CommentSection from "../components/Posts/CommentSection"; // Import the new CommentSection component
import "../css/Home.css";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  getPosts,
  likePost,
  unlikePost,
  getComments,
  addComment,
  getUserLikedPosts,
} from "../api/posts";
import { getCurrentUser } from "../chat-services/pyapi";
import { classifyText } from "../api/posts";
import { jwtDecode } from "jwt-decode";
import { useRef } from "react";

const avatarImages = {
  1: () => import("../assets/1.png"),
  2: () => import("../assets/2.png"),
  3: () => import("../assets/3.png"),
  4: () => import("../assets/4.png"),
  5: () => import("../assets/5.png"),
  6: () => import("../assets/6.png"),
  7: () => import("../assets/7.png"),
  8: () => import("../assets/8.png"),
  9: () => import("../assets/9.png"),
  10: () => import("../assets/10.png"),
};

const Home = () => {
  const [avatars, setAvatars] = React.useState({});
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allTags, setAllTags] = useState([]);
  const current_user = localStorage.getItem("token");
  const current_user_json = jwtDecode(current_user);
  const current_user_role = current_user_json.role;
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedPostForReport, setSelectedPostForReport] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [skip, setSkip] = useState(0); // How many posts to skip
  const [limit] = useState(10); // Posts per fetch
  const [hasMore, setHasMore] = useState(true); // If there are more posts to load
  const containerRef = useRef(null);
  const observerRef = useRef(null);

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
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const avatarNumber =
        data.avatar || data.avatar_number || data.number || 1;

      if (avatarNumber && avatarImages[avatarNumber]) {
        const avatarModule = await avatarImages[avatarNumber]();
        return avatarModule.default;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching avatar for ${authorId}:`, error);
      return null;
    }
  };

  const fetchPosts = async (append = false) => {
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
        const tagsParam = selectedTags.join(",");
        const url = `http://127.0.0.1:8000/search_blog/search-get/?text=${encodeURIComponent(
          searchText
        )}&tags=${encodeURIComponent(tagsParam)}`;
        const response = await fetch(url);
        // console.log("Response from search:", response);
        if (!response.ok) throw new Error("Search request failed");
        fetchedPosts = await response.json();
        console.log("Fetched posts from search:", fetchedPosts);

        // When searching, no pagination
        setHasMore(false);
      } else {
        const result = await getPosts(skip, limit);
        fetchedPosts = result;

        // If fewer results than limit, assume no more posts
        if (result.length < limit) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        // Only increase skip if appending
        if (!append) {
          // First fetch — reset skip to 10 after loading initial posts
          setSkip(limit);
        } else {
          setSkip((prev) => prev + limit);
        }
      }

      const updatedPosts = fetchedPosts.map((post) => ({
        ...post,
        isLiked: likedPostIds.includes(post._id || post.id),
      }));

      // Append or replace posts
      setPosts((prevPosts) =>
        append ? [...prevPosts, ...updatedPosts] : updatedPosts
      );

      const uniqueAuthorIds = [
        ...new Set(updatedPosts.map((post) => post.author_id)),
      ];
      const avatarPromises = uniqueAuthorIds.map(async (authorId) => {
        const avatarSrc = await fetchAvatar(authorId);
        return { authorId, avatarSrc };
      });

      const avatarResults = await Promise.all(avatarPromises);
      const newAvatars = avatarResults.reduce(
        (acc, { authorId, avatarSrc }) => {
          if (avatarSrc) acc[authorId] = avatarSrc;
          return acc;
        },
        {}
      );
      setAvatars((prev) => ({ ...prev, ...newAvatars }));

      const commentsState = {};
      for (const post of updatedPosts) {
        const postId = post._id || post.id;
        const postComments = await getComments(postId);
        commentsState[postId] = postComments;
      }
      setComments((prev) => ({ ...prev, ...commentsState }));
    } catch (err) {
      setError(err.message || "Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = () => {
    if (!loading && hasMore && !searchText && selectedTags.length === 0) {
      fetchPosts(true); // append = true
    }
  };

  useEffect(() => {
    if (loading || searchText || selectedTags.length > 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMorePosts();
        }
      },
      {
        root: containerRef.current, // 👈 observe within the container
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    const current = observerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [posts, loading, searchText, selectedTags, hasMore]);

  const handleSearch = (text, tags) => {
    setSearchText(text);
    if (tags && tags.length > 0) {
      setSelectedTags((prevTags) => {
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
        setLikedPosts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          return newSet;
        });
      } else {
        await likePost(postId);
        setLikedPosts((prev) => new Set([...prev, postId]));
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          const currentPostId = post._id || post.id;
          return currentPostId === postId
            ? {
                ...post,
                likes: likedPosts.has(postId) ? post.likes - 1 : post.likes + 1,
              }
            : post;
        })
      );
    } catch (err) {
      setError(
        err.message || "Failed to update like status. Please try again."
      );
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
          setComments((prev) => ({ ...prev, [postId]: postComments }));
        } catch (err) {
          setError(
            err.message || "Failed to fetch comments. Please try again."
          );
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
        text: newComment,
      };
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
      const updatedComments = await getComments(activeCommentPost);
      setComments((prev) => ({
        ...prev,
        [activeCommentPost]: updatedComments,
      }));
      setNewComment("");
    } catch (err) {
      setError(err.message || "Failed to add comment. Please try again.");
    }
  };

  const toggleTagSelection = (tag) => {
    setSelectedTags((prevSelectedTags) => {
      if (prevSelectedTags.includes(tag)) {
        return prevSelectedTags.filter((t) => t !== tag);
      } else {
        return [...prevSelectedTags, tag];
      }
    });
  };

  const handleReportPost = (postId) => {
    setSelectedPostForReport(postId);
    setIsReportModalOpen(true);
  };

  const submitReport = async (reportData) => {
    if (!selectedPostForReport) {
      alert("Error: No post selected for reporting.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const currentUser = await getCurrentUser();
      const reportedPost = posts.find(
        (p) => (p._id || p.id) === selectedPostForReport
      );

      const payload = {
        blog_id: selectedPostForReport,
        reported_author_id: reportedPost?.author_id || "",
        reported_author_name: reportedPost?.author || "",
        reporter_email: currentUser?.email || current_user_json.email,
        reason: reportData.title,
        description: reportData.body || "",
      };

      console.log("Submitting report with payload:", payload);

      const response = await fetch("http://127.0.0.1:8000/blogs/report-blog/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert(`Error: ${result.detail || "Failed to submit report"}`);
      }
    } catch (error) {
      console.error("Report submission error:", error);
      alert("Failed to submit the report. Please try again.");
    }
  };

  const closeComments = () => {
    setActiveCommentPost(null);
  };

  return (
    <div className="home-container">
      <Navbar onSearch={handleSearch} />

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
                  className={`tag-item ${
                    selectedTags.includes(tag) ? "active" : ""
                  }`}
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

        <div className="posts-container comments-closed" id="posts-container">
          {loading && posts.length === 0 ? (
            <div className="loading-indicator">Loading posts...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : posts.length === 0 ? (
            <div className="no-posts-message">
              No posts found. Try different search criteria or create a new
              post!
            </div>
          ) : (
            <InfiniteScroll
              dataLength={posts.length}
              next={loadMorePosts}
              hasMore={hasMore}
              loader={
                <div className="loading-indicator">Loading more posts...</div>
              }
              scrollableTarget="posts-container"
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>No more posts to load.</b>
                </p>
              }
            >
              {posts.map((post) => (
                <Post
                  key={post._id || post.id}
                  post={post}
                  avatars={avatars}
                  likedPosts={likedPosts}
                  activeCommentPost={activeCommentPost}
                  toggleLike={toggleLike}
                  toggleCommentSection={toggleCommentSection}
                  handleReportPost={handleReportPost}
                  currentUserRole={current_user_role}
                />
              ))}
            </InfiniteScroll>
          )}
        </div>

        {activeCommentPost && (
          <CommentSection
            activeCommentPost={activeCommentPost}
            posts={posts}
            comments={comments}
            avatars={avatars}
            newComment={newComment}
            handleCommentChange={handleCommentChange}
            handleCommentSubmit={handleCommentSubmit}
            closeComments={closeComments}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
