const express = require('express');
const router = express.Router();
const { admin, db } = require('../config/firebaseConfig');

// Verify login status
router.get('/verify-token', async (req, res) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided',
                isLoggedIn: false 
            });
        }

        // Verify the token
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // Get user dataimage.png
        const userRef = db.collection('users').doc(decodedToken.uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found',
                isLoggedIn: false 
            });
        }

        const userData = userDoc.data();

        res.json({
            success: true,
            isLoggedIn: true,
            user: {
                uid: decodedToken.uid,
                email: decodedToken.email,
                subscription: userData.currentSubscription || null
            }
        });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({
            success: false,
            message: 'Invalid token',
            isLoggedIn: false
        });
    }
});

// Purchase subscription - This will be stored inside user's document
router.post('/subscribe', async (req, res) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        const userId = decodedToken.uid;

        const { 
            packageType,  // 'basic', 'standard', 'premium'
            amount,
            consultationCount,
            validityDays
        } = req.body;

        // Create subscription data
        const subscriptionData = {
            packageType,
            amount,
            consultationCount,
            remainingConsultations: consultationCount,
            validityDays,
            startDate: admin.firestore.FieldValue.serverTimestamp(),
            endDate: admin.firestore.Timestamp.fromDate(
                new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000)
            ),
            status: 'active',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        try {
            // First, try to create/update the user document if it doesn't exist
            const userRef = db.collection('users').doc(userId);
            await userRef.set({
                email: decodedToken.email,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true }); // Using merge: true to not overwrite existing data

            // Now create the subscriptions subcollection
            const subscriptionRef = await userRef.collection('subscriptions').add(subscriptionData);

            // Update the user document with current subscription
            await userRef.update({
                currentSubscription: {
                    id: subscriptionRef.id,
                    packageType,
                    remainingConsultations: consultationCount,
                    endDate: subscriptionData.endDate,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                }
            });

            console.log('Subscription created successfully:', {
                userId,
                subscriptionId: subscriptionRef.id,
                packageType
            });

            res.status(201).json({
                success: true,
                message: 'Subscription purchased successfully',
                data: {
                    id: subscriptionRef.id,
                    ...subscriptionData
                }
            });
        } catch (dbError) {
            console.error('Database operation failed:', dbError);
            throw new Error('Failed to store subscription data');
        }
    } catch (error) {
        console.error('Error purchasing subscription:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error purchasing subscription'
        });
    }
});

// Get user's active subscription
router.get('/my-subscription', async (req, res) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        const userId = decodedToken.uid;

        // Get user document
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userData = userDoc.data();
        
        // If user has current subscription, get full details from subscriptions subcollection
        if (userData.currentSubscription) {
            const subscriptionDoc = await userRef
                .collection('subscriptions')
                .doc(userData.currentSubscription.id)
                .get();

            if (subscriptionDoc.exists) {
                return res.json({
                    success: true,
                    data: {
                        id: subscriptionDoc.id,
                        ...subscriptionDoc.data()
                    }
                });
            }
        }

        return res.json({
            success: true,
            data: null,
            message: 'No active subscription found'
        });
    } catch (error) {
        console.error('Error fetching subscription:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching subscription'
        });
    }
});

// Book a new consultation
router.post('/book', async (req, res) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        const userId = decodedToken.uid;

        // Check user's subscription
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userData = userDoc.data();
        const subscription = userData.currentSubscription;

        if (!subscription || !subscription.isActive) {
            return res.status(400).json({ 
                success: false, 
                message: 'No active subscription found' 
            });
        }

        if (subscription.remainingConsultations <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No consultations remaining' 
            });
        }

        // Create consultation and update subscription in a transaction
        await db.runTransaction(async (transaction) => {
            // Create consultation
            const consultationRef = db.collection('consultations').doc();
            transaction.set(consultationRef, {
                ...req.body,
                userId,
                status: 'pending',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

            // Update user's subscription
            const newRemainingConsultations = subscription.remainingConsultations - 1;
            const isActive = newRemainingConsultations > 0;
            
            transaction.update(userRef, {
                'currentSubscription.remainingConsultations': newRemainingConsultations,
                'currentSubscription.isActive': isActive
            });
        });

        res.status(200).json({
            success: true,
            message: 'Consultation booked successfully'
        });

    } catch (error) {
        console.error('Error booking consultation:', error);
        res.status(500).json({
            success: false,
            message: 'Error booking consultation',
            error: error.message
        });
    }
});

// Get user's consultations
router.get('/my-consultations', async (req, res) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        const userId = decodedToken.uid;

        const consultationsRef = db.collection('consultations');
        const snapshot = await consultationsRef
            .where('userId', '==', userId)
            .orderBy('appointmentDate', 'desc')
            .get();

        const consultations = [];
        snapshot.forEach(doc => {
            consultations.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.json({
            success: true,
            data: consultations
        });
    } catch (error) {
        console.error('Error fetching consultations:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching consultations'
        });
    }
});

// Cancel consultation
router.put('/cancel/:id', async (req, res) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        const userId = decodedToken.uid;

        const consultationId = req.params.id;
        const consultationRef = db.collection('consultations').doc(consultationId);
        const doc = await consultationRef.get();

        if (!doc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Consultation not found'
            });
        }

        const consultationData = doc.data();
        if (consultationData.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to cancel this consultation'
            });
        }

        if (consultationData.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Consultation is already cancelled'
            });
        }

        await consultationRef.update({
            status: 'cancelled',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({
            success: true,
            message: 'Consultation cancelled successfully'
        });
    } catch (error) {
        console.error('Error cancelling consultation:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling consultation'
        });
    }
});

// Check time slot availability
router.get('/check-availability', async (req, res) => {
    try {
        const { doctorId, appointmentDate, timeSlot } = req.query;

        const consultationsRef = db.collection('consultations');
        const existingBooking = await consultationsRef
            .where('doctorId', '==', doctorId)
            .where('appointmentDate', '==', appointmentDate)
            .where('timeSlot', '==', timeSlot)
            .where('status', 'in', ['pending', 'confirmed'])
            .get();

        res.json({
            success: true,
            available: existingBooking.empty
        });
    } catch (error) {
        console.error('Error checking availability:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking availability'
        });
    }
});

module.exports = router; 