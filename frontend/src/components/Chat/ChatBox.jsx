import React from "react";
import { FaEdit, FaUserCircle } from "react-icons/fa"; // Import icons

const ChatBox = ({ chats, setSelectedChat, selectedChat }) => {
  return (
    <div className="chat-list">
      <div className="chat-header">
        <h1>Chats</h1>
        <FaEdit className="edit-icon" /> {/* Pencil icon */}
      </div>
      <input type="text" placeholder="Search.." className="search-bar" />
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`chat-item ${selectedChat?.id === chat.id ? "active" : ""}`}
          onClick={() => setSelectedChat(chat)}
        >
          {/* Use default contact icon if avatar is missing */}
          {chat.avatar ? (
            <img src={chat.avatar} alt={chat.name} className="chat-avatar" />
          ) : (
            <FaUserCircle className="default-avatar" />
          )}
          <div className="chat-info">
            <p className="chat-name">{chat.name}</p>
            <p className="chat-message">You: {chat.message}</p>
          </div>
          {chat.unread > 0 && <span className="unread-badge">{chat.unread}</span>}
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
