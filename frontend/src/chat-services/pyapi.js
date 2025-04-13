import axios from 'axios';

const pyapi = axios.create({
    baseURL: 'http://localhost:8000/api',
});

export const getCurrentUser = async () => {
    try {
      const response = await pyapi.get('/auth/me', {
        withCredentials: true // This ensures cookies are included in the request
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  };


export default pyapi;