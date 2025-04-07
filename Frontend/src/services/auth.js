import { getAuth, signInWithCustomToken } from 'firebase/auth';
import axiosInstance from '../config/axios';

const auth = getAuth();

export const loginWithCustomToken = async (uid) => {
  try {
    // Get custom token from backend
    const response = await axiosInstance.post('/api/auth/create-token', { uid });
    const { token } = response.data;

    // Sign in with Firebase using the custom token
    const userCredential = await signInWithCustomToken(auth, token);
    return userCredential.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const refreshToken = async (uid) => {
  try {
    const response = await axiosInstance.post('/api/auth/refresh-token', { uid });
    return response.data.token;
  } catch (error) {
    console.error('Token refresh error:', error);
    throw error;
  }
};

// Add token refresh logic
export const setupTokenRefresh = (user) => {
  // Check token expiration every hour
  setInterval(async () => {
    const token = await user.getIdToken();
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();

    // If token is about to expire (within 24 hours), refresh it
    if (expirationTime - currentTime < 24 * 60 * 60 * 1000) {
      try {
        const newToken = await refreshToken(user.uid);
        await user.getIdToken(true); // Force token refresh
      } catch (error) {
        console.error('Failed to refresh token:', error);
        // Handle token refresh failure (e.g., log out user)
      }
    }
  }, 60 * 60 * 1000); // Check every hour
}; 