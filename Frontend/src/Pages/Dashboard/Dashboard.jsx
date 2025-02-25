import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, Droplet, Heart, Activity, Smile } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Navbarafter from '../../Components/Navbarafter';
import Footer from "../../Components/Footer";
import { useAuth } from "../../context/AuthContext";
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
  const [dietData, setDietData] = useState({
    totalCalories: 0,
    meals: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchPeriodData = async () => {
      if (!currentUser) {
        console.log("No current user found");
        setLoading(false);
        return;
      }

      try {
        const token = await currentUser.getIdToken(true);
        console.log("Fetching data with token:", token.substring(0, 10) + "...");

        const response = await fetch("http://localhost:5001/api/dashboard/data", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: 'include'
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Server responded with ${response.status}: ${errorData}`);
        }

        const data = await response.json();
        console.log("Received data:", data);

        setPeriodData(data.periodData);
        setChartData(data.chartData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchPeriodData();
  }, [currentUser]);

  useEffect(() => {
    const fetchDietData = async () => {
      if (!currentUser) {
        console.log("No current user found");
        setDietData(prev => ({
          ...prev,
          loading: false,
          error: "Please log in to view your diet data"
        }));
        return;
      }

      try {
        console.log("Fetching diet data for user:", currentUser.uid);
        const token = await currentUser.getIdToken(true);
        
        if (!token) {
          throw new Error("Failed to get authentication token");
        }

        const response = await fetch("http://localhost:5001/api/diettracker/today", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server error response:", errorText);
          throw new Error(`Server error: ${errorText}`);
        }

        const data = await response.json();
        console.log("Received diet data:", data);

        setDietData({
          totalCalories: data.totalCalories || 0,
          meals: data.meals || [],
          loading: false,
          error: null
        });
      } catch (err) {
        console.error("Error fetching diet data:", err);
        setDietData(prev => ({
          ...prev,
          loading: false,
          error: err.message || "Failed to load diet data"
        }));
      }
    };

    if (currentUser) {
      fetchDietData();
    }
  }, [currentUser]);

  const navItems = [
    { label: 'Home', href: '/landing' },
        { label: 'About', href: '/aboutusafter' },
        { label: 'Blog', href: '/blogafter' },
        { label: 'Track Your Periods', href: '/period'},
        { label: 'Diet Tracking', href: '/diet'},
        { label: 'Recipe Suggestions', href: '/recipe' },
        { label: 'Consultation', href: 'consultation' },
        { label: 'My Profile', href: '/dashboard' , active: true  }
  ];

  const calculateCycleDays = () => {
    if (!periodData.data.lastPeriod || periodData.data.lastPeriod === "Not available") {
      return [];
    }

    const lastPeriodDate = new Date(periodData.data.lastPeriod);
    const today = new Date();
    const diffTime = Math.abs(today - lastPeriodDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate cycle day (1-based)
    const cycleDay = (diffDays % (periodData.data.cycleLength || 28)) + 1;
    
    return [
      { 
        day: lastPeriodDate.getDate(), 
        cycleDay: 1, 
        event: "Start of Period",
        date: lastPeriodDate
      },
      { 
        day: new Date(lastPeriodDate.getTime() + 24 * 60 * 60 * 1000).getDate(), 
        cycleDay: 2, 
        event: cycleDay <= periodData.data.periodDuration ? "Heavy Flow" : "Regular Day",
        date: new Date(lastPeriodDate.getTime() + 24 * 60 * 60 * 1000)
      },
      { 
        day: new Date(lastPeriodDate.getTime() + 2 * 24 * 60 * 60 * 1000).getDate(), 
        cycleDay: 3, 
        event: cycleDay <= periodData.data.periodDuration ? "Light Flow" : "Regular Day",
        date: new Date(lastPeriodDate.getTime() + 2 * 24 * 60 * 60 * 1000)
      }
    ];
  };

  const calculatePeriodStatus = (lastPeriod, cycleLength) => {
    if (!lastPeriod || !cycleLength) return null;

    const lastPeriodDate = new Date(lastPeriod);
    const today = new Date();
    const nextPeriodDate = new Date(lastPeriodDate);
    nextPeriodDate.setDate(lastPeriodDate.getDate() + parseInt(cycleLength));

    const diffTime = nextPeriodDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      // Period is late
      return {
        status: 'late',
        days: Math.abs(diffDays),
        nextDate: nextPeriodDate
      };
    } else {
      // Period is upcoming
      return {
        status: 'upcoming',
        days: diffDays,
        nextDate: nextPeriodDate
      };
    }
  };

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
    <>
    <main className="dashboard-main">
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

          <div className="dashboard-period-container">
            <h2 className="dashboard-section-title">Period Tracker</h2>
            {periodData.data.lastPeriod === "Not available" ? (
              <div className="dashboard-no-data">
                No period tracking data available. Please add your period data.
              </div>
            ) : (
              <>
                <div className="dashboard-period-status">
                  {(() => {
                    const status = calculatePeriodStatus(
                      periodData.data.lastPeriod,
                      periodData.data.cycleLength
                    );
                    
                    if (!status) return null;

                    return (
                      <div className={`period-status-card ${status.status}`}>
                        <div className="status-icon">
                          {status.status === 'late' ? '⚠️' : '📅'}
                        </div>
                        <div className="status-text">
                          {status.status === 'late' ? (
                            <>
                              <h3>Period is {status.days} days late</h3>
                              <p>Expected date was {status.nextDate.toLocaleDateString()}</p>
                            </>
                          ) : (
                            <>
                              <h3>Next period in {status.days} days</h3>
                              <p>Expected on {status.nextDate.toLocaleDateString()}</p>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
                
                <div className="dashboard-cycle-grid">
                  {calculateCycleDays().map((day, index) => (
                    <div key={index} className="dashboard-cycle-card">
                      <h3 className="dashboard-cycle-day">
                        {day.date.toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                      </h3>
                      <p className="dashboard-cycle-number">Day {day.cycleDay}</p>
                      <span className="dashboard-cycle-event">{day.event}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="dashboard-diet-container">
            <h2 className="dashboard-section-title">Diet Tracking</h2>
            {dietData.loading ? (
              <div className="dashboard-loading">Loading diet data...</div>
            ) : dietData.error ? (
              <div className="dashboard-error">{dietData.error}</div>
            ) : (
              <>
                <div className="dashboard-diet-grid">
                  <div className="dashboard-diet-card">
                    <h3 className="dashboard-diet-title">Calories Consumed</h3>
                    <p className="dashboard-diet-value">{dietData.totalCalories} kcal</p>
                  </div>
                  <div className="dashboard-diet-card">
                    <h3 className="dashboard-diet-title">Meals Today</h3>
                    <p className="dashboard-diet-value">{dietData.meals.length}</p>
                  </div>
                  <div className="dashboard-diet-card">
                    <h3 className="dashboard-diet-title">Daily Goal</h3>
                    <p className="dashboard-diet-value">2000 kcal</p>
                  </div>
                </div>

                <div className="dashboard-recent-meals">
                  <h3 className="dashboard-diet-subtitle">Recent Meals</h3>
                  {dietData.meals.length > 0 ? (
                    <div className="dashboard-meals-list">
                      {dietData.meals.slice(0, 3).map((meal, index) => (
                        <div key={index} className="dashboard-meal-item">
                          <div className="dashboard-meal-info">
                            <span className="dashboard-meal-name">{meal.name}</span>
                            <span className="dashboard-meal-type">{meal.type}</span>
                          </div>
                          <span className="dashboard-meal-calories">
                            {parseInt(meal.calories) || 0} cal
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="dashboard-no-meals">No meals tracked today</p>
                  )}
                </div>

                <a href="/diet" className="dashboard-button dashboard-button-full">
                  Track New Meal
                </a>
              </>
            )}
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
    </main>
          <Footer />
    </>
  );
};

export default Dashboard;