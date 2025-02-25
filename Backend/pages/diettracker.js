const express = require("express");
const router = express.Router();
const { admin, db } = require("../config/firebaseConfig");
const authenticateUser = require("../middleware/authMiddleware");

// Middleware to verify token
const verifyToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            console.log("❌ No authorization header");
            return res.status(403).json({ error: "No authorization header" });
        }

        const token = req.headers.authorization.split("Bearer ")[1];
        if (!token) {
            console.log("❌ No token in authorization header");
            return res.status(403).json({ error: "No token provided" });
        }

        console.log("🟢 Verifying token:", token.substring(0, 10) + "...");
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        if (!decodedToken.uid) {
            console.log("❌ No UID in decoded token");
            return res.status(403).json({ error: "Invalid token - no UID" });
        }

        req.user = decodedToken;
        console.log("🟢 Successfully authenticated user:", decodedToken.uid);
        next();
    } catch (error) {
        console.error("❌ Authentication error:", error);
        res.status(403).json({ error: "Authentication failed" });
    }
};

// Get today's meals
router.get("/today", verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        console.log("🟢 Fetching meals for user ID:", userId);

        // Get today's date as string in YYYY-MM-DD format
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        console.log("🟢 Fetching meals for date:", todayString);

        // Query the dietLogs collection
        const mealsSnapshot = await db.collection("users")
            .doc(userId)
            .collection("dietLogs")
            .where("date", "==", todayString)
            .get();

        console.log("🟢 Found", mealsSnapshot.size, "meals");

        let meals = [];
        let totalCalories = 0;

        mealsSnapshot.forEach(doc => {
            const data = doc.data();
            console.log("🟢 Processing meal:", data);
            
            const meal = {
                id: doc.id,
                name: data.foodName,
                calories: parseInt(data.calories) || 0,
                type: data.mealType,
                date: data.date
            };
            
            meals.push(meal);
            totalCalories += meal.calories;
        });

        console.log("🟢 Processed meals:", meals);
        console.log("🟢 Total calories:", totalCalories);

        res.status(200).json({
            meals,
            totalCalories
        });

    } catch (error) {
        console.error("❌ Error fetching meals:", error);
        res.status(500).json({ 
            error: "Failed to fetch meals",
            details: error.message
        });
    }
});

// **Add a new diet log**
router.post("/add", verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        console.log("🟢 Adding meal for user:", userId);

        const { mealType, foodName, calories } = req.body;
        
        // Get today's date as string in YYYY-MM-DD format
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];

        const mealData = {
            mealType,
            foodName,
            calories: calories.toString(), // Store as string to match existing format
            date: dateString,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        console.log("🟢 Saving meal data:", mealData);

        const mealRef = await db.collection("users")
            .doc(userId)
            .collection("dietLogs")
            .add(mealData);

        console.log("🟢 Meal saved with ID:", mealRef.id);

        res.status(200).json({
            message: "Meal saved successfully",
            mealId: mealRef.id
        });

    } catch (error) {
        console.error("❌ Error saving meal:", error);
        res.status(500).json({ 
            error: "Failed to save meal",
            details: error.message
        });
    }
});

// **Fetch all diet logs for a user**
router.get("/:userId", authenticateUser, async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("🟢 Fetching diet logs for user:", userId);

    const logsSnapshot = await db
      .collection("users")
      .doc(userId)
      .collection("dietLogs")
      .orderBy("date", "desc")
      .get();

    console.log("🟢 Logs snapshot size:", logsSnapshot.size);

    const dietLogs = logsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date.toDate ? data.date.toDate() : new Date(data.date) // Convert Firestore timestamp
      };
    });

    console.log("🟢 Retrieved logs:", JSON.stringify(dietLogs, null, 2));

    const todayDate = new Date().toDateString();
    const yesterdayDate = new Date(Date.now() - 86400000).toDateString();

    res.status(200).json({
      today: dietLogs.filter(log => log.date.toDateString() === todayDate),
      yesterday: dietLogs.filter(log => log.date.toDateString() === yesterdayDate),
      earlier: dietLogs.filter(log => log.date.toDateString() < yesterdayDate)
    });

  } catch (error) {
    console.error("❌ Error fetching diet logs:", error);
    res.status(500).json({ error: "Failed to fetch diet logs" });
  }
});


// **Update a diet log**
router.put("/:logId", authenticateUser, async (req, res) => {
  const { logId } = req.params;
  const { mealType, foodName, calories, date } = req.body;
  const userId = req.user.uid;

  try {
    const dietLogRef = db.collection("users").doc(userId).collection("dietLogs").doc(logId);
    await dietLogRef.update({ mealType, foodName, calories, date });

    res.status(200).json({ message: "Diet log updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update diet log" });
  }
});

// **Delete a diet log**
router.delete("/:logId", authenticateUser, async (req, res) => {
  const { logId } = req.params;
  const userId = req.user.uid;

  try {
    await db.collection("users").doc(userId).collection("dietLogs").doc(logId).delete();
    res.status(200).json({ message: "Diet log deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete diet log" });
  }
});

module.exports = router; // ✅ Ensure router is exported correctly

