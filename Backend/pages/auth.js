const express = require('express');
const router = express.Router();
const { admin } = require('../config/firebaseConfig');

// Create custom token with 14-day expiry
router.post('/create-token', async (req, res) => {
  try {
    const { uid } = req.body;
    
    // Create a custom token with 14-day expiry
    const customToken = await admin.auth().createCustomToken(uid, {
      expiresIn: '14d' // 14 days
    });

    res.json({ token: customToken });
  } catch (error) {
    console.error('Error creating custom token:', error);
    res.status(500).json({ error: 'Failed to create token' });
  }
});

// Refresh token endpoint
router.post('/refresh-token', async (req, res) => {
  try {
    const { uid } = req.body;
    
    // Create a new token with 14-day expiry
    const newToken = await admin.auth().createCustomToken(uid, {
      expiresIn: '14d'
    });

    res.json({ token: newToken });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

// Check token validity
router.post('/check-token', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      isValid: false, 
      message: 'No token provided' 
    });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token, true);
    const currentTime = Math.floor(Date.now() / 1000);
    const fourteenDaysInSeconds = 14 * 24 * 60 * 60;
    
    const isValid = decodedToken.iat + fourteenDaysInSeconds > currentTime;
    
    console.log('Token check:', {
      isValid,
      tokenCreated: new Date(decodedToken.iat * 1000),
      currentTime: new Date(currentTime * 1000),
      expiresAt: new Date((decodedToken.iat + fourteenDaysInSeconds) * 1000)
    });

    return res.json({ 
      isValid,
      message: isValid ? 'Token is valid' : 'Token has expired',
      user: decodedToken
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ 
      isValid: false, 
      message: 'Invalid token' 
    });
  }
});

module.exports = router; 