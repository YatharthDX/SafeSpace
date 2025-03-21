import React, { useState, useEffect, useRef } from "react";
import { FaImage } from "react-icons/fa";
import { getMessages, sendMessage } from "../../services/api";
import socketService from "../../services/socket";

const Messages = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;

      try {
        setLoading(true);
        const messagesData = await getMessages(selectedChat.id);
        setMessages(messagesData);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Listen for new messages
    socketService.onNewMessage((newMessage) => {
      if (selectedChat && (newMessage.senderId === selectedChat.id || newMessage.receiverId === selectedChat.id)) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    // Cleanup on unmount
    return () => {
      socketService.socket?.off("newMessage");
    };
  }, [selectedChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const messageData = {
        text: newMessage,
        receiverId: selectedChat.id,
      };
      const sentMessage = await sendMessage(selectedChat.id, messageData);
      setMessages([...messages, sentMessage]);
      setNewMessage("");
      // Emit the message through socket
      socketService.sendMessage(messageData);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!selectedChat) {
    return <p className="no-chat-selected">Select a chat to start messaging</p>;
  }

  if (loading) {
    return (
      <div className="chat-window">
        <div className="message-header">
          <img src={selectedChat.avatar} alt={selectedChat.name} className="message-header-avatar" />
          <h3>{selectedChat.name}</h3>
        </div>
        <div className="chat-messages">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="message-header">
        <img src={selectedChat.avatar} alt={selectedChat.name} className="message-header-avatar" />
        <h3>{selectedChat.name}</h3>
      </div>
      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`message ${message.senderId === selectedChat.id ? "received" : "sent"}`}
          >
            {message.text}
            {message.image && (
              <img src={message.image} alt="Shared" className="message-image" />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="chat-input">
        <FaImage className="image-icon" />
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Messages;
