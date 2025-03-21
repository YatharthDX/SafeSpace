import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5001";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(userId) {
    this.socket = io(SOCKET_URL, {
      query: {
        userId: userId,
      },
      withCredentials: true,
    });

    this.socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Listen for new messages
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on("newMessage", callback);
    }
  }

  // Listen for online users updates
  onOnlineUsers(callback) {
    if (this.socket) {
      this.socket.on("getOnlineUsers", callback);
    }
  }

  // Send a message
  sendMessage(messageData) {
    if (this.socket) {
      this.socket.emit("sendMessage", messageData);
    }
  }
}

export default new SocketService(); 