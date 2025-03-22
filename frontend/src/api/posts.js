import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/blogs';

// Configure axios defaults
axios.defaults.withCredentials = true;

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
    const response = await axios.post(`${API_URL}/blogs/${postId}/like`, {}, {
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

// Unlike a blog post
export const unlikePost = async (postId) => {
  try {
    const response = await axios.post(`${API_URL}/blogs/${postId}/unlike`, {}, {
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
