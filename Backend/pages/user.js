const express = require("express");
const router = express.Router();
const { admin, db } = require("../config/firebaseConfig");
const authenticateUser = require("../middleware/authMiddleware");

// 🔹 Register New User
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Create user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });

    // Save user details in Firestore
    await db.collection("users").doc(userRecord.uid).set({
      username,
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: "User registered successfully", userId: userRecord.uid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Login User (Validate Credentials)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Firebase Admin SDK doesn't handle password authentication
    return res.status(400).json({
      error: "Direct password authentication isn't supported by Firebase Admin SDK.",
    });

    // 🔹 Instead, use Firebase Client SDK for user login from the frontend.
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Single route for user profile
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    console.log('Fetching profile for user:', req.user.uid);
    
    // Get user document from Firestore
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      console.log('No user document found for:', req.user.uid);
      return res.status(200).json({ 
        username: req.user.email 
      });
    }

    const userData = userDoc.data();
    console.log('Found user data:', userData);

    res.status(200).json({
      username: userData.username || req.user.email
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ 
      username: req.user.email,
      error: 'Failed to fetch user profile' 
    });
  }
});

module.exports = router;
