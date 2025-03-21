import Navbar2 from "../components/Public/navbar2";
import React, { useState, useEffect } from "react";
import ChatBox from "/src/components/Chat/ChatBox.jsx";
import Messages from "/src/components/Chat/Messages.jsx";
import { getUsers } from "../services/api";
import "/src/css/Chat.css"; // Import Chat.css

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        // Transform users data to match your chat format
        const transformedUsers = users.map(user => ({
          id: user._id,
          name: user.username,
          message: "Click to start chatting",
          unread: 0,
          avatar: user.profilePic || "https://avatar.iran.liara.run/public",
        }));
        setChats(transformedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="chat-body">
        <Navbar2 />
        <div className="chat-container">
          <div>Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-body">
      <Navbar2 />
      <div className="chat-container">
        <ChatBox
          chats={chats}
          setSelectedChat={setSelectedChat}
          selectedChat={selectedChat}
        />
        <Messages selectedChat={selectedChat} />
      </div>
    </div>
  );
};

export default Chat;
