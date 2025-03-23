import React, { useState, useEffect } from "react";
import axios from "axios";
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

  // Fetch appointments when tab changes to appointments
  useEffect(() => {
    if (activeTab === "appointments") {
      fetchAppointments();
    }
  }, [activeTab]);

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

      // Use full URL instead of relative path
      const response = await axios.get(
        "http://127.0.0.1:8000/appointments/getappointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Transform the backend data to match our frontend structure
      const formattedAppointments = response.data.map((appointment) => ({
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
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          setError("Authentication error. Please log in again.");
        } else {
          setError(`Server error: ${error.response.status}`);
        }
      } else if (error.request) {
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
          username="Playful Raccoon"
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
