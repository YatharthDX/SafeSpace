import Navbar2 from "../components/Public/navbar2";
import React, { useState, useEffect } from "react";
import ChatBox from "/src/components/Chat/ChatBox.jsx";
import Messages from "/src/components/Chat/Messages.jsx";
import { getCurrentUser } from "../chat-services/pyapi";
import { getUsers } from "../chat-services/api";
import socketService from "../chat-services/socket";
import "/src/css/Chat.css";

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        const currentUser = await getCurrentUser();
        let users2 = [];
        if (currentUser.role === 'student') {
          users2 = users.filter(user => user.role === 'counsellor');
        } else if (currentUser.role === 'counsellor') {
          users2 = users.filter(user => user.role === 'student'); 
        }
        const transformedUsers = users2.map(user => ({
          id: user._id,
          name: user.name,
          message: "Click to start chatting",
          unread: 0,
          avatar: user.profilePic || "https://avatar.iran.liara.run/public",
        }));
        setChats(transformedUsers);
      } catch (error) {
        console.error('❌ Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const setupSocket = async () => {
      try {
        // Get current user's MongoDB ID from the server
        const currentUser = await getCurrentUser();
        console.log("🔗 Current user data:", currentUser);
        
        if (!currentUser._id) {
          console.error("⚠️ No MongoDB ID found for current user");
          return;
        }

        console.log("🔗 Connecting to socket with userId:", currentUser._id);
        socketService.connect(currentUser._id);
        setCurrentUserId(currentUser._id);

        socketService.onOnlineUsers((users) => {
          console.log("✅ Online users received:", users);
          setOnlineUsers(users);
        });
      } catch (error) {
        console.error("❌ Error setting up socket:", error);
      }
    };

    setupSocket();

    return () => {
      console.log("🔌 Disconnecting from socket...");
      socketService.disconnect();
    };
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
          onlineUsers={onlineUsers}
        />
        <Messages selectedChat={selectedChat} />
      </div>
    </div>
  );
};

export default Chat;