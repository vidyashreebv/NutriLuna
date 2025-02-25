import React, { useState, useEffect, useRef } from "react";
import { ChevronUp, Plus, Trash2, Edit2 } from "lucide-react";
import { auth, db } from "../../config/firebase"; // Ensure Firebase is imported
import "./dietTracking.css";
import axios from "axios";
import Navbarafter from "../../Components/Navbarafter";





const DietTracker = () => {
  // State management
  const [meals, setMeals] = useState({ today: [], yesterday: [], earlier: [] });
  const [user, setUser] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState("today");
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [hoveredMeal, setHoveredMeal] = useState(null);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [isAddButtonHovered, setIsAddButtonHovered] = useState(false);
  const [isScrollButtonHovered, setIsScrollButtonHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(null);

  // Refs
  const navbarRef = useRef(null);
  const fixedHeaderRef = useRef(null);

  const navItems = [
    { label: 'Home', href: '/landing' },
        { label: 'About', href: '/aboutusafter' },
        { label: 'Blog', href: '/blogafter' },
        { label: 'Track Your Periods', href: '/period'},
        { label: 'Diet Tracking', href: '/diet' , active: true },
        { label: 'Recipe Suggestions', href: '/recipe' },
        { label: 'Consultation', href: 'consultation' },
        { label: 'My Profile', href: '/dashboard' }
  ];

  // Format date helper
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate relative date
  const getRelativeDate = (date) => {
    const today = new Date();
    const diffTime = Math.ceil((today - new Date(date)) / (1000 * 60 * 60 * 24));
    if (diffTime === 1) return "Yesterday";
    if (diffTime <= 7) return `${diffTime} days ago`;
    return formatDate(date);
  };


    // Layout effects
    useEffect(() => {
      const updateNavbarHeight = () => {
        if (navbarRef.current) {
          setNavbarHeight(navbarRef.current.offsetHeight);
        }
      };
  
      const updateHeaderHeight = () => {
        if (fixedHeaderRef.current) {
          setHeaderHeight(fixedHeaderRef.current.offsetHeight);
        }
      };
  
      const handleResize = () => {
        updateNavbarHeight();
        updateHeaderHeight();
      };
  
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        setShowScrollTop(currentScrollY > 200);
        setIsHeaderVisible(currentScrollY < lastScrollY || currentScrollY < 100);
        setLastScrollY(currentScrollY);
      };
  
      // Initial setup
      updateNavbarHeight();
      setTimeout(updateHeaderHeight, 100);
  
      // Event listeners
      window.addEventListener('resize', handleResize);
      window.addEventListener("scroll", handleScroll, { passive: true });
  
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener("scroll", handleScroll);
      };
    }, [lastScrollY]);
   
  
  // Fetch user and set state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Fetch Meals
  const fetchMealsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userId = auth.currentUser?.uid; // Use the logged-in user's ID
    
    if (!userId) {
      throw new Error('User ID is not available');
    }

      if (!user) {
        setError('Please sign in to view your meals');
        setIsLoading(false);
        return;
      }
  
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get(`http://localhost:5001/api/diettracker/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
  
      console.log("✅ Fetched meals data:", response.data);
  
      // Make sure response.data contains the expected structure
      if (!response.data || typeof response.data !== "object") {
        throw new Error("Invalid response format");
      }
  
      setMeals(response.data); // Directly set the fetched data
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch meals');
      console.error('❌ Error fetching meals:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Call fetchMeals only when user is available
  useEffect(() => {
    if (user) fetchMealsData();
  }, [user]);



  // Meal management functions
  const addMeal = async () => {
    try {
        const token = await auth.currentUser.getIdToken();
        console.log("🔑 Firebase Token:", token); // ✅ Debugging token
        const response = await axios.post("http://localhost:5001/api/diettracker/add", {
            mealType: document.getElementById("mealType").value,
            foodName: document.getElementById("foodName").value,
            calories: document.getElementById("calories").value,
            date: new Date().toISOString().split("T")[0] // Ensure date is formatted properly
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Meal added successfully:", response.data);
        fetchMealsData()  // ✅ Fetch updated logs after adding a meal

    } catch (error) {
        console.error("Failed to add meal:", error);
    }
};


  const deleteMeal = async (id, section) => {
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.delete(`/api/meals/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setMeals(prevMeals => ({
        ...prevMeals,
        [section]: prevMeals[section].filter(meal => meal.id !== id)
      }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete meal');
    }
  };

  const editMeal = async (id, section, updatedData) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.put(`/api/meals/${id}`, updatedData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setMeals(prevMeals => ({
        ...prevMeals,
        [section]: prevMeals[section].map(meal =>
          meal.id === id ? response.data : meal
        )
      }));
      setIsEditing(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update meal');
    }
  };

  // Navigation functions
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const section = document.getElementById(sectionId);
    if (section) {
      const totalOffset = navbarHeight + (isHeaderVisible ? headerHeight : 0);
      const scrollPosition = section.offsetTop - totalOffset - 20;

      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
      }, 50);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // UI event handlers
  const handleMealMouseEnter = (index) => setHoveredMeal(index);
  const handleMealMouseLeave = () => setHoveredMeal(null);
  const handleSectionMouseEnter = (sectionId) => setHoveredSection(sectionId);
  const handleSectionMouseLeave = () => setHoveredSection(null);

  // Calculate content padding
  const contentPaddingTop = navbarHeight + (isHeaderVisible ? headerHeight : 0) + 20;

  if (isLoading) {
    return (
      <div className="loading-state" style={{ paddingTop: contentPaddingTop }}>
        Loading your meals...
      </div>
    );
  }

  return (
    <div className="App">
        <Navbarafter navItems={navItems} />
  
      <div className="diet-tracker-container">
        <div
          ref={fixedHeaderRef}
          className={`fixed-header ${isHeaderVisible ? "header-visible" : "header-hidden"}`}
          style={{ top: `${navbarHeight}px` }}
        >
          <div className="header-content">
            <h1 className="tracker-title">Diet Tracker</h1>
  
            <div className="meal-form">
              <div className="form-controls">
                <input type="text" id="foodName" placeholder="Food Name" required className="food-input" />
                <input type="number" id="calories" placeholder="Calories" required className="calories-input" />
                <select id="mealType" className="meal-type-select">
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
                <button
                  onClick={addMeal}
                  className="add-meal-button"
                  onMouseEnter={() => setIsAddButtonHovered(true)}
                  onMouseLeave={() => setIsAddButtonHovered(false)}
                >
                  {isAddButtonHovered ? (
                    <span className="flex items-center">
                      <Plus size={16} className="mr-2" />
                      Add Meal
                    </span>
                  ) : (
                    "Add Meal"
                  )}
                </button>
              </div>
            </div>
  
            <div className="timeline-nav">
              <button
                onClick={() => scrollToSection("today")}
                className={`nav-button ${activeSection === "today" ? "active" : ""}`}
              >
                Today
              </button>
              <button
                onClick={() => scrollToSection("yesterday")}
                className={`nav-button ${activeSection === "yesterday" ? "active" : ""}`}
              >
                Yesterday
              </button>
              <button
                onClick={() => scrollToSection("earlier")}
                className={`nav-button ${activeSection === "earlier" ? "active" : ""}`}
              >
                Last 7 Days
              </button>
            </div>
          </div>
        </div>
  
        <div className="content-container" style={{ paddingTop: `${contentPaddingTop}px` }}>
          {error && (
            <div className="error-message">
              {error}
              <button onClick={() => setError(null)}>Dismiss</button>
            </div>
          )}
  
          {Object.keys(meals).length === 0 ? (
            <p>Loading meals...</p>
          ) : (
            ["today", "yesterday", "earlier"].map((section) => (
              <div
                key={section}
                id={section}
                className="day-section"
                onMouseEnter={() => handleSectionMouseEnter(section)}
                onMouseLeave={handleSectionMouseLeave}
              >
                <div className="day-header">
                  <h2 className="day-title">
                    {section === "today" ? "Today" : section === "yesterday" ? "Yesterday" : "Last 7 Days"}
                  </h2>
                  <span className="day-date">
                    {section === "today"
                      ? formatDate(new Date())
                      : section === "yesterday"
                      ? formatDate(new Date(new Date().setDate(new Date().getDate() - 1)))
                      : formatDate(new Date(new Date().setDate(new Date().getDate() - 7)))}
                  </span>
                </div>
  
                <div className="day-summary">
                  <p className="summary-text">
                    Total Calories:{" "}
                    {Array.isArray(meals[section])
                      ? meals[section].reduce((total, meal) => total + Number(meal.calories), 0)
                      : 0}{" "}
                    | Meals: {Array.isArray(meals[section]) ? meals[section].length : 0}
                  </p>
                </div>
  
                <div className="meal-list">
  {meals[section] && Array.isArray(meals[section]) ? (
    meals[section].length > 0 ? (
      meals[section].map((meal) => (
        <div key={meal.id} className="meal-card">
          <div className="meal-header">
            <span className="meal-type">{meal.mealType}</span>
          </div>
          <div className="meal-info">
            <p className="meal-name">{meal.foodName}</p>
            <span className="calories">{meal.calories} calories</span>
          </div>
          <div className="meal-actions">
            <button className="edit-btn" onClick={() => onEditMeal(meal)}>✏️</button>
            <button className="delete-btn" onClick={() => onDeleteMeal(meal.id)}>🗑️</button>
          </div>
        </div>
      ))
    ) : (
      <p className="empty-state">
        No meals logged for {section}.
        {section === "today" && " Add your first meal above!"}
      </p>
    )
  ) : (
    <p>Adding your meal...</p>
  )}
</div>


              </div>
            ))
          )}
        </div>
  
        <button
          onClick={scrollToTop}
          className={`scroll-top-button ${showScrollTop ? "visible" : "hidden"}`}
          aria-label="Scroll to top"
          onMouseEnter={() => setIsScrollButtonHovered(true)}
          onMouseLeave={() => setIsScrollButtonHovered(false)}
        >
          <ChevronUp size={isScrollButtonHovered ? 26 : 24} />
        </button>
  
        {/* Edit Meal Modal */}
        {isEditing && (
          <div className="modal-overlay">
            <div className="edit-modal">
              <h3>Edit Meal</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const meal =
                    meals.today.find((m) => m.id === isEditing) ||
                    meals.yesterday.find((m) => m.id === isEditing) ||
                    meals.earlier.find((m) => m.id === isEditing);
  
                  const section = meals.today.find((m) => m.id === isEditing)
                    ? "today"
                    : meals.yesterday.find((m) => m.id === isEditing)
                    ? "yesterday"
                    : "earlier";
  
                  const updatedData = {
                    foodName: e.target.foodName.value,
                    calories: Number(e.target.calories.value),
                    mealType: e.target.mealType.value,
                    time: meal.time,
                    date: meal.date,
                  };
  
                  editMeal(isEditing, section, updatedData);
                }}
              >
                <div className="form-group">
                  <label htmlFor="edit-foodName">Food Name</label>
                  <input
                    id="edit-foodName"
                    name="foodName"
                    type="text"
                    defaultValue={
                      meals.today.find((m) => m.id === isEditing) ||
                      meals.yesterday.find((m) => m.id === isEditing) ||
                      meals.earlier.find((m) => m.id === isEditing)
                    }
                    required
                  />
                </div>
  
                <div className="form-group">
                  <label htmlFor="edit-calories">Calories</label>
                  <input
                    id="edit-calories"
                    name="calories"
                    type="number"
                    defaultValue={
                      meals.today.find((m) => m.id === isEditing) ||
                      meals.yesterday.find((m) => m.id === isEditing) ||
                      meals.earlier.find((m) => m.id === isEditing)
                    }
                    required
                  />
                </div>
  
                <div className="form-group">
                  <label htmlFor="edit-mealType">Meal Type</label>
                  <select
                    id="edit-mealType"
                    name="mealType"
                    defaultValue={
                      meals.today.find((m) => m.id === isEditing) ||
                      meals.yesterday.find((m) => m.id === isEditing) ||
                      meals.earlier.find((m) => m.id === isEditing)
                    }
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
  
                <button type="submit" className="edit-button">
                  Save Changes
                </button>
                <button type="button" className="cancel-button" onClick={() => setIsEditing(null)}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default DietTracker;