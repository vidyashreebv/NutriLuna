import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, Droplet, Heart, Activity, Smile } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { doc, getDoc } from 'firebase/firestore';
import Navbarafter from '../../Components/Navbarafter';
import Footer from "../../Components/Footer";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../config/firebase";
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [periodData, setPeriodData] = useState({
    data: {
      lastPeriod: "Not available",
      cycleLength: 0,
      periodDuration: 0
    }
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPeriodData = async () => {
      if (!currentUser) {
        console.log("No current user found");
        setLoading(false);
        return;
      }

      try {
        console.log("Current user:", currentUser);
        console.log("User  ID:", currentUser?.uid);
        const userRef = doc(db, "users", currentUser.uid);

        // Add error handling for database connection
        if (!db) {
          throw new Error("Firebase database connection not established");
        }

        const docSnap = await getDoc(userRef);
        console.log("Document snapshot fetched");

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Period data from DB:", data.periodData.data);

          // Set period data with proper validation
          setPeriodData({
            data: {
              lastPeriod: data.periodData.data.lastPeriod || "Not available",
              cycleLength: data.periodData.data.cycleLength || 0,
              periodDuration: data.periodData.data.periodDuration || 0
            }
          });

          // Process chart data if history exists
          if (data.periodData.data.history && typeof data.periodData.data.history === "object") {
            const formattedChartData = Object.values(data.periodData.data.history)
              .slice(0, 6)
              .map(period => ({
                month: new Date(period.startDate).toLocaleString('default', { month: 'short' }),
                length: period.duration || 0
              }));
            setChartData(formattedChartData);
          } else {
            console.log("No history data available");
            setChartData([]);
          }
        } else {
          console.log("No period data found in document");
          // Initialize with default data
          setPeriodData({
            data: {
              lastPeriod: "Not tracked yet",
              cycleLength: 0,
              periodDuration: 0
            }
          });
          setChartData([]);
        }
      } catch (err) {
        console.error("Error details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPeriodData(); // Call the function inside useEffect
  }, [currentUser]); // Correctly close the useEffect hook

  const navItems = [
    { label: 'Home', href: '/landing' },
    { label: 'About', href: '/aboutusafter' },
    { label: 'Blog', href: '/blogafter' },
    { label: 'Track Your Periods', href: '/period' },
    { label: 'Diet Tracking', href: '/diet' },
    { label: 'Recipe Suggestions', href: 'recipe-suggestions.html' },
    { label: 'Consultation', href: 'consultation.html' },
    { label: 'My Profile', href: '/dashboard', active: true }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading your dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <p>Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Please log in to view your dashboard</div>
      </div>
    );
  }

  return (
    <main className="dashboard-main">
      <div className="dashboard-top-line" />
      <Navbarafter navItems={navItems} />

      <div className="dashboard-content-grid">
        <div className="dashboard-left-content">
          <div className="dashboard-tips-container">
            <h2 className="dashboard-section-title">Menstrual Health Tips</h2>
            <div className="dashboard-tips-grid">
              {[
                {
                  title: "Track Your Cycle",
                  description: "Keep a record of your menstrual cycle for better health management and predictions.",
                  icon: <Droplet className="dashboard-tip-icon" />
                },
                {
                  title: "Maintain Healthy Diet",
                  description: "A balanced diet rich in iron and vitamins helps manage menstrual symptoms.",
                  icon: <Heart className="dashboard-tip-icon" />
                },
                {
                  title: "Stay Active",
                  description: "Exercise helps alleviate cramps and boosts overall well-being during menstruation.",
                  icon: <Activity className="dashboard-tip-icon" />
                },
                {
                  title: "Relax & Manage Stress",
                  description: "Practice relaxation techniques such as yoga or meditation to reduce stress during your cycle.",
                  icon: <Smile className="dashboard-tip-icon" />
                }
              ].map((tip, index) => (
                <div key={index} className="dashboard-tip-card">
                  {tip.icon}
                  <div>
                    <h3 className="dashboard-tip-title">{tip.title}</h3>
                    <p className="dashboard-tip-description">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-cycle-container">
            <h2 className="dashboard-section-title">Cycle Tracker</h2>
            <div className="dashboard-cycle-grid">
              {[
                { day: new Date().getDate(), cycleDay: 1, event: "Start of Period" },
                { day: new Date().getDate() + 1, cycleDay: 2, event: "Heavy Flow" },
                { day: new Date().getDate() + 2, cycleDay: 3, event: "Light Flow" }
              ].map((day, index) => (
                <div key={index} className="dashboard-cycle-card">
                  <h3 className="dashboard-cycle-day">{day.day}</h3>
                  <p className="dashboard-cycle-number">Day {day.cycleDay}</p>
                  <span className="dashboard-cycle-event">{day.event}</span>
                  <button className="dashboard-button">Log Event</button>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-diet-container">
            <h2 className="dashboard-section-title">Diet Tracking</h2>
            <div className="dashboard-diet-grid">
              {[
                { title: "Calories Consumed", value: "1500 kcal" },
                { title: "Calories Burned", value: "1200 kcal" },
                { title: "Net Calories", value: "300 kcal" }
              ].map((stat, index) => (
                <div key={index} className="dashboard-diet-card">
                  <h3 className="dashboard-diet-title">{stat.title}</h3>
                  <p className="dashboard-diet-value">{stat.value}</p>
                </div>
              ))}
            </div>
            <button className="dashboard-button dashboard-button-full">Add Meal</button>
          </div>
        </div>

        <div className="dashboard-right-content">
          <div className="dashboard-stats-container">
            <h2 className="dashboard-section-title">Cycle Statistics</h2>
            <div className="dashboard-stats-grid">
              <div>
                <div className="dashboard-stats-card">
                  <h3 className="dashboard-stats-title">Last Period</h3>
                  <p className="dashboard-stats-value">{periodData.data.lastPeriod}</p>
                </div>
                <div className="dashboard-stats-card">
                  <h3 className="dashboard-stats-title">Cycle Length</h3>
                  <p className="dashboard-stats-value">
                    {periodData.data.cycleLength ? `${periodData.data.cycleLength} days` : "Not available"}
                  </p>
                </div>
                <div className="dashboard-stats-card">
                  <h3 className="dashboard-stats-title">Period Duration</h3>
                  <p className="dashboard-stats-value">
                    {periodData.data.periodDuration ? `${periodData.data.periodDuration} days` : "Not available"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-chart-container">
            <h2 className="dashboard-section-title">Period Length Over Time</h2>
            <div className="dashboard-chart-card">
              {chartData.length > 0 ? (
                <LineChart width={300} height={400} data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="length" stroke="#DC2626" />
                </LineChart>
              ) : (
                <div className="dashboard-no-data">
                  No period tracking data available yet
                </div>
              )}
              <p className="dashboard-chart-description">
                This chart shows the period duration over the past six months.
                {periodData.data.lastPeriod !== "Not available" && (
                  <span className="dashboard-last-period">
                    Last period started on: {periodData.data.lastPeriod}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Dashboard;