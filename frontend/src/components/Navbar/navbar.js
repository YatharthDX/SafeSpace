import React from "react";
import { Search, MessageCircle, User } from "lucide-react"; // Icons
import safespaceLogo from "../public/logo.png"; // Add your logo image

const Navbar = () => {
  return (
    <header className="w-full h-16 bg-[#ecbc76] flex items-center px-10 shadow-md">
      {/* Left: Logo */}
      <div className="flex items-center">
        <img src={safespaceLogo} alt="SafeSpace Logo" className="w-12 h-12" />
        <h1 className="text-[#c6553b] text-2xl font-bold ml-3">SafeSpace</h1>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-grow mx-20">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full h-10 px-10 rounded-full bg-[#fef7ff] border border-gray-300"
          />
          <Search className="absolute left-3 top-2 text-gray-400" size={20} />
        </div>
      </div>

      {/* Right: Icons & Links */}
      <nav className="flex space-x-6">
        <button className="flex items-center text-black text-lg">
          <span>Appointments</span>
        </button>
        <button className="flex items-center space-x-2">
          <MessageCircle size={20} />
          <span>Chat</span>
        </button>
        <button className="flex items-center space-x-2">
          <User size={20} />
          <span>Profile</span>
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
