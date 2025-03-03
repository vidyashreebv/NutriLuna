const express = require("express");
const router = express.Router();
const { admin, db } = require("../config/firebaseConfig");
const axios = require("axios");

// Cache configuration
const CACHE_DURATION = 3600000; // 1 hour in milliseconds
const recipeCache = new Map();

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 2000; // 2 seconds

// Default recipes for when API is unavailable
const DEFAULT_RECIPES = {
    follicular: [
        {
            id: "default-follicular-1",
            title: "Fresh Spinach and Salmon Salad",
            description: "High in Vitamin D, Zinc, and protein. Perfect for the follicular phase.",
            image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
            benefits: ["light", "fresh", "protein-rich"],
            nutrients: {
                protein: { quantity: 25, unit: "g" },
                vitaminD: { quantity: 400, unit: "IU" },
                zinc: { quantity: 8, unit: "mg" }
            },
            ingredients: [
                "6 oz fresh salmon fillet",
                "2 cups fresh spinach",
                "1 tbsp olive oil",
                "Lemon juice to taste",
                "Salt and pepper to taste"
            ],
            calories: 650,
            servings: 1,
            url: "https://www.example.com/salmon-spinach-salad"
        },
        {
            id: "default-follicular-2",
            title: "Quinoa Buddha Bowl",
            description: "Nutrient-dense bowl with complete proteins and fresh vegetables.",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
            benefits: ["fresh", "protein-rich", "nutrient-dense"],
            nutrients: {
                protein: { quantity: 20, unit: "g" },
                fiber: { quantity: 12, unit: "g" },
                iron: { quantity: 6, unit: "mg" }
            },
            ingredients: [
                "1 cup cooked quinoa",
                "1 cup roasted chickpeas",
                "2 cups mixed vegetables",
                "1 avocado",
                "Tahini dressing"
            ],
            calories: 550,
            servings: 1,
            url: "https://www.example.com/quinoa-buddha-bowl"
        }
    ],
    ovulation: [
        {
            id: "default-ovulation-1",
            title: "Antioxidant Berry Smoothie Bowl",
            description: "Rich in antioxidants, vitamin C, and selenium. Perfect for the ovulation phase.",
            image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
            benefits: ["antioxidant-rich", "vitamin C boost", "anti-inflammatory"],
            nutrients: {
                vitaminC: { quantity: 85, unit: "mg" },
                vitaminE: { quantity: 15, unit: "mg" },
                selenium: { quantity: 55, unit: "mcg" }
            },
            ingredients: [
                "1 cup mixed berries",
                "1 banana",
                "1 cup spinach",
                "1 tbsp chia seeds",
                "1 tbsp honey",
                "1 cup almond milk"
            ],
            calories: 550,
            servings: 1,
            url: "https://www.example.com/berry-smoothie-bowl"
        },
        {
            id: "default-ovulation-2",
            title: "Rainbow Raw Veggie Platter with Hummus",
            description: "A colorful array of raw vegetables rich in antioxidants and essential nutrients.",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
            benefits: ["raw vegetables", "antioxidant-rich", "nutrient-dense"],
            nutrients: {
                vitaminC: { quantity: 120, unit: "mg" },
                vitaminE: { quantity: 12, unit: "mg" },
                fiber: { quantity: 15, unit: "g" }
            },
            ingredients: [
                "2 cups mixed bell peppers",
                "1 cup cherry tomatoes",
                "1 cup cucumber slices",
                "1 cup carrot sticks",
                "1 cup homemade hummus",
                "1/4 cup mixed seeds"
            ],
            calories: 600,
            servings: 2,
            url: "https://www.example.com/raw-veggie-platter"
        }
    ],
    menstrual: [
        {
            id: "default-menstrual-1",
            title: "Iron-Rich Lentil Soup",
            description: "Warming soup rich in iron and B12, perfect for the menstrual phase.",
            image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
            benefits: ["iron-rich", "warming", "comforting"],
            nutrients: {
                iron: { quantity: 12, unit: "mg" },
                vitaminB12: { quantity: 2.4, unit: "mcg" },
                protein: { quantity: 18, unit: "g" }
            },
            ingredients: [
                "1 cup red lentils",
                "2 cups spinach",
                "1 onion",
                "2 carrots",
                "4 cups vegetable broth",
                "Spices to taste"
            ],
            calories: 650,
            servings: 2,
            url: "https://www.example.com/lentil-soup"
        }
    ],
    luteal: [
        {
            id: "default-luteal-1",
            title: "Magnesium-Rich Dark Chocolate Oats",
            description: "Complex carbs and magnesium-rich breakfast to support the luteal phase.",
            image: "https://images.unsplash.com/photo-1517093702248-587bf5113566?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
            benefits: ["complex carbs", "magnesium-rich", "mood-boosting"],
            nutrients: {
                magnesium: { quantity: 160, unit: "mg" },
                calcium: { quantity: 200, unit: "mg" },
                fiber: { quantity: 8, unit: "g" }
            },
            ingredients: [
                "1 cup rolled oats",
                "1 tbsp dark cocoa powder",
                "1 banana",
                "1 tbsp almond butter",
                "1 cup almond milk",
                "1 oz dark chocolate chips"
            ],
            calories: 550,
            servings: 1,
            url: "https://www.example.com/chocolate-oats"
        }
    ]
};

// Helper function to implement exponential backoff
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to get cached recipes with improved error handling
const getCachedRecipes = (cacheKey) => {
    try {
        const cached = recipeCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
            console.log("Cache hit for:", cacheKey);
            return cached.data;
        }
        console.log("Cache miss for:", cacheKey);
        return null;
    } catch (error) {
        console.error("Error accessing cache:", error);
        return null;
    }
};

// Helper function to cache recipes
const cacheRecipes = (cacheKey, data) => {
    recipeCache.set(cacheKey, {
        timestamp: Date.now(),
        data
    });
};

// Helper function to make API call with improved retry logic
const makeEdamamRequest = async (url, headers, retryCount = 0) => {
    try {
        const response = await axios.get(url, { 
            headers,
            timeout: 15000 // Increased to 15 seconds
        });
        return response;
    } catch (error) {
        console.log(`API request attempt ${retryCount + 1} failed:`, error.message);
        
        if (error.response?.status === 429 && retryCount < MAX_RETRIES) {
            const retryAfter = parseInt(error.response.headers['retry-after']) || Math.pow(2, retryCount + 1) * INITIAL_RETRY_DELAY;
            console.log(`Rate limited. Retrying in ${retryAfter}ms...`);
            await wait(retryAfter);
            return makeEdamamRequest(url, headers, retryCount + 1);
        }

        throw {
            ...error,
            retryAttempts: retryCount,
            lastAttemptTime: new Date().toISOString()
        };
    }
};

// Edamam API configuration
const EDAMAM_APP_ID = "271cf725";
const EDAMAM_APP_KEY = "67adde6572e8ad9a2ce72b17b8e2625d";
const EDAMAM_USER_ID = "9Htsc8m4hGUm5Nkr8BwrqpiZbv23"; // Using the Firebase user ID as Edamam user ID

// Middleware to verify token
const verifyToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(403).json({ error: "No authorization header" });
        }

        const token = req.headers.authorization.split("Bearer ")[1];
        if (!token) {
            return res.status(403).json({ error: "No token provided" });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(403).json({ error: "Authentication failed" });
    }
};

// Helper function to get nutritional requirements based on menstrual phase
const getNutritionalRequirements = (phase) => {
    switch (phase) {
        case "menstrual":
            return {
                nutrients: {
                    "Iron": "HIGH",
                    "Vitamin B12": "HIGH",
                    "Magnesium": "HIGH",
                    "Omega-3": "MEDIUM"
                },
                avoid: ["caffeine", "alcohol", "salt"],
                prefer: ["warm", "comforting", "iron-rich"]
            };
        case "follicular":
            return {
                nutrients: {
                    "Vitamin D": "HIGH",
                    "Zinc": "HIGH",
                    "Vitamin B6": "MEDIUM"
                },
                avoid: ["processed foods"],
                prefer: ["light", "fresh", "protein-rich"]
            };
        case "ovulation":
            return {
                nutrients: {
                    "Vitamin E": "HIGH",
                    "Selenium": "HIGH",
                    "Vitamin C": "HIGH"
                },
                avoid: ["inflammatory foods"],
                prefer: ["antioxidant-rich", "raw vegetables"]
            };
        case "luteal":
            return {
                nutrients: {
                    "Magnesium": "HIGH",
                    "Calcium": "HIGH",
                    "Vitamin B6": "HIGH"
                },
                avoid: ["sugar", "salt", "caffeine"],
                prefer: ["complex carbs", "lean protein"]
            };
        default:
            return {
                nutrients: {},
                avoid: [],
                prefer: []
            };
    }
};

// Helper function to analyze user's diet logs
const analyzeDietLogs = async (userId) => {
    try {
        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        const logsSnapshot = await db
            .collection("users")
            .doc(userId)
            .collection("dietLogs")
            .where("date", ">=", lastWeek.toISOString().split('T')[0])
            .get();

        let nutritionSummary = {
            totalCalories: 0,
            mealTypes: {},
            commonFoods: {},
            averageCaloriesPerDay: 0
        };

        logsSnapshot.forEach(doc => {
            const meal = doc.data();
            nutritionSummary.totalCalories += Number(meal.calories);
            nutritionSummary.mealTypes[meal.mealType] = (nutritionSummary.mealTypes[meal.mealType] || 0) + 1;
            nutritionSummary.commonFoods[meal.foodName] = (nutritionSummary.commonFoods[meal.foodName] || 0) + 1;
        });

        nutritionSummary.averageCaloriesPerDay = nutritionSummary.totalCalories / 7;

        return nutritionSummary;
    } catch (error) {
        console.error("Error analyzing diet logs:", error);
        return null;
    }
};

// Helper function to calculate current menstrual phase
const calculateMenstrualPhase = (periodData) => {
    if (!periodData || !periodData.lastPeriod || !periodData.cycleLength) {
        return "follicular"; // default phase
    }

    const today = new Date();
    const lastPeriod = new Date(periodData.lastPeriod);
    const cycleLength = parseInt(periodData.cycleLength);
    const daysSinceLastPeriod = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24));
    const currentCycleDay = (daysSinceLastPeriod % cycleLength) + 1;

    // Phase lengths based on average 28-day cycle
    const menstrualPhaseLength = 5;  // Days 1-5
    const follicularPhaseLength = 9; // Days 6-14
    const ovulationPhaseLength = 5;  // Days 14-18
    // Luteal phase is the remainder

    if (currentCycleDay <= menstrualPhaseLength) {
        return "menstrual";
    } else if (currentCycleDay <= menstrualPhaseLength + follicularPhaseLength) {
        return "follicular";
    } else if (currentCycleDay <= menstrualPhaseLength + follicularPhaseLength + ovulationPhaseLength) {
        return "ovulation";
    } else {
        return "luteal";
    }
};

// Helper function to analyze diet patterns and make recommendations
const analyzeDietPatterns = (dietAnalysis, requirements) => {
    const recommendations = {
        nutrients: Object.entries(requirements.nutrients).map(([nutrient, level]) => ({
            nutrient,
            level
        })),
        preferences: requirements.prefer || [],
        adjustments: []
    };

    // Analyze caloric intake
    const TARGET_DAILY_CALORIES = 2000; // This should be personalized based on user profile
    if (dietAnalysis.averageCaloriesPerDay < TARGET_DAILY_CALORIES * 0.8) {
        recommendations.adjustments.push("increase_calories");
    } else if (dietAnalysis.averageCaloriesPerDay > TARGET_DAILY_CALORIES * 1.2) {
        recommendations.adjustments.push("decrease_calories");
    }

    // Analyze meal distribution
    const mealTypes = dietAnalysis.mealTypes;
    if (!mealTypes.breakfast || mealTypes.breakfast < 5) { // Less than 5 breakfasts in a week
        recommendations.adjustments.push("add_breakfast");
    }

    // Check for variety in diet
    const uniqueFoods = Object.keys(dietAnalysis.commonFoods).length;
    if (uniqueFoods < 10) { // Less than 10 different foods in a week
        recommendations.adjustments.push("increase_variety");
    }

    return recommendations;
};

// Helper function to get fallback recipes
const getFallbackRecipes = (phase, requirements) => {
    const defaultRecipesForPhase = DEFAULT_RECIPES[phase] || DEFAULT_RECIPES.follicular;
    return defaultRecipesForPhase.map(recipe => ({
        ...recipe,
        phase,
        benefits: requirements.prefer || []
    }));
};

// Get personalized recipe suggestions
router.get("/suggestions", verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const { phase } = req.query;

        console.log("1. Starting recipe request for user:", userId);

        // Get user's period data and calculate phase
        const periodDoc = await db
            .collection("users")
            .doc(userId)
            .collection("periodData")
            .doc("data")
            .get();

        console.log("2. Period data fetched:", periodDoc.exists ? "exists" : "does not exist");

        const periodData = periodDoc.exists ? periodDoc.data() : null;
        console.log("3. Period data:", periodData);
        
        // Calculate current phase if not specified
        const currentPhase = phase || calculateMenstrualPhase(periodData) || "follicular";
        console.log("4. Calculated phase:", currentPhase);

        // Get nutritional requirements for the phase
        const requirements = getNutritionalRequirements(currentPhase);
        console.log("5. Requirements:", requirements);

        // Analyze user's recent diet
        const dietAnalysis = await analyzeDietLogs(userId) || {
            totalCalories: 0,
            mealTypes: {},
            commonFoods: {},
            averageCaloriesPerDay: 0
        };
        console.log("7. Diet analysis:", dietAnalysis);

        // Get diet recommendations based on analysis
        const dietRecommendations = analyzeDietPatterns(dietAnalysis, requirements);
        console.log("8. Diet recommendations:", dietRecommendations);

        let recipes;
        let fromCache = false;
        let fromFallback = false;

        try {
            // Build optimized search terms - limit to most important terms
            const baseTerms = requirements.prefer.slice(0, 2); // Take top 2 preferred terms
            let searchTerms = [...baseTerms];
            
            // Add at most 2 additional terms based on diet recommendations
            if (dietRecommendations.adjustments.includes("increase_calories")) {
                searchTerms.push("high-protein");
            }
            if (dietRecommendations.adjustments.includes("increase_variety")) {
                searchTerms.push("seasonal");
            }

            console.log("9. Search terms:", searchTerms);

            // Create cache key based on search parameters
            const cacheKey = `${currentPhase}-${searchTerms.join("-")}`;
            
            // Check cache first
            const cachedResult = getCachedRecipes(cacheKey);
            if (cachedResult) {
                console.log("10. Using cached recipes");
                recipes = cachedResult;
                fromCache = true;
            } else {
                // Try to get recipes from API with optimized query
                const queryParams = new URLSearchParams({
                    app_id: EDAMAM_APP_ID,
                    app_key: EDAMAM_APP_KEY,
                    q: searchTerms.join(" ").trim(),
                    random: 'true',
                    imageSize: 'REGULAR'
                });

                if (dietRecommendations.adjustments.includes("decrease_calories")) {
                    queryParams.append("calories", "0-500");
                } else if (dietRecommendations.adjustments.includes("increase_calories")) {
                    queryParams.append("calories", "500-800");
                }

                const apiUrl = `https://api.edamam.com/api/recipes/v2?beta=true&type=public&${queryParams.toString()}`;
                console.log("11. API URL:", apiUrl);

                const edamamResponse = await makeEdamamRequest(apiUrl, {
                    'Accept': 'application/json',
                    'Accept-Language': 'en',
                    'Edamam-Account-User': userId
                });

                if (edamamResponse.data?.hits) {
                    recipes = edamamResponse.data.hits.map(hit => {
                        const recipe = hit.recipe;
                        return {
                            id: recipe.uri ? recipe.uri.split("#")[1] : Date.now().toString(),
                            title: recipe.label || "Untitled Recipe",
                            description: recipe.healthLabels ? recipe.healthLabels.join(", ") : "",
                            image: recipe.image || "",
                            phase: currentPhase,
                            benefits: requirements.prefer || [],
                            nutrients: recipe.totalNutrients || {},
                            ingredients: recipe.ingredientLines || [],
                            url: recipe.url || "",
                            calories: Math.round(recipe.calories || 0),
                            servings: recipe.yield || 1
                        };
                    }).filter(recipe => recipe !== null);

                    // Cache successful API results
                    if (recipes.length > 0) {
                        cacheRecipes(cacheKey, recipes);
                    }
                }
            }
        } catch (error) {
            console.log("Using fallback recipes due to error:", error.message);
            recipes = getFallbackRecipes(currentPhase, requirements);
            fromFallback = true;
        }

        // If we still don't have recipes, use fallback
        if (!recipes || recipes.length === 0) {
            console.log("No recipes found, using fallback recipes");
            recipes = getFallbackRecipes(currentPhase, requirements);
            fromFallback = true;
        }

        return res.status(200).json({
            phase: currentPhase,
            requirements,
            dietAnalysis,
            dietRecommendations,
            recipes,
            fromCache,
            fromFallback
        });

    } catch (error) {
        console.error("❌ Error in recipe suggestions:", error);
        console.error("Stack trace:", error.stack);
        
        return res.status(500).json({
            error: "Failed to get recipe suggestions",
            details: error.message,
            type: error.name,
            code: error.code
        });
    }
});

module.exports = router; 