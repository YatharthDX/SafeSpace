import Navbar2 from "../components/Public/navbar2";
import React, { useState } from "react";
import ChatBox from "/src/components/Chat/ChatBox.jsx";
import Messages from "/src/components/Chat/Messages.jsx";
import "/src/css/Chat.css"; // Import Chat.css
const Chat = () => {
  const [chats, setChats] = useState([
    { id: 1, name: "Counselor1", message: "Hello", unread: 0, avatar: "https://avatar.iran.liara.run/public" },
    { id: 2, name: "Counselor2", message: "Hello", unread: 0, avatar: "https://avatar.iran.liara.run/public" },
    { id: 3, name: "Counselor3", message: "Hello", unread: 3, avatar: "https://avatar.iran.liara.run/public" },
    { id: 4, name: "Counselor4", message: "Hello", unread: 3, avatar: "https://avatar.iran.liara.run/public" },
    { id: 5, name: "Counselor5", message: "Hello", unread: 3, avatar: "https://avatar.iran.liara.run/public" },
    { id: 6, name: "Counselor6", message: "Hello", unread: 3, avatar: "https://avatar.iran.liara.run/public" },
    { id: 7, name: "Counselor7", message: "Hello", unread: 3, avatar: "https://avatar.iran.liara.run/public" },
  ]);
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="chat-body">
      <Navbar2 />
      <div className="chat-container">
      <ChatBox chats={chats} setSelectedChat={setSelectedChat} selectedChat={selectedChat} />
      <Messages selectedChat={selectedChat} />
    </div>
    </div>
  );
};

export default Chat;
