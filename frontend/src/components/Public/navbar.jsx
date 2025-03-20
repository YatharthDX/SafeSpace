import React from "react";
import { FaSearch, FaCalendarAlt, FaComments, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../css/navbar.css";
import logo from "../../assets/logo_edited.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Left Section - Logo & Brand Name */}
      <div className="navbar-left">
        <img src={logo} alt="SafeSpace Logo" className="logo" />
        <Link to="/home" className="brand-name">
          SafeSpace
        </Link>
      </div>

      {/* Center Section - Search Bar */}
      <div className="navbar-center">
        <div className="search-container">
          <input type="text" placeholder="Search" className="search-bar" />
          {/* <FaSearch className="search-icon" /> */}
        </div>
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