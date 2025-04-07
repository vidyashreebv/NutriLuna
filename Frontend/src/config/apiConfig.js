// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nutriluna-backend.onrender.com';

// Ensure API_BASE_URL uses HTTPS
const secureAPI_BASE_URL = API_BASE_URL.replace('http://', 'https://');

// Debug log
console.log('Environment:', import.meta.env.MODE);
console.log('API_BASE_URL:', secureAPI_BASE_URL);
console.log('Current hostname:', window.location.hostname);

// API Endpoints - Using relative paths since baseURL is configured in axios.js
const API_ENDPOINTS = {
  // User related
  USER_PROFILE: '/api/user/profile',
  PIN_STATUS: '/api/pin/status',
  PIN_SET: '/api/pin/set',
  PIN_VERIFY: '/api/pin/verify',
  
  // Dashboard related
  DASHBOARD_DATA: '/api/dashboard/data',
  
  // Diet tracker related
  DIET_TRACKER_TODAY: '/api/diettracker/today',
  DIET_TRACKER_USER: (userId) => `/api/diettracker/${userId}`,
  
  // Period tracking related
  PERIOD_DATA: '/api/period/getPeriodData',
  PERIOD_SAVE: '/api/period/savePeriod',
  PERIOD_DELETE: (periodId) => `/api/period/deletePeriod/${periodId}`,
  
  // Recipe suggestion related
  RECIPE_SUGGESTION_STATUS: '/api/recipesuggestion/status',
  RECIPE_SUGGESTION_SUGGESTIONS: '/api/recipesuggestion/suggestions',
  
  // Consultation related
  CONSULTATION_BOOK: '/api/consultation/book',
  
  // News API - Keep this as full URL since it's external
  NEWS_API: (query, pageSize = 20) => 
    `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=${pageSize}&apiKey=f29bbe91c4fe4be2ba8ca4f32b1bb42c`
};

export { secureAPI_BASE_URL, API_ENDPOINTS }; 