const express = require('express');
const router = express.Router();
const { admin, db } = require('../config/firebaseConfig');

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Set PIN
router.post('/set', verifyToken, async (req, res) => {
    try {
        const { pin } = req.body;
        const userId = req.user.uid;

        if (!pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
            return res.status(400).json({ error: 'Invalid PIN format. Must be 4 digits.' });
        }

        await db.collection('userPins').doc(userId).set({
            pin,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ success: true, message: 'PIN set successfully' });
    } catch (error) {
        console.error('Error setting PIN:', error);
        res.status(500).json({ error: 'Failed to set PIN' });
    }
});

// Verify PIN
router.post('/verify', verifyToken, async (req, res) => {
    try {
        const { pin } = req.body;
        const userId = req.user.uid;

        const pinDoc = await db.collection('userPins').doc(userId).get();
        
        if (!pinDoc.exists) {
            return res.status(404).json({ error: 'PIN not set' });
        }

        const storedPin = pinDoc.data().pin;
        const isValid = pin === storedPin;

        res.json({ 
            success: true, 
            isValid,
            isPinSet: true
        });
    } catch (error) {
        console.error('Error verifying PIN:', error);
        res.status(500).json({ error: 'Failed to verify PIN' });
    }
});

// Check if PIN is set
router.get('/status', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const pinDoc = await db.collection('userPins').doc(userId).get();
        
        res.json({ 
            success: true, 
            isPinSet: pinDoc.exists 
        });
    } catch (error) {
        console.error('Error checking PIN status:', error);
        res.status(500).json({ error: 'Failed to check PIN status' });
    }
});

module.exports = router;
