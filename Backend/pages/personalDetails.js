const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// Firestore instance
const db = admin.firestore();
const usersCollection = db.collection("users");

// Middleware to get user ID from request
const getUserDoc = async (userId) => {
    return usersCollection.doc(userId).collection("personalDetails");
};
// Save personal details for a user
router.post("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const userRef = await getUserDoc(userId);
        await userRef.doc("profile").set(req.body, { merge: true });

        res.status(201).json({ message: "Personal details saved" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Retrieve personal details for a user
router.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const userRef = await getUserDoc(userId);
        const snapshot = await userRef.get();
        
        if (snapshot.empty) {
            return res.status(404).json({ message: "No personal details found" });
        }

        let details = [];
        snapshot.forEach(doc => details.push({ id: doc.id, ...doc.data() }));

        res.status(200).json(details);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
