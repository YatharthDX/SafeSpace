import axios from 'axios';
import { getCurrentUser } from '../chat-services/pyapi';

const API_URL = 'http://127.0.0.1:8000/blogs';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Create a new blog post
export const createPost = async (postData) => {
  try {
    const response = await axios.post(`${API_URL}/blogs`, postData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error.response?.data || error.message;
  }
};

// Classify the severity of a text
export const classifySeverity = async (postData) => {
  try {
    const response = await axios.post(`${API_URL}/classify-severity`, postData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data["severity"][0];
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Classify a text
export const classifyText = async (postData) => {
  try {
    const response = await axios.post(`${API_URL}/classify`, postData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all blog posts
export const getPosts = async (skip = 0, limit = 20) => {
  try {
    const response = await axios.get(`${API_URL}/blogs`, {
      params: { skip, limit },
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get a single blog post
export const getPost = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}/blogs/${postId}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Like a blog post
export const likePost = async (postId) => {
  try {
    console.log('Attempting to like post:', postId);
    const currentUser = await getCurrentUser();
    const response = await axios.post(`${API_URL}/blogs/${postId}/like`, {
      user_id: currentUser._id
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log('Like response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error.response?.data || error.message;
  }
};

// Unlike a blog post
export const unlikePost = async (postId) => {
  try {
    const currentUser = await getCurrentUser();
    const response = await axios.post(`${API_URL}/blogs/${postId}/unlike`, {
      user_id: currentUser._id
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get comments for a blog post
export const getComments = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}/blogs/${postId}/comments`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add a comment to a blog post
export const addComment = async (postId, commentData) => {
  try {
    const response = await axios.post(`${API_URL}/blogs/${postId}/comments`, commentData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Upload an image for a blog post
export const uploadPostImage = async (postId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);
    const response = await axios.post(`${API_URL}/blogs/${postId}/upload-image`, formData, {
      withCredentials: true,
      headers: {
      
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user's liked posts
export const getUserLikedPosts = async () => {
  try {
    const currentUser = await getCurrentUser();
    const response = await axios.get(`${API_URL}/user/liked-posts`, {
      params: { user_id: currentUser._id },
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching liked posts:', error);
    throw error.response?.data || error.message;
  }
};
