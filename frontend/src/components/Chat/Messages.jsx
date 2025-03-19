import React from "react";
import { FaImage } from "react-icons/fa"; // Import image icon

const Messages = ({ selectedChat }) => {
  return (
    <div className="chat-window">
      {selectedChat ? (
        <>
          <div className="message-header">
            <img src={selectedChat.avatar} alt={selectedChat.name} className="message-header-avatar" />
            <h3>{selectedChat.name}</h3>
          </div>
          <div className="chat-messages">
            <div className="chat-date">March 18, 2025</div>
            <div className="message received">Hello</div>
            <div className="message sent">Hi</div>
          </div>
          <div className="chat-input">
            <FaImage className="image-icon" /> {/* Image icon */}
            <input type="text" placeholder="Write a message..." />
            <button>Send</button>
          </div>
        </>
      ) : (
        <p className="no-chat-selected">Select a chat to start messaging</p>
      )}
    </div>
  );
};

export default Messages;
