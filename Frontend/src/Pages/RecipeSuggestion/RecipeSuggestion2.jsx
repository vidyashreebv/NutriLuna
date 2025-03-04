import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./RecipieSuggestion2.css";
import recipesVideo from '../../assets/recipes.mp4';
import Navbarafter from '../../Components/Navbarafter';
import Footer from "../../Components/Footer";
import { auth } from "../../config/firebase";
import axios from 'axios';
import { useLoading } from '../../context/LoadingContext';

const DEFAULT_RECIPE_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkhlYWx0aHkgUmVjaXBlPC90ZXh0Pjwvc3ZnPg==';

const RecipeSuggestion2 = () => {
  const { showLoader, hideLoader } = useLoading();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('follicular');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [requirements, setRequirements] = useState(null);
  const [dietAnalysis, setDietAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 6;
  const [paginatedRecipes, setPaginatedRecipes] = useState([]);
  const [pageCount, setPageCount] = useState(0);

  const fetchRecipes = async () => {
    try {
      showLoader();
      setError(null);
      const token = await auth.currentUser.getIdToken();

      console.log('Fetching recipes for phase:', selectedPhase);
      const response = await axios.get("http://localhost:5001/api/recipesuggestion/suggestions", {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          phase: selectedPhase
        }
      });

      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Failed to fetch recipes');
      }

      const { recipes = [], requirements = {}, healthProfile = {}, dietAnalysis = {} } = response.data.data || {};
      
      console.log('Received recipes:', recipes.length);

      const processedRecipes = recipes.map(recipe => ({
        ...recipe,
        title: recipe.title || recipe.label || 'Untitled Recipe',
        image: recipe.image || DEFAULT_RECIPE_IMAGE,
        phase: selectedPhase,
        description: recipe.healthLabels?.join(', ') || recipe.description || '',
        servings: recipe.yield || recipe.servings || 4,
        calories: recipe.calories || (recipe.nutrients?.ENERC_KCAL?.quantity) || 0,
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
        benefits: Array.isArray(recipe.benefits) ? recipe.benefits : []
      }));

      setRecipes(processedRecipes);
      setRequirements(requirements);
      setDietAnalysis({
        ...dietAnalysis,
        ...healthProfile
      });
      setError(null);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      const errorMessage = error.response?.data?.error || error.message || "Failed to fetch recipes";
      setError(errorMessage);
      setRecipes([]);
      setRequirements(null);
      setDietAnalysis(null);
    } finally {
      hideLoader();
    }
  };

  const displayRecipes = () => {
    const filteredRecipes = recipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
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
  }, [recipes, currentPage, searchTerm]);

  const formatNutrient = (value) => {
    if (!value || isNaN(value)) return "N/A";
    return Math.round(value);
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
  };

  const navItems = [
    { label: 'Home', href: '/landing' },
    { label: 'About', href: '/aboutusafter' },
    { label: 'Blog', href: '/blogafter' },
    { label: 'Track Your Periods', href: '/period' },
    { label: 'Diet Tracking', href: '/diet' },
    { label: 'Recipe Suggestions', href: '/recipe', active: true },
    { label: 'Consultation', href: '/consultation' },
    { label: 'My Profile', href: '/dashboard' }
  ];

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
                  .sort(([, a], [, b]) => b - a)
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
          <h3>Recommendations for {selectedPhase} phase</h3>
          <div className="requirements-grid">
            <div className="requirements-card">
              <h4>Focus on These Foods</h4>
              <ul>
                {requirements?.prefer.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="requirements-card">
              <h4>Foods to Avoid</h4>
              <ul>
                {requirements?.avoid.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            {dietAnalysis && (
              <div className="requirements-card">
                <h4>Your Health Profile</h4>
                <ul>
                  <li><strong>Diet Type:</strong> {dietAnalysis.dietType || 'Not specified'}</li>
                  <li><strong>Allergies:</strong> {dietAnalysis.allergies?.length > 0 ? dietAnalysis.allergies.join(', ') : 'None'}</li>
                  <li><strong>Medical Conditions:</strong> {dietAnalysis.medicalConditions?.length > 0 ? dietAnalysis.medicalConditions.join(', ') : 'None'}</li>
                  {dietAnalysis.supplements && <li><strong>Supplements:</strong> {dietAnalysis.supplements}</li>}
                  {dietAnalysis.medications && <li><strong>Medications:</strong> {dietAnalysis.medications}</li>}
                  {dietAnalysis.vitamins && <li><strong>Vitamins:</strong> {dietAnalysis.vitamins}</li>}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="main-search">
        <select
          value={selectedPhase}
          onChange={(e) => setSelectedPhase(e.target.value)}
          className="phase-select"
        >
          <option value="menstrual">Menstrual Phase</option>
          <option value="follicular">Follicular Phase</option>
          <option value="ovulation">Ovulation Phase</option>
          <option value="luteal">Luteal Phase</option>
        </select>
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={fetchRecipes}>Discover Recipes</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div id="recipes-container">
        {loading ? (
          <div className="loading">Loading recipes...</div>
        ) : paginatedRecipes.length > 0 ? (
          paginatedRecipes.map((recipe, index) => (
            <div key={index} className="recipe">
              <div className="recipe-image-container">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_RECIPE_IMAGE;
                  }}
                  loading="lazy"
                  className="recipe-image"
                />
                <div className="phase-tag">{recipe.phase}</div>
              </div>
              <div className="recipe-content">
                <h3>{recipe.title}</h3>
                <div className="recipe-info">
                  <p>Servings: {recipe.servings || 'N/A'}</p>
                  <p>Calories per serving: {formatNutrient(recipe.calories / (recipe.servings || 1))}</p>
                </div>
                <div className="recipe-details">
                  {recipe.ingredients && recipe.ingredients.length > 0 && (
                    <div className="ingredients">
                      <h4>Main Ingredients:</h4>
                      <ul>
                        {recipe.ingredients.slice(0, 3).map((ingredient, idx) => (
                          <li key={idx}>{ingredient}</li>
                        ))}
                        {recipe.ingredients.length > 3 && <li>...and {recipe.ingredients.length - 3} more</li>}
                      </ul>
                    </div>
                  )}
                  {recipe.benefits && recipe.benefits.length > 0 && (
                    <div className="benefits">
                      <h4>Benefits:</h4>
                      <ul className="benefits-list">
                        {recipe.benefits.slice(0, 3).map((benefit, idx) => (
                          <li key={idx}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button className="view-recipe-btn" onClick={() => handleRecipeClick(recipe)}>
                  View Full Recipe
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-recipes">No recipes found. Try adjusting your search or phase selection.</div>
        )}
      </div>

      {showModal && selectedRecipe && (
        <div className="recipe-modal">
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>×</button>
            <h2>{selectedRecipe.title}</h2>
            <img src={selectedRecipe.image || DEFAULT_RECIPE_IMAGE} alt={selectedRecipe.title} />
            <div className="recipe-info">
              <p>Servings: {selectedRecipe.servings || 'N/A'}</p>
              <p>Calories per serving: {formatNutrient(selectedRecipe.calories / (selectedRecipe.servings || 1))}</p>
            </div>
            <div className="recipe-full-details">
              <h3>Ingredients:</h3>
              <ul>
                {selectedRecipe.ingredients.map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
              <h3>Benefits:</h3>
              <ul>
                {selectedRecipe.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
              <a href={selectedRecipe.url} target="_blank" rel="noopener noreferrer" className="external-link">
                View Original Recipe
              </a>
            </div>
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

      <div className="phase-recommendations">
        <h2>Menstrual Phase Recommendations</h2>
        <div className="phase-cards">
          <div className="phase-card">
            <h3>Follicular Phase</h3>
            <p>Focus on: Light, fresh foods rich in estrogen</p>
            <ul>
              <li>Leafy greens</li>
              <li>Fermented foods</li>
              <li>Lean proteins</li>
            </ul>
          </div>
          <div className="phase-card">
            <h3>Ovulation Phase</h3>
            <p>Focus on: Raw foods and antioxidants</p>
            <ul>
              <li>Fresh fruits</li>
              <li>Raw vegetables</li>
              <li>Light proteins</li>
            </ul>
          </div>
          <div className="phase-card">
            <h3>Luteal Phase</h3>
            <p>Focus on: Complex carbs and magnesium</p>
            <ul>
              <li>Whole grains</li>
              <li>Dark chocolate</li>
              <li>Seeds and nuts</li>
            </ul>
          </div>
          <div className="phase-card">
            <h3>Menstrual Phase</h3>
            <p>Focus on: Iron-rich and warm foods</p>
            <ul>
              <li>Red meat</li>
              <li>Leafy greens</li>
              <li>Warm soups</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RecipeSuggestion2;
