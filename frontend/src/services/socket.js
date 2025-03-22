import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5001"; // Match your backend PORT

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    console.log("Attempting to connect with userId:", userId);
    this.socket = io(SOCKET_URL, {
      query: {
        userId: userId,
      },
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("Connected to socket server with socket ID:", this.socket.id);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }

  disconnect() {
    if (this.socket) {
      console.log("Manually disconnecting socket");
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      console.log("Setting up new message listener");
      this.socket.on("newMessage", (message) => {
        console.log("Received new message:", message);
        callback(message);
      });
    } else {
      console.warn("Socket not initialized when trying to set up message listener");
    }
  }

  onOnlineUsers(callback) {
    if (this.socket) {
      console.log("Setting up online users listener");
      this.socket.on("getOnlineUsers", (users) => {
        console.log("Received online users update:", users);
        callback(users);
      });
    } else {
      console.warn("Socket not initialized when trying to set up online users listener");
    }
  }

  sendMessage(messageData) {
    if (this.socket) {
      console.log("Emitting message:", messageData);
      this.socket.emit("sendMessage", messageData);
    } else {
      console.warn("Socket not initialized when trying to send message");
    }
  }
}

export default new SocketService(); 