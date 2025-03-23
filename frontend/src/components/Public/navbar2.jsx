import React from "react";
import { FaSearch, FaCalendarAlt, FaComments, FaUser, FaSignOutAlt, FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../../css/navbar.css";
import logo from "../../assets/logo_edited.png";

const Navbar2 = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Clear localStorage
      localStorage.removeItem("token");

      // Clear all cookies
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie.replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      await fetch("http://127.0.0.1:8000/api/auth/logout", {
        method: "POST",
        credentials: "include", // Ensures cookies are sent
      });
  

  
      // Navigate to login page
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  

  return (
    <nav className="navbar">
      {/* Left Section - Logo & Brand Name */}
      <div className="navbar-left">
        <img src={logo} alt="SafeSpace Logo" className="logo" />
        <Link to="/home" className="brand-name">
          SafeSpace
        </Link>
      </div>

      {/* Right Section - Navigation Links */}
      <div className="navbar-right">
        <Link to="/home" className="nav-link">
          <FaHome /> Home
        </Link>
        <Link to="/appointments" className="nav-link">
          <FaCalendarAlt /> Appointments
        </Link>
        <Link to="/chat" className="nav-link">
          <FaComments /> Chat
        </Link>
        <Link to="/profile" className="nav-link">
          <FaUser /> Profile
        </Link>
        <button onClick={handleLogout} className="nav-link logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar2;