import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const SubscriptionContext = createContext();

export const useSubscription = () => useContext(SubscriptionContext);

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
          setSubscription(userData.subscription || null);
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
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      subscription: {
        ...planDetails,
        startDate: new Date().toISOString(),
        consultationsLeft: planDetails.totalConsultations,
      }
    });

    setSubscription({
      ...planDetails,
      startDate: new Date().toISOString(),
      consultationsLeft: planDetails.totalConsultations,
    });
  };

  const decrementConsultation = async () => {
    if (!subscription || subscription.consultationsLeft <= 0) return false;

    const user = auth.currentUser;
    if (!user) return false;

    const userRef = doc(db, 'users', user.uid);
    const newCount = subscription.consultationsLeft - 1;

    await updateDoc(userRef, {
      'subscription.consultationsLeft': newCount
    });

    setSubscription({
      ...subscription,
      consultationsLeft: newCount
    });

    return true;
  };

  return (
    <SubscriptionContext.Provider 
      value={{ 
        subscription, 
        loading, 
        updateSubscription,
        decrementConsultation
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}; 