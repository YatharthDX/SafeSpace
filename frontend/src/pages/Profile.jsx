import React, { useState, useEffect } from "react";
import Navbar2 from "../components/Public/navbar2";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileTabs from "../components/Profile/ProfileTabs";
import PostsList from "../components/Profile/PostsList";
import AppointmentsList from "../components/Profile/AppointmentsList";
import "../css/profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [hasRequestedRole, setHasRequestedRole] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState({
    username: "Loading...",
    profile_picture: null
  });

  // Sample posts data
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Playful Raccoon",
      time: "2 hours ago",
      title: "My healthcare journey",
      content:
        "Just had a great appointment with Dr. Smith. The new treatment plan looks promising!",
      tags: ["healthcare", "wellness"],
    },
    {
      id: 2,
      author: "Playful Raccoon",
      time: "2 days ago",
      content: "Does anyone have recommendations for good nutrition resources?",
      tags: ["nutrition", "advice"],
    },
  ]);

  // Fetch user details on component mount
  useEffect(() => {
    fetchUserDetails();
  }, []);

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

  const handleRoleRequest = () => {
    //add api request here
    alert("Role request sent!");
    setHasRequestedRole(true);
  };

  const handleDeletePost = (postId) => {
    // Filter out the deleted post
    setPosts(posts.filter((post) => post.id !== postId));
  };

  return (
    <div className="profile-page">
      <Navbar2 />

      <div className="profile-container">
        <ProfileHeader
          username={userDetails.username}
          profilePicture={userDetails.profile_picture}
          hasRequestedRole={hasRequestedRole}
          onRoleRequest={handleRoleRequest}
        />

        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="profile-content">
          {activeTab === "posts" ? (
            <PostsList posts={posts} onDeletePost={handleDeletePost} />
          ) : (
            <>
              {loading ? (
                <div className="loading-indicator">Loading appointments...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : appointments.length === 0 ? (
                <div className="empty-state">
                  No appointments found. Your appointments will appear
                  here.
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