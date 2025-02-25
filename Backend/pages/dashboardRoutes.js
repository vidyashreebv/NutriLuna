const express = require("express");
const router = express.Router();
const { admin } = require("../config/firebaseConfig");
const { fetchDashboardPeriodData } = require("./dashboardService");

// Reuse the verifyToken middleware from periodtrack.js
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
        return res.status(403).json({ error: "Unauthorized - No Token Provided" });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("Firebase Auth Error:", error.message);
        return res.status(403).json({ error: "Unauthorized - Invalid Token" });
    }
};

router.get("/data", verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const dashboardData = await fetchDashboardPeriodData(userId);
        res.status(200).json(dashboardData);
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
});

module.exports = router; 