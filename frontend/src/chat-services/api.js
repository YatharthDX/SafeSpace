import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // This is important for handling cookies
});

// Remove the token interceptor since we're using cookies
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('jwt');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export const getUsers = async () => {
  try {
    const response = await api.get('/messages/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getMessages = async (userId) => {
  try {
    const response = await api.get(`/messages/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendMessage = async (userId, messageData) => {
  try {
    const response = await api.post(`/messages/send/${userId}`, messageData);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const markMessagesAsRead = async (userId) => {
  try {
    const response = await api.put(`/messages/read/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

export default api; 