import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './RecipeSuggestion.css';
import Navbarafter from '../../Components/Navbarafter';
import Footer from '../../Components/Footer';

const RecipeSuggestion = () => {
    const { currentUser } = useAuth();
    const [dietLogs, setDietLogs] = useState([]);
    const [periodLogs, setPeriodLogs] = useState([]);
    const [nutritionAnalysis, setNutritionAnalysis] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    const navItems = [
        { label: 'Home', href: '/landing' },
        { label: 'About', href: '/aboutusafter' },
        { label: 'Blog', href: '/blogafter' },
        { label: 'Track Your Periods', href: '/period'},
        { label: 'Diet Tracking', href: '/diet' },
        { label: 'Recipe Suggestions', href: '/recipe', active: true  },
        { label: 'Consultation', href: 'consultation' },
        { label: 'My Profile', href: '/dashboard' }
    ];

    // Nutrient targets for menstrual health
    const nutrientTargets = {
        iron: 18, // mg
        calcium: 1000, // mg
        magnesium: 320, // mg
        vitaminB: 2.4, // mcg
        omega3: 1.1, // g
        fiber: 25, // g
        protein: 46 // g
    };

    // Fetch user's diet and period logs
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [dietResponse, periodResponse] = await Promise.all([
                    axios.get('/api/diettracker/logs'),
                    axios.get('/api/periodtracker/logs')
                ]);

                setDietLogs(dietResponse.data);
                setPeriodLogs(periodResponse.data);
                analyzeNutrition(dietResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser]);

    // Analyze nutrition from diet logs
    const analyzeNutrition = (logs) => {
        // Calculate average daily intake
        const nutritionSummary = {
            iron: calculateAverageIntake(logs, 'iron'),
            calcium: calculateAverageIntake(logs, 'calcium'),
            magnesium: calculateAverageIntake(logs, 'magnesium'),
            vitaminB: calculateAverageIntake(logs, 'vitaminB'),
            omega3: calculateAverageIntake(logs, 'omega3'),
            fiber: calculateAverageIntake(logs, 'fiber'),
            protein: calculateAverageIntake(logs, 'protein')
        };

        setNutritionAnalysis(nutritionSummary);
        generateRecommendations(nutritionSummary);
    };

    // Calculate average intake for a nutrient
    const calculateAverageIntake = (logs, nutrient) => {
        // Implementation would depend on your data structure
        // This is a placeholder calculation
        return logs.reduce((acc, log) => acc + (log[nutrient] || 0), 0) / logs.length;
    };

    // Generate food recommendations based on nutritional gaps
    const generateRecommendations = (nutrition) => {
        const recommendations = [];

        // Example food database with nutritional content
        const foodDatabase = {
            iron: [
                { name: 'Spinach', content: 'High in iron and folate', recipe: 'Sautéed spinach with garlic' },
                { name: 'Lentils', content: 'Rich in iron and protein', recipe: 'Lentil soup with vegetables' }
            ],
            calcium: [
                { name: 'Greek Yogurt', content: 'High in calcium and protein', recipe: 'Greek yogurt parfait' },
                { name: 'Almonds', content: 'Good source of calcium', recipe: 'Almond and berry smoothie' }
            ],
            magnesium: [
                { name: 'Pumpkin Seeds', content: 'Rich in magnesium', recipe: 'Roasted pumpkin seeds' },
                { name: 'Avocado', content: 'Good source of magnesium', recipe: 'Avocado toast with seeds' }
            ],
            // Add more nutrients and foods
        };

        // Check each nutrient against target
        Object.entries(nutrition).forEach(([nutrient, value]) => {
            if (value < nutrientTargets[nutrient]) {
                const deficit = ((nutrientTargets[nutrient] - value) / nutrientTargets[nutrient] * 100).toFixed(1);
                const foods = foodDatabase[nutrient] || [];
                
                recommendations.push({
                    nutrient,
                    deficit: `${deficit}%`,
                    foods: foods
                });
            }
        });

        setRecommendations(recommendations);
    };

    return (
        <div className="recipe-suggestion">
            <Navbarafter navItems={navItems} />
            <div className="recipe-container">
                <h1>Personalized Recipe Suggestions</h1>
                
                {loading ? (
                    <div className="loading">Loading your personalized recommendations...</div>
                ) : (
                    <>
                        <div className="nutrition-summary">
                            <h2>Your Nutritional Analysis</h2>
                            <div className="nutrient-grid">
                                {nutritionAnalysis && Object.entries(nutritionAnalysis).map(([nutrient, value]) => (
                                    <div key={nutrient} className="nutrient-card">
                                        <h3>{nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}</h3>
                                        <div className="nutrient-progress">
                                            <div 
                                                className="progress-bar"
                                                style={{ 
                                                    width: `${Math.min((value / nutrientTargets[nutrient]) * 100, 100)}%`
                                                }}
                                            ></div>
                                        </div>
                                        <p>{value.toFixed(1)} / {nutrientTargets[nutrient]} {nutrient === 'protein' ? 'g' : 'mg'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="recommendations">
                            <h2>Recommended Recipes</h2>
                            <div className="recipe-grid">
                                {recommendations.map((rec, index) => (
                                    <div key={index} className="recipe-card">
                                        <div className="recipe-header">
                                            <h3>{rec.nutrient.charAt(0).toUpperCase() + rec.nutrient.slice(1)}</h3>
                                            <span className="deficit-badge">-{rec.deficit}</span>
                                        </div>
                                        <div className="recipe-foods">
                                            {rec.foods.map((food, foodIndex) => (
                                                <div key={foodIndex} className="food-item">
                                                    <h4>{food.name}</h4>
                                                    <p>{food.content}</p>
                                                    <div className="recipe-suggestion">
                                                        <span>🥗</span> {food.recipe}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default RecipeSuggestion; 