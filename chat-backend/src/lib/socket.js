import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  console.log("Looking up socket ID for user:", userId);
  console.log("Current userSocketMap:", userSocketMap);
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  console.log("Connection query:", socket.handshake.query);
  
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} mapped to socket ${socket.id}`);
    console.log("Updated userSocketMap:", userSocketMap);
  } else {
    console.warn("Connection received without userId");
  }

  // io.emit() is used to send events to all the connected clients
  const onlineUsers = Object.keys(userSocketMap);
  console.log("Emitting online users:", onlineUsers);
  io.emit("getOnlineUsers", onlineUsers);

  socket.on("sendMessage", (messageData, callback) => {
    console.log("Received message:", messageData);
    console.log("Current userSocketMap:", userSocketMap);
    const receiverSocketId = getReceiverSocketId(messageData.receiverId);
    console.log(`Receiver socket ID for ${messageData.receiverId}:`, receiverSocketId);

    try {
      if (receiverSocketId) {
        // Send message to specific user
        io.to(receiverSocketId).emit("newMessage", messageData);
        console.log("Message forwarded to receiver");
        if (callback) {
          callback({ status: "success", delivered: true });
        }
      } else {
        console.log("Receiver is offline:", messageData.receiverId);
        if (callback) {
          callback({ status: "success", delivered: false, message: "User is offline" });
        }
      }
    } catch (error) {
      console.error("Error handling message:", error);
      if (callback) {
        callback({ status: "error", message: "Failed to process message" });
      }
    }
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId) {
      delete userSocketMap[userId];
      console.log(`User ${userId} removed from online users`);
      console.log("Updated userSocketMap:", userSocketMap);
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
