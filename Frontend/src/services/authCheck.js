import { getAuth, onAuthStateChanged } from 'firebase/auth';

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
        
        const response = await fetch('http://localhost:5001/api/auth/check-token', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();
        
        resolve({
          isAuthenticated: data.isValid,
          user: data.user
        });
      } catch (error) {
        console.error('Auth check error:', error);
        resolve({ isAuthenticated: false, user: null });
      }
    });
  });
}; 