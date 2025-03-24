import React, { useState, useEffect, useRef } from "react";
import { FaImage } from "react-icons/fa";
import { getMessages, sendMessage, markMessagesAsRead } from "../../chat-services/api";
import socketService from "../../chat-services/socket";

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
        
        // Mark messages as read when viewing them
        await markMessagesAsRead(selectedChat.id);
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
    const handleNewMessage = (newMessage) => {
      console.log("Messages component received message:", newMessage);
      console.log("Current selectedChat:", selectedChat);
      
      if (selectedChat && (newMessage.senderId === selectedChat.id || newMessage.receiverId === selectedChat.id)) {
        console.log("Message matches current chat, adding to messages");
        setMessages((prevMessages) => {
          console.log("Previous messages:", prevMessages);
          const newMessages = [...prevMessages, newMessage];
          console.log("New messages array:", newMessages);
          return newMessages;
        });
      } else {
        console.log("Message does not match current chat, ignoring");
      }
    };

    console.log("Setting up message listener for chat:", selectedChat?.id);
    socketService.onNewMessage(handleNewMessage);

    // Cleanup on unmount or when selectedChat changes
    return () => {
      console.log("Cleaning up message listener for chat:", selectedChat?.id);
      if (socketService.socket) {
        socketService.socket.off("newMessage", handleNewMessage);
      }
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
      console.log("Sending message:", messageData);
      const sentMessage = await sendMessage(selectedChat.id, messageData);
      console.log("Message sent successfully:", sentMessage);
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
            className={`message ${message.senderId === selectedChat.id ? "received" : "sent"} ${message.status}`}
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
