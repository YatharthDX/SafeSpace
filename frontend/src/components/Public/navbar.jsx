import React, { useState, useEffect } from "react";
import { FaSearch, FaCalendarAlt, FaComments, FaUser, FaSignOutAlt, FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../../css/navbar.css";
import logo from "../../assets/logo_edited.png";

const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTags, setSearchTags] = useState([]);

  // Fetch tags and decode token on component mount
  useEffect(() => {
    // Fetch search tags
    const fetchTags = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/search_blog/tags/");
        if (response.ok) {
          const tags = await response.json();
          setSearchTags(tags);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    
    // Decode JWT token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }

    fetchTags();
  }, []);

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
      // navigate("/");
      navigate(0);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  // Search handling functions
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    // Filter tags based on search input
    if (value.length > 0) {
      const results = searchTags.filter((tag) =>
        tag.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredResults(results);
      setShowDropdown(results.length > 0);
      
      // Pass search term to parent component for API search
      if (onSearch) {
        onSearch(value, []);
      }
    } else {
      setShowDropdown(false);
      
      // Clear search if input is empty
      if (onSearch) {
        onSearch("", []);
      }
    }
  };

  const handleTagSelect = (tag) => {
    // When a tag is selected from dropdown, search using that tag
    if (onSearch) {
      onSearch(searchTerm, [tag]);
    }
    setShowDropdown(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm, []);
    }
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      {/* Left Section - Logo */}
      <div className="navbar-left">
        <img src={logo} alt="SafeSpace Logo" className="logo" />
        <Link to="/home">
          <h1 className="brand-name">SafeSpace</h1>
        </Link>
      </div>

      {/* Center Section - Search Bar */}
      <div className="navbar-center">
        <div className="search-container">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search posts..."
              className="search-bar"
              value={searchTerm}
              onChange={handleSearch}
              onFocus={() => setShowDropdown(filteredResults.length > 0)}
            />
            {/* <button type="submit" className="search-button">
              <FaSearch className="search-icon" />
            </button> */}
          </form>
          
          {showDropdown && (
            <ul className="search-dropdown">
              {filteredResults.map((result, index) => (
                <li 
                  key={index} 
                  className="search-item"
                  onClick={() => handleTagSelect(result)}
                >
                  {result}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right Section - Navigation Links */}
      <div className="navbar-right">
        <Link to="/home" className="nav-link">
          <FaHome /> Home
        </Link>
        
        {/* Conditional Appointment Redirect based on role */}
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
        <a onClick={handleLogout} className="nav-link">
          <FaSignOutAlt /> Logout
      
        </a>
      </div>
    </nav>
  );
};

export default Navbar;