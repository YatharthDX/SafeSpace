import React from "react";
import { FaSearch, FaCalendarAlt, FaComments, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../css/navbar.css"; // Import the CSS file
import logo from "../../assets/logo.png"; // Import the logo image

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Left Section - Logo & Brand Name */}
      <div className="navbar-left">
        <img src={logo} alt="SafeSpace Logo" className="logo" />
        <h1 className="brand-name">SafeSpace</h1>
      </div>

      {/* Center Section - Search Bar */}
      <div className="navbar-center"> 
        <input type="text" placeholder="Search" className="search-bar" />
        <button className="search-btn">
          <FaSearch />
        </button>
      </div>

      {/* Right Section - Navigation Links */}
      <div className="navbar-right">
        <Link to="/appointments" className="nav-link">
          <FaCalendarAlt /> Appointments
        </Link>
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
