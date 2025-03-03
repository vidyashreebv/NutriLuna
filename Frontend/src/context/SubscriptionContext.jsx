import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const SubscriptionContext = createContext();

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setSubscription(userData.currentSubscription || null);
        }
      } else {
        setSubscription(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateSubscription = async (planDetails) => {
    const user = auth.currentUser;
    if (!user) return false;

    try {
      const token = await user.getIdToken();
      const response = await fetch('http://localhost:5001/api/consultation/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          packageType: planDetails.planId,
          amount: planDetails.price,
          consultationCount: planDetails.totalConsultations,
          validityDays: planDetails.duration === '1 month' ? 30 : 
                       planDetails.duration === '2 months' ? 60 : 90
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      setSubscription(data.data);
      return true;
    } catch (error) {
      console.error('Error updating subscription:', error);
      return false;
    }
  };

  const decrementConsultation = async () => {
    const user = auth.currentUser;
    if (!user || !subscription || subscription.remainingConsultations <= 0) return false;

    try {
      const token = await user.getIdToken();
      const response = await fetch('http://localhost:5001/api/consultation/decrement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      setSubscription(prev => ({
        ...prev,
        remainingConsultations: prev.remainingConsultations - 1
      }));

      return true;
    } catch (error) {
      console.error('Error decrementing consultation:', error);
      return false;
    }
  };

  const value = {
    subscription,
    loading,
    updateSubscription,
    decrementConsultation
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}; 