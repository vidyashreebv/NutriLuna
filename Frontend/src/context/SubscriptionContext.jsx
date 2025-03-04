import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkSubscriptionStatus = async (userId) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const currentSub = userData.currentSubscription;

                if (currentSub) {
                    const endDate = new Date(currentSub.endDate);
                    const isActive = endDate > new Date() && currentSub.remainingConsultations > 0;

                    if (!isActive || currentSub.remainingConsultations === 0) {
                        // Deactivate subscription
                        await updateDoc(doc(db, 'users', userId), {
                            'currentSubscription.isActive': false
                        });
                        setSubscription(null);
                        toast.info('Your subscription has expired or no consultations remaining');
                        return false;
                    }

                    setSubscription(currentSub);
                    return true;
                }
                return false;
            }
            return false;
        } catch (error) {
            console.error('Error checking subscription:', error);
            toast.error('Error checking subscription status');
            return false;
        }
    };

    const updateSubscription = async (newSubscriptionData) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            
            if (!user) throw new Error('No user logged in');

            const userRef = doc(db, 'users', user.uid);
            
            // Get the latest data before updating
            const userDoc = await getDoc(userRef);
            const currentData = userDoc.data();
            
            // Merge with existing data
            const updatedSubscription = {
                ...currentData.currentSubscription,
                ...newSubscriptionData,
                lastUpdated: serverTimestamp()
            };

            await updateDoc(userRef, {
                currentSubscription: updatedSubscription
            });

            setSubscription(updatedSubscription);
            return true;
        } catch (error) {
            console.error('Error updating subscription:', error);
            toast.error('Error updating subscription');
            return false;
        }
    };

    // Add this function to refresh subscription data
    const refreshSubscriptionData = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            
            if (!user) return;

            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.currentSubscription) {
                    setSubscription(userData.currentSubscription);
                }
            }
        } catch (error) {
            console.error('Error refreshing subscription data:', error);
        }
    };

    // Add useEffect to refresh data periodically
    useEffect(() => {
        const interval = setInterval(refreshSubscriptionData, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <SubscriptionContext.Provider value={{
            subscription,
            setSubscription,
            checkSubscriptionStatus,
            updateSubscription,
            loading,
            setLoading
        }}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export const useSubscription = () => useContext(SubscriptionContext); 