import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAr--QBGH8ed01xXD9VTKm7LGdve8JAIZw",
  authDomain: "nutri-luna.firebaseapp.com",
  projectId: "nutri-luna",
  storageBucket: "nutri-luna",
  messagingSenderId: "75642002726",
  appId: "1:75642002726:web:6b82ca7f749826d127f5e7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;

const express = require("express");
const { db, admin } = require("../config/firebaseConfig");

const router = express.Router();

// Middleware to verify the user is authenticated using Firebase ID Token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];  // Get token from the Authorization header
  
  if (!token) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token); // Verify the token
    req.userId = decodedToken.uid;  // Attach the userId to the request
    next();  // Proceed to the next middleware/route handler
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// 🔹 Save Period Data
router.post("/savePeriodData", verifyToken, async (req, res) => {
  const { lastPeriod, cycleLength, periodDuration } = req.body;
  
  if (!lastPeriod || !cycleLength || !periodDuration) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const userRef = db.collection("periodTracker").doc(req.userId);  // Use authenticated user ID
    
    // Save period tracking data in Firestore under user ID
    await userRef.set({ lastPeriod, cycleLength, periodDuration });
    
    res.status(200).json({ message: "Period data saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Fetch Period Data
router.get("/getPeriodData", verifyToken, async (req, res) => {
  try {
    const periodRef = db.collection("periodTracker").doc(req.userId);  // Use authenticated user ID
    // Save period tracking data in Firestore under user ID
    await userRef.set({ lastPeriod, cycleLength, periodDuration });
    const doc = await periodRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: "No period data found for this user" });
    }

    res.status(200).json(doc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
