import React, { useState, useEffect, useRef } from "react";
import { ChevronUp, Plus, Trash2, Edit2 } from "lucide-react";
import { auth, db } from "../../config/firebase"; // Ensure Firebase is imported
import "./dietTracking.css";
import Navbarafter from "../../Components/Navbarafter";
import Footer from "../../Components/Footer";
import { useLoading } from '../../context/LoadingContext';
import axiosInstance from '../../config/axios';

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

  const { showLoader, hideLoader } = useLoading();

  // Refs
  const navbarRef = useRef(null);
  const fixedHeaderRef = useRef(null);
  const targetRef = useRef(null);

  const navItems = [
    { label: 'Home', href: '/landing' },
    { label: 'About', href: '/aboutusafter' },
    { label: 'Blog', href: '/blogafter' },
    { label: 'Track Your Periods', href: '/period' },
    { label: 'Diet Tracking', href: '/diet', active: true },
    { label: 'Recipe Suggestions', href: '/recipe' },
    { label: 'Consultation', href: '/consultation' },
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
      targetRef.current?.scrollIntoView({ behavior: "smooth" });
      // Show scroll-to-top button after scrolling down 300px
      setShowScrollTop(currentScrollY > 300);

      // Header visibility logic
      if (currentScrollY < 100) {
        // Always show header near the top
        setIsHeaderVisible(true);
      } else {
        // Hide header when scrolling down, show when scrolling up
        setIsHeaderVisible(currentScrollY <= lastScrollY);
      }

      setLastScrollY(currentScrollY);
    };

    // Initial setup
    updateNavbarHeight();
    setTimeout(updateHeaderHeight, 100);

    // Throttled scroll handler
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener("scroll", scrollListener, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener("scroll", scrollListener);
    };
  }, [lastScrollY]);

  const handleSectionClick = (section) => {
    setActiveSection(section);
    document.querySelector(`#${section}`).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

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
      showLoader();
      const response = await axiosInstance.get(`/api/diettracker/${user.uid}`);
      if (response.data) {
        const mealsData = response.data.meals || [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const categorizedMeals = mealsData.reduce((acc, meal) => {
          const mealDate = new Date(meal.date);
          mealDate.setHours(0, 0, 0, 0);

          const diffDays = Math.floor((today - mealDate) / (1000 * 60 * 60 * 24));

          if (diffDays === 0) {
            acc.today.push(meal);
          } else if (diffDays === 1) {
            acc.yesterday.push(meal);
          } else {
            acc.earlier.push(meal);
          }
          return acc;
        }, { today: [], yesterday: [], earlier: [] });

        setMeals(categorizedMeals);
      }
    } catch (error) {
      console.error("❌ Error fetching meals:", error);
      setError("Failed to fetch meals data");
    } finally {
      hideLoader();
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
      showLoader();
      const newMeal = {
        name: "New Meal",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        date: new Date().toISOString(),
        userId: user.uid
      };

      const response = await axiosInstance.post('/api/diettracker/addMeal', newMeal);
      if (response.data) {
        setMeals(prev => ({
          ...prev,
          today: [...prev.today, response.data]
        }));
      }
    } catch (error) {
      console.error("Error adding meal:", error);
      setError("Failed to add meal");
    } finally {
      hideLoader();
    }
  };

  // New function to handle edit button click
  const onEditMeal = (meal) => {
    setIsEditing(meal.id);
  };

  // New function to handle delete button click
  const onDeleteMeal = async (mealId) => {
    try {
      showLoader();
      await axiosInstance.delete(`/api/diettracker/deleteMeal/${mealId}`);
      setMeals(prev => ({
        today: prev.today.filter(meal => meal.id !== mealId),
        yesterday: prev.yesterday.filter(meal => meal.id !== mealId),
        earlier: prev.earlier.filter(meal => meal.id !== mealId)
      }));
    } catch (error) {
      console.error("Error deleting meal:", error);
      setError("Failed to delete meal");
    } finally {
      hideLoader();
    }
  };

  // Updated editMeal function
  const editMeal = async (id, section, updatedData) => {
    try {
      showLoader();
      const response = await axiosInstance.put(`/api/diettracker/updateMeal/${id}`, updatedData);
      if (response.data) {
        setMeals(prev => ({
          ...prev,
          [section]: prev[section].map(meal => 
            meal.id === id ? response.data : meal
          )
        }));
      }
    } catch (error) {
      console.error("Error updating meal:", error);
      setError("Failed to update meal");
    } finally {
      hideLoader();
    }
  };

  // Navigation functions
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const section = document.getElementById(sectionId);
    if (section) {
      console.log("Navbar Height:", navbarHeight, "Header Height:", headerHeight);
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
    <div className="diet-tracker">
      <Navbarafter navItems={navItems} />

      <div className="fixed-header">
        <div className="header-content">
          <h1 className="tracker-title">Diet Tracker</h1>

          <div className="meal-form">
            <div className="form-controls">
              <div className="food-input-wrapper"><input type="text" id="foodName" placeholder="Food Name" required className="food-input" /></div>
              <div className="metrics-wrapper">
                <input type="number" id="calories" placeholder="Calories" required className="calories-input" />
                <input type="number" id="quantity" placeholder="Quantity" required className="quantity-input" min="0.1" step="0.1" />

                <select id="unit" className="unit-select">
                  <option value="serving">Serving</option>
                  <option value="grams">Grams</option>
                  <option value="ml">Milliliters</option>
                  <option value="pieces">Pieces</option>
                  <option value="cups">Cups</option>
                  <option value="tbsp">Tablespoons</option>
                  <option value="tsp">Teaspoons</option>
                </select>
                <select id="mealType" className="meal-type-select">
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
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
              className={activeSection === "today" ? "nav-button active" : "nav-button"}
              onClick={() => handleSectionClick("today")}
            >
              Today
            </button>
            <button
              className={activeSection === "yesterday" ? "nav-button active" : "nav-button"}
              onClick={() => handleSectionClick("yesterday")}
            >
              Yesterday
            </button>
            <button
              className={activeSection === "earlier" ? "nav-button active" : "nav-button"}
              onClick={() => handleSectionClick("earlier")}
            >
              Last 7 Days
            </button>
          </div>
        </div>
      </div>

      <div className="content-container">
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
              className={`day-section ${activeSection === section ? "active" : ""}`}
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
                          <p className="meal-quantity">{meal.quantity} {meal.unit}</p>
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
          <div className="edit-modal-red">
            <div className="modal-header-red">
              <h3>Edit Meal</h3>
              <button
                className="close-button-red"
                type="button"
                onClick={() => setIsEditing(null)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <form
              className="edit-form-red"
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
                  quantity: Number(e.target.quantity.value),
                  unit: e.target.unit.value,
                  mealType: e.target.mealType.value,
                  time: meal.time,
                  date: meal.date,
                };

                editMeal(isEditing, section, updatedData);
              }}
            >
              <div className="form-group-red">
                <label htmlFor="edit-foodName">Food Name</label>
                <input
                  id="edit-foodName"
                  name="foodName"
                  type="text"
                  defaultValue={
                    (meals.today.find((m) => m.id === isEditing) ||
                      meals.yesterday.find((m) => m.id === isEditing) ||
                      meals.earlier.find((m) => m.id === isEditing))?.foodName || ""
                  }
                  className="modal-input-red"
                  required
                />
              </div>

              <div className="form-group-red">
                <label htmlFor="edit-calories">Calories</label>
                <input
                  id="edit-calories"
                  name="calories"
                  type="number"
                  defaultValue={
                    (meals.today.find((m) => m.id === isEditing) ||
                      meals.yesterday.find((m) => m.id === isEditing) ||
                      meals.earlier.find((m) => m.id === isEditing))?.calories || ""
                  }
                  className="modal-input-red"
                  required
                />
              </div>

              <div className="form-group-red">
                <label htmlFor="edit-quantity">Quantity</label>
                <input
                  id="edit-quantity"
                  name="quantity"
                  type="number"
                  min="0.1"
                  step="0.1"
                  defaultValue={
                    (meals.today.find((m) => m.id === isEditing) ||
                      meals.yesterday.find((m) => m.id === isEditing) ||
                      meals.earlier.find((m) => m.id === isEditing))?.quantity || "1"
                  }
                  className="modal-input-red"
                  required
                />
              </div>

              <div className="form-group-red">
                <label htmlFor="edit-unit">Unit</label>
                <select
                  id="edit-unit"
                  name="unit"
                  defaultValue={
                    (meals.today.find((m) => m.id === isEditing) ||
                      meals.yesterday.find((m) => m.id === isEditing) ||
                      meals.earlier.find((m) => m.id === isEditing))?.unit || "serving"
                  }
                  className="modal-select-red"
                >
                  <option value="serving">Serving</option>
                  <option value="grams">Grams</option>
                  <option value="ml">Milliliters</option>
                  <option value="pieces">Pieces</option>
                  <option value="cups">Cups</option>
                  <option value="tbsp">Tablespoons</option>
                  <option value="tsp">Teaspoons</option>
                </select>
              </div>

              <div className="form-group-red">
                <label htmlFor="edit-mealType">Meal Type</label>
                <select
                  id="edit-mealType"
                  name="mealType"
                  defaultValue={
                    (meals.today.find((m) => m.id === isEditing) ||
                      meals.yesterday.find((m) => m.id === isEditing) ||
                      meals.earlier.find((m) => m.id === isEditing))?.mealType || "breakfast"
                  }
                  className="modal-select-red"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div className="modal-actions-red">
                <button
                  type="button"
                  className="cancel-button-red"
                  onClick={() => setIsEditing(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-button-red"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default DietTracker;