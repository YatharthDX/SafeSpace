import React, { useState } from "react";
import "../css/AppointmentRequests.css";
import Navbar2 from "../components/Public/navbar2";
import RequestCard from "../components/Appointments/RequestCard";
import { useNavigate } from "react-router-dom";

const AppointmentRequests = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [requests, setRequests] = useState([
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
  ]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleApprove = (requestId) => {
    setRequests(requests.map(request => 
      request.id === requestId 
        ? { ...request, status: "approved" }
        : request
    ));
  };

  const handleReject = (requestId) => {
    setRequests(requests.map(request => 
      request.id === requestId 
        ? { ...request, status: "rejected" }
        : request
    ));
  };

  const filteredRequests = requests.filter(request => {
    if (activeFilter === "all") return true;
    return request.status === activeFilter;
  });

  return (
    <div className="safespace-container">
      <Navbar2 />
      <div className="content-container">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentRequests; 