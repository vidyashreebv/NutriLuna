import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./RecipieSuggestion2.css";
import recipesVideo from '../../assets/recipes.mp4';
import Navbarafter from '../../Components/Navbarafter';
import Footer from "../../Components/Footer";
import { auth } from "../../config/firebase";
import axios from 'axios';

const RecipeSuggestion2 = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [requirements, setRequirements] = useState(null);
  const [dietAnalysis, setDietAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const itemsPerPage = 6;
  const [paginatedRecipes, setPaginatedRecipes] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await auth.currentUser.getIdToken();
      
      const response = await axios.get("http://localhost:5001/api/recipesuggestion/suggestions", {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          phase: selectedPhase === 'all' ? undefined : selectedPhase
        }
      });

      const { recipes, requirements, dietAnalysis } = response.data;
      setRecipes(recipes);
      setRequirements(requirements);
      setDietAnalysis(dietAnalysis);
      setError(null);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      
      // Handle rate limiting specifically
      if (error.response?.status === 429) {
        const retryAfter = error.response.data.retryIn || 60;
        setError(`Rate limit exceeded. Please try again in ${retryAfter} seconds.`);
        
        // Optional: Auto-retry after the specified time
        setTimeout(() => {
          fetchRecipes();
        }, retryAfter * 1000);
      } else {
        setError(error.response?.data?.message || "Failed to fetch recipes. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const displayRecipes = () => {
    const filteredRecipes = recipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPhase = selectedPhase === 'all' || recipe.phase === selectedPhase;
      return matchesSearch && matchesPhase;
    });

    const start = (currentPage - 1) * itemsPerPage;
    const paginatedRecipes = filteredRecipes.slice(start, start + itemsPerPage);

    setPaginatedRecipes(paginatedRecipes);
    setPageCount(Math.ceil(filteredRecipes.length / itemsPerPage));
  };

  useEffect(() => {
    if (auth.currentUser) {
      fetchRecipes();
    }
  }, [selectedPhase]);

  useEffect(() => {
    displayRecipes();
  }, [recipes, currentPage, searchTerm, selectedPhase]);

  const navItems = [
    { label: 'Home', href: '/landing' },
    { label: 'About', href: '/aboutusafter' },
    { label: 'Blog', href: '/blogafter' },
    { label: 'Track Your Periods', href: '/period' },
    { label: 'Diet Tracking', href: '/diet' },
    { label: 'Recipe Suggestions', href: '/recipe', active: true },
    { label: 'Consultation', href: 'consultation' },
    { label: 'My Profile', href: '/dashboard' }
  ];

  const formatNutrient = (value, unit) => {
    if (!value) return "N/A";
    return `${Math.round(value)}${unit}`;
  };

  return (
    <>
      <Navbarafter navItems={navItems} />
      <section className="recipes-intro">
        <video className="hero-video" autoPlay loop muted>
          <source src={recipesVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-content">
          <h2>Wellness Recipes</h2>
          <p>Nourish your body with carefully curated recipes for every phase of your cycle</p>
        </div>
      </section>

      {dietAnalysis && (
        <div className="diet-analysis">
          <h3>Your Diet Summary</h3>
          <div className="analysis-grid">
            <div className="analysis-card">
              <h4>Daily Calories</h4>
              <p>{Math.round(dietAnalysis.averageCaloriesPerDay)} kcal</p>
            </div>
            <div className="analysis-card">
              <h4>Most Common Meals</h4>
              <ul>
                {Object.entries(dietAnalysis.mealTypes)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 3)
                  .map(([type, count]) => (
                    <li key={type}>{type}: {count} times</li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {requirements && (
        <div className="nutritional-requirements">
          <h3>Recommended for {selectedPhase === 'all' ? 'Your Current Phase' : selectedPhase + ' phase'}</h3>
          <div className="requirements-grid">
            <div className="requirements-card">
              <h4>Focus on</h4>
              <ul>
                {requirements.prefer.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="requirements-card">
              <h4>Avoid</h4>
              <ul>
                {requirements.avoid.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="main-search">
        <button onClick={fetchRecipes}>Discover Recipes</button>
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={selectedPhase} onChange={(e) => setSelectedPhase(e.target.value)}>
          <option value="all">All Phases</option>
          <option value="menstrual">Menstrual Phase</option>
          <option value="follicular">Follicular Phase</option>
          <option value="ovulation">Ovulation Phase</option>
          <option value="luteal">Luteal Phase</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading" />}

      <div id="recipes-container" className="book-transition">
        {paginatedRecipes.map((recipe, index) => (
          <div key={recipe.id} className="recipe" style={{ animationDelay: `${index * 0.1}s` }}>
            <img src={recipe.image} alt={recipe.title} />
            <div className="recipe-content">
              <span className="phase-tag">{recipe.phase} phase</span>
              <h3>{recipe.title}</h3>
              <p>{recipe.description}</p>
              <div className="recipe-details">
                <div className="nutrition-info">
                  <h4>Nutrition per serving</h4>
                  <ul>
                    <li>Calories: {Math.round(recipe.calories / recipe.servings)}</li>
                    {recipe.nutrients && Object.entries(recipe.nutrients).map(([key, value]) => (
                      <li key={key}>{key}: {formatNutrient(value.quantity, value.unit)}</li>
                    ))}
                  </ul>
                </div>
                <div className="benefits">
                  <h4>Benefits</h4>
                  <ul>
                {recipe.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
                </div>
              </div>
              <button 
                className="view-recipe-btn"
                onClick={() => setSelectedRecipe(recipe)}
              >
                View Recipe
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedRecipe && (
        <div className="recipe-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setSelectedRecipe(null)}>&times;</button>
            <h2>{selectedRecipe.title}</h2>
            <img src={selectedRecipe.image} alt={selectedRecipe.title} />
            <div className="recipe-details">
              <div className="ingredients">
                <h3>Ingredients</h3>
                <ul>
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              <div className="nutrition">
                <h3>Nutrition Information</h3>
                <p>Servings: {selectedRecipe.servings}</p>
                <p>Calories per serving: {Math.round(selectedRecipe.calories / selectedRecipe.servings)}</p>
                <ul>
                  {selectedRecipe.nutrients && Object.entries(selectedRecipe.nutrients).map(([key, value]) => (
                    <li key={key}>{key}: {formatNutrient(value.quantity, value.unit)}</li>
                  ))}
                </ul>
              </div>
            </div>
            <a href={selectedRecipe.url} target="_blank" rel="noopener noreferrer" className="full-recipe-btn">
              View Full Recipe
            </a>
          </div>
        </div>
      )}

      <div id="pagination-container">
        {[...Array(pageCount)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? 'active' : ''}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default RecipeSuggestion2;
