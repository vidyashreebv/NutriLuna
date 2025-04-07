import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axiosInstance from '../config/axios';

export const checkAuthStatus = async () => {
  const auth = getAuth();
  
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        resolve({ isAuthenticated: false, user: null });
        return;
      }

      try {
        const token = await user.getIdToken(true);
        
        const response = await axiosInstance.post('/api/auth/check-token', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        resolve({
          isAuthenticated: response.data.isValid,
          user: response.data.user
        });
      } catch (error) {
        console.error('Auth check error:', error);
        resolve({ isAuthenticated: false, user: null });
      }
    });
  });
}; 