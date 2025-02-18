const express = require("express");
const router = express.Router();
const { admin, db } = require("../config/firebaseConfig");

// 🔹 Middleware to verify the Firebase ID token
const verifyToken = async (req, res, next) => {
    console.log("🔍 Incoming Headers:", req.headers);  // ✅ Log headers to check if token is being sent

    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
        console.log("❌ No token found in request headers.");
        return res.status(403).json({ error: "Unauthorized - No Token Provided" });
    }

    try {
        console.log("🔍 Verifying Token:", token);
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log("✅ Token Verified:", decodedToken);  // ✅ Log decoded token

        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("❌ Firebase Auth Error:", error.message);
        return res.status(403).json({ error: "Unauthorized - Invalid Token" });
    }
};
router.use(verifyToken);
// 🔹 Middleware to verify the Firebase ID tokenn

// 🔹 Fetch Period Data
router.get("/getPeriodData", verifyToken, async (req, res) => {
    const userId = req.user.uid;
    console.log("User ID:", userId);

    try {
        // Get the main period data document
        const mainDoc = await db.collection("users").doc(userId)
            .collection("periodData").doc("data").get();

        if (!mainDoc.exists) {
            return res.status(404).json({ 
                error: "No period data found for this user.",
                periodsHistory: []
            });
        }

        const mainData = mainDoc.data();
        
        // Get history collection
        const historySnapshot = await db.collection("users").doc(userId)
            .collection("periodData").doc("data")
            .collection("history").orderBy("startDate", "desc").get();

        let periodsHistory = [];
        
        // If there's no history but we have main data, this means we need to migrate
        if (historySnapshot.empty && mainData.lastPeriod) {
            // Create initial history entry from main data
            const initialHistory = {
                startDate: mainData.lastPeriod,
                duration: parseInt(mainData.periodDuration),
                cycleLength: parseInt(mainData.cycleLength),
                createdAt: mainData.updatedAt || admin.firestore.FieldValue.serverTimestamp()
            };

            // Save the initial history
            await db.collection("users").doc(userId)
                .collection("periodData").doc("data")
                .collection("history").add(initialHistory);

            periodsHistory = [initialHistory];
        } else {
            // Use existing history
            historySnapshot.forEach(doc => {
                periodsHistory.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
        }

        const responseData = {
            ...mainData,
            periodsHistory,
            updatedAt: mainData.updatedAt ? 
                new Date(mainData.updatedAt._seconds * 1000).toISOString() : 
                null
        };

        console.log("Sending response with history:", responseData);
        res.status(200).json(responseData);
    } catch (error) {
        console.error("Error fetching period data:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post("/savePeriodData", verifyToken, async (req, res) => {
    const userId = req.user.uid;
    const { lastPeriod, cycleLength, periodDuration } = req.body;

    if (!lastPeriod || !cycleLength || !periodDuration) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Start a batch write
        const batch = db.batch();

        // Reference to main document
        const mainDocRef = db.collection("users").doc(userId)
            .collection("periodData").doc("data");

        // Reference to new history document
        const newHistoryRef = mainDocRef.collection("history").doc();

        // Prepare the period data
        const periodData = {
            lastPeriod,
            cycleLength: parseInt(cycleLength),
            periodDuration: parseInt(periodDuration),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        // Prepare the history entry
        const historyData = {
            startDate: lastPeriod,
            duration: parseInt(periodDuration),
            cycleLength: parseInt(cycleLength),
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        // Add to batch
        batch.set(mainDocRef, periodData);
        batch.set(newHistoryRef, historyData);

        // Commit the batch
        await batch.commit();

        res.status(200).json({ 
            message: "Period data saved successfully.",
            periodId: newHistoryRef.id
        });
    } catch (error) {
        console.error("Error saving period data:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;