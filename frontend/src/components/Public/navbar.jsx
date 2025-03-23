import React, { useState } from "react";
import { FaSearch, FaCalendarAlt, FaComments, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../css/navbar.css";
import logo from "../../assets/logo_edited.png";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const data = [
    "Mental Health Tips",
    "Stress Management",
    "Anxiety Support",
    "Depression Awareness",
    "Self-care Strategies",
    "Therapist Recommendations",
  ];

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const results = data.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredResults(results);
      setShowDropdown(results.length > 0);
    } else {
      setShowDropdown(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="SafeSpace Logo" className="logo" />
        <Link to="/home">
          <h1 className="brand-name">SafeSpace</h1>
        </Link>
      </div>

      {/* Center Section - Search Bar */}
      <div className="navbar-center">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            className="search-bar"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="search-icon" />
          {showDropdown && (
            <ul className="search-dropdown">
              {filteredResults.map((result, index) => (
                <li key={index} className="search-item">{result}</li>
              ))}
            </ul>
          )}
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
