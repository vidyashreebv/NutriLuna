import axios from 'axios';
import { secureAPI_BASE_URL } from './apiConfig';
import { auth } from './firebaseConfig';

// Debug log
console.log('Axios Configuration - Using API URL:', secureAPI_BASE_URL);

// Create axios instance
const axiosInstance = axios.create({
  baseURL: secureAPI_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable credentials for cross-origin requests
  timeout: 15000, // 15 second timeout
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Get the current user
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        // Get a fresh token
        const token = await currentUser.getIdToken(true);
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add timestamp to prevent caching
      if (config.method === 'get') {
        config.params = {
          ...config.params,
          _t: new Date().getTime()
        };
      }
      
      console.log('Request:', config.method.toUpperCase(), config.url);
      return config;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return config;
    }
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.status, error.response.data);
      
      if (error.response.status === 401) {
        // Token expired or invalid
        try {
          // Try to refresh the token
          const currentUser = auth.currentUser;
          if (currentUser) {
            const newToken = await currentUser.getIdToken(true);
            // Retry the original request with the new token
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(error.config);
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network error:', error.message);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 