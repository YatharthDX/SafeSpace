import Navbar2 from "../components/Public/navbar2";
import React, { useState, useEffect } from "react";
import ChatBox from "/src/components/Chat/ChatBox.jsx";
import Messages from "/src/components/Chat/Messages.jsx";
import { getCurrentUser } from "../chat-services/pyapi";
import { getUsers, getMessages } from "../chat-services/api";
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

        // Fetch messages for each user to calculate unread counts
        const usersWithMessages = await Promise.all(
          users2.map(async (user) => {
            const messages = await getMessages(user._id);
            const unreadCount = messages.filter(
              msg => msg.status === "sent" && msg.receiverId === currentUser._id
            ).length;
            
            return {
              id: user._id,
              name: user.name,
              message: "Click to start chatting",
              unread: unreadCount,
              avatar: user.profilePic || "https://avatar.iran.liara.run/public",
            };
          })
        );

        setChats(usersWithMessages);
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

        // Listen for new messages to update unread counts
        socketService.onNewMessage((newMessage) => {
          if (newMessage.receiverId === currentUser._id) {
            setChats(prevChats => 
              prevChats.map(chat => 
                chat.id === newMessage.senderId
                  ? { ...chat, unread: chat.unread + 1 }
                  : chat
              )
            );
          }
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