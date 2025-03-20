import React from "react";
import "../css/Requests.css";
import Navbar from "../components/Public/navbar";
import RequestCard from "../components/RequestCard";
import { useNavigate } from "react-router-dom";

const AppointmentRequests = () => {
  const navigate = useNavigate();
  
  // Mock data for requests
  const requests = [
    {
      id: 1,
      studentName: "John Doe",
      date: "2024-03-20",
      time: "10:00 AM",
      status: "pending",
      type: "Academic",
      description: "Need help with exam preparation"
    },
    {
      id: 2,
      studentName: "Jane Smith",
      date: "2024-03-21",
      time: "2:00 PM",
      status: "approved",
      type: "Personal",
      description: "Career guidance session"
    },
    // Add more mock requests as needed
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="safespace-container">
      <Navbar />
      <div className="content-container">
        <div className="main-content">
          <div className="sidebar">
            <div className="sidebar-item" onClick={() => handleNavigation("/counselor/dashboard")}>
              <span className="sidebar-icon">📊</span>
              <span>Dashboard</span>
            </div>
            <div className="sidebar-item active" onClick={() => handleNavigation("/counselor/requests")}>
              <span className="sidebar-icon">📝</span>
              <span>Requests</span>
            </div>
          </div>

          <div className="main-content">
            <div className="requests-container">
              <div className="header">
                <h1>Counselor Dashboard</h1>
                <h2>Counseling Requests</h2>
              </div>

              <div className="requests-grid">
                {requests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentRequests; 