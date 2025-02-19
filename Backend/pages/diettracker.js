const express = require("express");
const router = express.Router();
const { db } = require("../config/firebaseConfig");
const authenticateUser = require("../middleware/authMiddleware");

// **Add a new diet log**
router.post("/add", authenticateUser, async (req, res) => {
  const { mealType, foodName, calories, date } = req.body;
  const userId = req.user.uid; // Extract userId from the decoded token

  if (!userId || !mealType || !foodName || !date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const dietLogRef = db.collection("users").doc(userId).collection("dietLogs").doc();
    await dietLogRef.set({
      mealType,
      foodName,
      calories,
      date,
      createdAt: new Date(),
    });

    res.status(200).json({ message: "Diet log added successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add diet log" });
  }
});

// **Fetch all diet logs for a user**
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

