// pages/dashboardstat.js
const express = require('express');
const { admin, db } = require('../config/firebaseConfig');
const router = express.Router();

// Middleware to verify Firebase auth token
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// GET endpoint to fetch period statistics
router.get('/getPeriodData', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    
    // Reference to the user's document in Firestore
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    const periodsHistory = userData.periodData || [];

    // Sort periods by date (newest first)
    const sortedPeriods = periodsHistory.sort((a, b) => 
      new Date(b.startDate) - new Date(a.startDate)
    );

    // Calculate cycle lengths between periods
    const cycleLengths = sortedPeriods.slice(1).map((period, index) => {
      const currentStart = new Date(period.startDate);
      const prevStart = new Date(sortedPeriods[index].startDate);
      return Math.round((prevStart - currentStart) / (1000 * 60 * 60 * 24));
    });

    // Calculate statistics
    const stats = {
      periodsHistory: sortedPeriods,
      averageCycle: cycleLengths.length ? 
        Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length) : 0,
      longestCycle: cycleLengths.length ? Math.max(...cycleLengths) : 0,
      shortestCycle: cycleLengths.length ? Math.min(...cycleLengths) : 0,
      lastPeriodStart: sortedPeriods[0]?.startDate || null,
      // For the chart - get last 6 periods
      chartData: sortedPeriods.slice(0, 6).map(period => ({
        month: new Date(period.startDate).toLocaleString('default', { month: 'short' }),
        length: period.duration
      }))
    };

    res.json(stats);

  } catch (error) {
    console.error('Error fetching period statistics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch period statistics',
      details: error.message 
    });
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Route error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    details: err.message 
  });
});

module.exports = router;