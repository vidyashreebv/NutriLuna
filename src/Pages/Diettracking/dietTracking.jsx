import React, { useState } from "react";
import "./dietTracking.css";

const DietTracker = () => {
  const [meals, setMeals] = useState({
    today: [],
    yesterday: [],
    earlier: [],
  });

  // Function to add a meal to the Today section
  const addMeal = () => {
    const foodName = document.getElementById("foodName").value;
    const calories = document.getElementById("calories").value;
    const mealType = document.getElementById("mealType").value;

    // Get current time
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    // Create a new meal object
    const newMeal = {
      foodName,
      calories,
      mealType,
      time: timeString,
    };

    // Add the new meal to the "Today" section and update the state
    setMeals((prevMeals) => ({
      ...prevMeals,
      today: [newMeal, ...prevMeals.today],  // Add new meal at the top
    }));

    // Clear the input fields after adding the meal
    document.getElementById("foodName").value = "";
    document.getElementById("calories").value = "";
    document.getElementById("mealType").value = "breakfast";
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    const headerHeight = document.querySelector(".fixed-header").offsetHeight;
    const sectionRect = section.getBoundingClientRect();
    const scrollPosition =
      window.pageYOffset + sectionRect.top - headerHeight - 20;

    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className="indicator"></div>
      <nav>
        <div className="logo-container">
          <img src="Menstrual Cycle.svg" alt="" height="40px" />
          <div>NutriLuna</div>
        </div>
        <div className="nav-options">
          <a href="indexafterlogin.html" className="nav-item">
            Home
          </a>
          <a href="aboutafterlogin.html" className="nav-item">
            About
          </a>
          <a href="blogafterlogin.html" className="nav-item">
            Blog
          </a>
          <a href="period-tracker.html" className="nav-item">
            Track Your Periods
          </a>
          <a href="diet-tracking.html" className="nav-item active">
            Diet Tracking
          </a>
          <a href="recipe-suggestions.html" className="nav-item">
            Recipe Suggestions
          </a>
          <a href="consultation.html" className="nav-item">
            Consultation
          </a>
          <a href="dashboard.html" className="nav-item">
            My Profile
          </a>
          <a href="index.html" className="nav-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 48 48"
            >
              <path
                d="M24 4A10 10 0 1024 24 10 10 0 1024 4zM36.021 28H11.979C9.785 28 8 29.785 8 31.979V33.5c0 3.312 1.885 6.176 5.307 8.063C16.154 43.135 19.952 44 24 44c7.706 0 16-3.286 16-10.5v-1.521C40 29.785 38.215 28 36.021 28z"
              ></path>
            </svg>
            Sign Out
          </a>
        </div>
      </nav>
      <div className="container">
        <div className="fixed-header">
          <h1>Diet Tracker</h1>
          <div className="meal-form">
            <input
              type="text"
              id="foodName"
              placeholder="Food Name"
              required
            />
            <input
              type="number"
              id="calories"
              placeholder="Calories"
              required
            />
            <select id="mealType">
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
            <button onClick={addMeal}>Add Meal</button>
          </div>
          <div className="timeline-nav">
            <button onClick={() => scrollToSection("today")} className="active">
              Today
            </button>
            <button onClick={() => scrollToSection("yesterday")}>Yesterday</button>
            <button onClick={() => scrollToSection("earlier")}>Last 7 Days</button>
          </div>
        </div>

        {/* Today's Section */}
        <div id="today" className="day-section">
          <div className="day-header">
            <h2>Today</h2>
            <span>January 6, 2025</span>
          </div>
          <div className="day-summary">
            <p>Total Calories: {meals.today.reduce((total, meal) => total + Number(meal.calories), 0)} | Meals: {meals.today.length}</p>
          </div>
          <div className="meal-list">
            {meals.today.map((meal, index) => (
              <div className="meal-card" key={index}>
                <div className="meal-info">
                  <span className={`meal-type ${meal.mealType}`}>
                    {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
                  </span>
                  <h3>{meal.foodName}</h3>
                  <p>{meal.calories} calories</p>
                  <span className="meal-time">{meal.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Yesterday's Section */}
        <div id="yesterday" className="day-section">
          <div className="day-header">
            <h2>Yesterday</h2>
            <span>January 5, 2025</span>
          </div>
          <div className="day-summary">
            <p>Total Calories: 2,100 | Meals: 5</p>
          </div>
          <div className="meal-list">
            <div className="meal-card">
              <div className="meal-info">
                <span className="meal-type dinner">Dinner</span>
                <h3>Salmon with Roasted Vegetables</h3>
                <p>550 calories</p>
                <span className="meal-time">7:00 PM</span>
              </div>
            </div>
            <div className="meal-card">
              <div className="meal-info">
                <span className="meal-type snack">Snack</span>
                <h3>Mixed Nuts</h3>
                <p>250 calories</p>
                <span className="meal-time">4:30 PM</span>
              </div>
            </div>
            <div className="meal-card">
              <div className="meal-info">
                <span className="meal-type lunch">Lunch</span>
                <h3>Turkey Sandwich</h3>
                <p>450 calories</p>
                <span className="meal-time">12:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Day Before Yesterday Section */}
        <div id="earlier" className="day-section">
          <div className="day-header">
            <h2>January 4, 2025</h2>
            <span>2 days ago</span>
          </div>
          <div className="day-summary">
            <p>Total Calories: 1,950 | Meals: 4</p>
          </div>
          <div className="meal-list">
            <div className="meal-card">
              <div className="meal-info">
                <span className="meal-type dinner">Dinner</span>
                <h3>Vegetable Stir Fry</h3>
                <p>400 calories</p>
                <span className="meal-time">6:45 PM</span>
              </div>
            </div>
            <div className="meal-card">
              <div className="meal-info">
                <span className="meal-type lunch">Lunch</span>
                <h3>Chickpea Curry</h3>
                <p>550 calories</p>
                <span className="meal-time">1:15 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietTracker;
