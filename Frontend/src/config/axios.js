import axios from 'axios';
import { secureAPI_BASE_URL } from './apiConfig';

// Debug log
console.log('Axios Configuration - Using API URL:', secureAPI_BASE_URL);

// Create axios instance
const axiosInstance = axios.create({
  baseURL: secureAPI_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Disable credentials for cross-origin requests
  timeout: 15000, // 15 second timeout
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage or from Firebase auth
    let token = localStorage.getItem('token');
    
    // If no token in localStorage, try to get it from Firebase auth
    if (!token && window.firebase && window.firebase.auth) {
      const currentUser = window.firebase.auth().currentUser;
      if (currentUser) {
        token = currentUser.getIdToken();
      }
    }
    
    if (token) {
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
  (error) => {
    console.error('Response error:', error);
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error - server may be down or unreachable');
      // You could show a user-friendly message here
      return Promise.reject({
        message: 'Network error. Please check your connection and try again.',
        isNetworkError: true
      });
    }
    
    // Handle specific status codes
    if (error.response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response.status === 403) {
      console.error('Forbidden - insufficient permissions');
    } else if (error.response.status === 404) {
      console.error('Resource not found');
    } else if (error.response.status >= 500) {
      console.error('Server error');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 