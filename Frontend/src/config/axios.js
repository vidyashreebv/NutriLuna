import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://nutriluna-backend.onrender.com' // Your deployed Render URL
  : 'http://localhost:5001'; // Local development URL

console.log('API URL:', API_URL); // Debug log

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to false for cross-origin requests
  timeout: 10000 // 10 second timeout
});

// Add a request interceptor to add the auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request:', config.method.toUpperCase(), config.url); // Debug log
    return config;
  },
  (error) => {
    console.error('Request error:', error); // Debug log
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url); // Debug log
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.config?.url, error.message); // Debug log
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 