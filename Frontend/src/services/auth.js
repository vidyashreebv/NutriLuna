import { getAuth, signInWithCustomToken } from 'firebase/auth';

const auth = getAuth();

export const loginWithCustomToken = async (uid) => {
  try {
    // Get custom token from backend
    const response = await fetch('http://localhost:5001/api/auth/create-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid }),
    });

    const { token } = await response.json();

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
    const response = await fetch('http://localhost:5001/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid }),
    });

    const { token } = await response.json();
    return token;
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