import React, { useState, useEffect } from "react";
import { FaSearch, FaCalendarAlt, FaComments, FaUser, FaSignOutAlt, FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Fix the import
import "../../css/navbar.css";
import logo from "../../assets/logo_edited.png";

const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Decode JWT token and extract role
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token); // Correct usage
        setRole(decoded.role); // Assuming the role is stored in 'role' key
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token"); // Remove invalid token
      }
    }
  }, []);
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="SafeSpace Logo" className="logo" />
        <Link to="/home">
          <h1 className="brand-name">SafeSpace</h1>
        </Link>
      </div>

      <div className="navbar-right">
        <Link to="/home" className="nav-link">
          <FaHome /> Home
        </Link>
        {/* Conditional Appointment Redirect */}
        {role === "counsellor" ? (
          <Link to="/counselor/dashboard" className="nav-link">
            <FaCalendarAlt /> Appointments
          </Link>
        ) : (
          <Link to="/appointments" className="nav-link">
            <FaCalendarAlt /> Appointments
          </Link>
        )}

        <Link to="/chat" className="nav-link">
          <FaComments /> Chat
        </Link>
        <Link to="/profile" className="nav-link">
          <FaUser /> Profile
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
