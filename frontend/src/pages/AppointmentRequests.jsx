import React, { useState, useEffect } from "react";
import "../css/AppointmentRequests.css";
import Navbar2 from "../components/Public/navbar2";
import RequestCard from "../components/Appointments/RequestCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTachometerAlt, FaCalendarAlt } from "react-icons/fa";


const AppointmentRequests = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch appointment requests from the backend
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        // Get the token from localStorage or wherever you store it
        const token = localStorage.getItem("token");
        
        if (!token) {
          // Redirect to login if there's no token
          console.log("No token found. Redirecting to login.");
          navigate("/");
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/appointments/counselors/appointment_requests", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Transform the backend data to match our frontend structure
        const formattedRequests = response.data.map(appointment => ({
          id: appointment._id,
          studentName: appointment.user_name || "Student", // Adjust based on your backend data structure
          date: appointment.date,
          time: appointment.time_slot,
          status: appointment.status,
          contact_no: appointment.contact_no,
          description: appointment.description || "No description provided",
          studentEmail: appointment.user_email
        }));

        setRequests(formattedRequests);
        setError(null);
      } catch (err) {
        console.error("Error fetching appointment requests:", err);
        setError("Failed to load appointment requests. Please try again later.");
        
        // Handle unauthorized errors
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [navigate]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleApprove = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      
      await fetch(`http://127.0.0.1:8000/appointments/appointments/${requestId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: "accepted" })
      });

      // Update local state after successful API call
      setRequests(requests.map(request => 
        request.id === requestId 
          ? { ...request, status: "accepted" }
          : request
      ));
    } catch (err) {
      console.error("Error approving request:", err);
      alert("Failed to approve the appointment. Please try again.");
      
      // Handle unauthorized errors
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate("/");
      }
    }
  };

  const handleReject = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      
      await fetch(`http://127.0.0.1:8000/appointments/appointments/${requestId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: "rejected" })
      });

      // Update local state after successful API call
      setRequests(requests.map(request => 
        request.id === requestId 
          ? { ...request, status: "rejected" }
          : request
      ));
    } catch (err) {
      console.error("Error rejecting request:", err);
      alert("Failed to reject the appointment. Please try again.");
      
      // Handle unauthorized errors
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate("/");
      }
    }
  };

  const filteredRequests = requests.filter(request => {
    if (activeFilter === "all") return true;
    
    // Map the backend status "accepted" to the frontend status "approved" for filtering
    if (activeFilter === "approved") {
      return request.status === "accepted" || request.status === "approved";
    }
    
    return request.status === activeFilter;
  });

  return (
    <div className="safespace-container">
      <Navbar2 />
      <div className="content-container">
        <div className="sidebar">
          <div className="sidebar-item" onClick={() => handleNavigation("/counselor/dashboard")}>
            <span className="sidebar-icon">
              <FaTachometerAlt/>
            </span>
            <span>Dashboard</span>
          </div>
          <div className="sidebar-item active" onClick={() => handleNavigation("/counselor/requests")}>
            <span className="sidebar-icon">
            <FaCalendarAlt/>
            </span>
            <span>Requests</span>
          </div>
        </div>

        <div className="main-content">
          <div className="requests-container">
            <div className="header">
              <h1>Counselor Dashboard</h1>
              <h2>Counseling Requests</h2>
            </div>

            <div className="filter-navbar">
              <button 
                className={`filter-button ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                All Requests
              </button>
              <button 
                className={`filter-button ${activeFilter === "pending" ? "active" : ""}`}
                onClick={() => setActiveFilter("pending")}
              >
                Pending
              </button>
              <button 
                className={`filter-button ${activeFilter === "approved" ? "active" : ""}`}
                onClick={() => setActiveFilter("approved")}
              >
                Approved
              </button>
              <button 
                className={`filter-button ${activeFilter === "rejected" ? "active" : ""}`}
                onClick={() => setActiveFilter("rejected")}
              >
                Rejected
              </button>
            </div>

            {loading ? (
              <div className="loading-container">
                <p>Loading appointment requests...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <p>{error}</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="empty-container">
                <p>No {activeFilter !== "all" ? activeFilter : ""} requests found.</p>
              </div>
            ) : (
              <div className="requests-grid">
                {filteredRequests.map((request) => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    onApprove={() => handleApprove(request.id)}
                    onReject={() => handleReject(request.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentRequests;