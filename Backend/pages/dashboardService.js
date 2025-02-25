const { admin, db } = require("../config/firebaseConfig");

const fetchDashboardPeriodData = async (userId) => {
    try {
        // Get the main period data document
        const mainDoc = await db.collection("users").doc(userId)
            .collection("periodData").doc("data").get();

        if (!mainDoc.exists) {
            return {
                periodData: {
                    data: {
                        lastPeriod: "Not available",
                        cycleLength: 0,
                        periodDuration: 0
                    }
                },
                chartData: []
            };
        }

        const mainData = mainDoc.data();
        
        // Get history collection
        const historySnapshot = await db.collection("users").doc(userId)
            .collection("periodData").doc("data")
            .collection("history").orderBy("startDate", "desc").limit(6).get();

        let chartData = [];
        historySnapshot.forEach(doc => {
            const periodData = doc.data();
            chartData.push({
                month: new Date(periodData.startDate).toLocaleString('default', { month: 'short' }),
                length: periodData.duration || 0
            });
        });

        return {
            periodData: {
                data: {
                    lastPeriod: mainData.lastPeriod || "Not available",
                    cycleLength: mainData.cycleLength || 0,
                    periodDuration: mainData.periodDuration || 0
                }
            },
            chartData: chartData.reverse() // Show oldest to newest
        };
    } catch (error) {
        console.error("Error in fetchDashboardPeriodData:", error);
        throw error;
    }
};

module.exports = {
    fetchDashboardPeriodData
};