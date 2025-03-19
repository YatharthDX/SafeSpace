// import React from "react";
// import { FaSearch, FaCalendarAlt, FaComments, FaUser } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import "../../css/navbar.css";
// import logo from "../../assets/logo.png";

// const Navbar = () => {
//   return (
//     <nav className="navbar">
//       <div className="navbar-left">
//         <Link to="/home">
//           <img src={logo} alt="SafeSpace Logo" className="logo" />
//         </Link>
//         <h1 className="brand-name">SafeSpace</h1>
//       </div>

//       {/* Center Section - Search Bar */}
//       <div className="navbar-center">
//         <input type="text" placeholder="Search" className="search-bar" />
//         <button className="search-btn">
//           <FaSearch />
//         </button>
//       </div>

//       {/* Right Section - Navigation Links */}
//       <div className="navbar-right">
//         <Link to="/appointments" className="nav-link">
//           <FaCalendarAlt /> Appointments
//         </Link>
//         <Link to="/chat" className="nav-link">
//           <FaComments /> Chat
//         </Link>
//         <Link to="/profile" className="nav-link">
//           <FaUser /> Profile
//         </Link>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React, { useEffect, useState } from "react";
import { FaSearch, FaCalendarAlt, FaComments, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../css/navbar.css";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [zoomLevel, setZoomLevel] = useState(1);

  // Function to detect zoom level
  const handleResize = () => {
    setZoomLevel(window.innerWidth / window.screen.width);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="navbar" style={{ transform: `scale(${zoomLevel})` }}>
      <div className="navbar-left">
        <Link to="/home">
          <img src={logo} alt="SafeSpace Logo" className="logo" />
        </Link>
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
