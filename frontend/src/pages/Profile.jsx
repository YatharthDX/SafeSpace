import React, { useState, useEffect } from "react";
import Navbar2 from "../components/Public/navbar2";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileHeaderCounselor from "../components/Profile/ProfileHeaderCounselor";
import ProfileTabs from "../components/Profile/ProfileTabs";
import PostsList from "../components/Profile/PostsList";
import AppointmentsList from "../components/Profile/AppointmentsList";
import "../css/profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [hasRequestedRole, setHasRequestedRole] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [postsError, setPostsError] = useState(null);
  const [userDetails, setUserDetails] = useState({
    username: "Loading...",
    profile_picture: null,
    _id: null
  });

  // Fetch user details on component mount
  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Fetch posts when tab changes to posts or when user details are loaded
  useEffect(() => {
    if (activeTab === "posts" && userDetails._id) {
      fetchUserPosts(userDetails._id);
    }
  }, [activeTab, userDetails._id]);

  // Fetch appointments when tab changes to appointments
  useEffect(() => {
    if (activeTab === "appointments") {
      fetchAppointments();
    }
  }, [activeTab]);

  const fetchUserDetails = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You need to be logged in to view profile");
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/getuserdetails",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setUserDetails(data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      
      if (error.message.includes("401") || error.message.includes("403")) {
        setError("Authentication error. Please log in again.");
      } else if (error.name === "TypeError") {
        setError("No response from server. Please check your connection.");
      } else {
        setError("Failed to load user details. Please try again later.");
      }
    }
  };

  const fetchUserPosts = async (userId) => {
    setPostsLoading(true);
    setPostsError(null);
    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setPostsError("You need to be logged in to view posts");
        setPostsLoading(false);
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/blogs/user/${userId}/blogs`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      // Transform the backend data to match our frontend structure
      const formattedPosts = data.map(post => ({
        id: post._id,
        author: userDetails.username, // Use the username from user details
        time: new Date(post.created_at).toLocaleString(), // Format the date
        title: post.title,
        content: post.content,
        tags: post.tags || [],
      }));

      setPosts(formattedPosts);
    } catch (error) {
      console.error("Error fetching user posts:", error);

      // Handle specific error cases
      if (error.message.includes("401") || error.message.includes("403")) {
        setPostsError("Authentication error. Please log in again.");
      } else if (error.name === "TypeError") {
        setPostsError("No response from server. Please check your connection.");
      } else {
        setPostsError("Failed to load posts. Please try again later.");
      }
    } finally {
      setPostsLoading(false);
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You need to be logged in to view appointments");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/appointments/getappointments",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Transform the backend data to match our frontend structure
      const formattedAppointments = data.map((appointment) => ({
        id: appointment._id,
        time: appointment.time_slot,
        doctor: appointment.counselor_email,
        date: new Date(appointment.date).toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          weekday: "long",
        }),
        description: appointment.description || "No description provided",
        contact_no: appointment.contact_no,
        status: appointment.status || "pending",
      }));

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);

      // Handle specific error cases
      if (error.message.includes("401") || error.message.includes("403")) {
        setError("Authentication error. Please log in again.");
      } else if (error.name === "TypeError") {
        setError("No response from server. Please check your connection.");
      } else {
        setError("Failed to load appointments. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("You need to be logged in to delete posts");
        return;
      }
      
      // Implement the API call to delete the post
      // This is a placeholder - update with your actual API endpoint
      
      const response = await fetch(
        `http://127.0.0.1:8000/blogs/blogs/${postId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      
      // For now, just update the UI
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  return (
    <div className="profile-page">
      <Navbar2 />

      <div className="profile-container">
        {userDetails.role === "counsellor" ? (
          <ProfileHeaderCounselor
            username={userDetails.username}
            profilePicture={userDetails.profile_picture}
          />
        ) : (
          <ProfileHeader
            username={userDetails.username}
            profilePicture={userDetails.profile_picture}
          />
        )}


        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} userRole={userDetails.role} />

        <div className="profile-content">
          {activeTab === "posts" ? (
            <>
              {postsLoading ? (
                <div className="loading-indicator">Loading posts...</div>
              ) : postsError ? (
                <div className="error-message">{postsError}</div>
              ) : posts.length === 0 ? (
                <div className="empty-state">
                  No posts found. Your blog posts will appear here.
                </div>
              ) : (
                <PostsList posts={posts} onDeletePost={handleDeletePost} />
              )}
            </>
          ) : (
            <>
              {loading ? (
                <div className="loading-indicator">Loading appointments...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : appointments.length === 0 ? (
                <div className="empty-state">
                  No appointments found. Your appointments will appear here.
                </div>
              ) : (
                <AppointmentsList appointments={appointments} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;