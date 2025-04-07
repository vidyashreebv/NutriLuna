// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nutriluna-backend.onrender.com';

// Ensure API_BASE_URL uses HTTPS
const secureAPI_BASE_URL = API_BASE_URL.replace('http://', 'https://');

// Debug log
console.log('Environment:', import.meta.env.MODE);
console.log('API_BASE_URL:', secureAPI_BASE_URL);
console.log('Current hostname:', window.location.hostname);

// API Endpoints
const API_ENDPOINTS = {
  // User related
  USER_PROFILE: `${secureAPI_BASE_URL}/api/user/profile`,
  PIN_STATUS: `${secureAPI_BASE_URL}/api/pin/status`,
  PIN_SET: `${secureAPI_BASE_URL}/api/pin/set`,
  PIN_VERIFY: `${secureAPI_BASE_URL}/api/pin/verify`,
  
  // Dashboard related
  DASHBOARD_DATA: `${secureAPI_BASE_URL}/api/dashboard/data`,
  
  // Diet tracker related
  DIET_TRACKER_TODAY: `${secureAPI_BASE_URL}/api/diettracker/today`,
  DIET_TRACKER_USER: (userId) => `${secureAPI_BASE_URL}/api/diettracker/${userId}`,
  
  // Period tracking related
  PERIOD_DATA: `${secureAPI_BASE_URL}/api/period/getPeriodData`,
  PERIOD_SAVE: `${secureAPI_BASE_URL}/api/period/savePeriod`,
  PERIOD_DELETE: (periodId) => `${secureAPI_BASE_URL}/api/period/deletePeriod/${periodId}`,
  
  // Recipe suggestion related
  RECIPE_SUGGESTION_STATUS: `${secureAPI_BASE_URL}/api/recipesuggestion/status`,
  RECIPE_SUGGESTION_SUGGESTIONS: `${secureAPI_BASE_URL}/api/recipesuggestion/suggestions`,
  
  // Consultation related
  CONSULTATION_BOOK: `${secureAPI_BASE_URL}/api/consultation/book`,
  
  // News API
  NEWS_API: (query, pageSize = 20) => 
    `https://newsapi.org/v2/everything?q=${query}&language=en&sortBy=publishedAt&pageSize=${pageSize}&apiKey=f29bbe91c4fe4be2ba8ca4f32b1bb42c`
};

export { secureAPI_BASE_URL, API_ENDPOINTS }; 