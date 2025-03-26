import React from "react";
import { FaEdit, FaUserCircle, FaSearch } from "react-icons/fa"; // Import icons

const ChatBox = ({ chats, setSelectedChat, selectedChat, onlineUsers, searchQuery, setSearchQuery }) => {
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="chat-list">
      <div className="chat-header">
        <h1>Chats</h1>
        <FaEdit className="edit-icon" /> {/* Pencil icon */}
      </div>
      <div className="search-container">
        {/* <FaSearch className="search-icon" /> */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search chats..."
          className="search-bar"
        />
      </div>
      {chats.length === 0 ? (
        <div className="no-results">
          No chats found matching your search
        </div>
      ) : (
        chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${selectedChat?.id === chat.id ? "active" : ""}`}
            onClick={() => setSelectedChat(chat)}
          >
            {chat.avatar ? (
              <img src={chat.avatar} alt={chat.name} className="chat-avatar" />
            ) : (
              <FaUserCircle className="default-avatar" />
            )}
            <div className="chat-info">
              <p className="chat-name">{chat.name}</p>
              <p className="chat-message">{chat.message}</p>
            </div>
            {chat.unread > 0 && <span className="unread-badge">{chat.unread}</span>}
            {onlineUsers.includes(chat.id) && (
              <span className="online-indicator"></span>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ChatBox;
