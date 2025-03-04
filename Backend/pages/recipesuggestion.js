const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const axios = require('axios');
const db = admin.firestore();

// Edamam API configuration
const EDAMAM_APP_ID = "3a186b10";
const EDAMAM_APP_KEY = "bb5cc41f92beda348e8de336d17d222d";

// Cache configuration
const CACHE_DURATION = 3600000; // 1 hour in milliseconds
const recipeCache = new Map();

// Default recipes for fallback
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
        },
        {
            id: "default-follicular-3",
            title: "Iron-Rich Breakfast Bowl",
            description: "A nutrient-packed breakfast to support iron levels during the follicular phase.",
            image: "https://images.unsplash.com/photo-1490474504059-bf2db5ab2348?auto=format&fit=crop&w=800&q=80",
            benefits: ["iron-rich", "protein-packed", "energy-boosting"],
            nutrients: {
                iron: { quantity: 8, unit: "mg" },
                protein: { quantity: 22, unit: "g" },
                vitaminC: { quantity: 65, unit: "mg" }
            },
            ingredients: [
                "1 cup cooked quinoa",
                "2 soft-boiled eggs",
                "1 cup sautéed spinach",
                "1/2 avocado",
                "1 tbsp pumpkin seeds",
                "Lemon-tahini dressing"
            ],
            calories: 550,
            servings: 1,
            url: "https://www.example.com/iron-rich-breakfast"
        },
        {
            id: "default-follicular-4",
            title: "Citrus and Kale Power Salad",
            description: "Vitamin C-rich salad that helps iron absorption.",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
            benefits: ["vitamin C", "iron absorption", "antioxidants"],
            nutrients: {
                vitaminC: { quantity: 100, unit: "mg" },
                iron: { quantity: 4, unit: "mg" },
                fiber: { quantity: 7, unit: "g" }
            },
            ingredients: [
                "3 cups chopped kale",
                "1 orange, segmented",
                "1 grapefruit, segmented",
                "1/4 cup pomegranate seeds",
                "2 tbsp olive oil",
                "1 tbsp citrus vinaigrette"
            ],
            calories: 320,
            servings: 2,
            url: "https://www.example.com/citrus-kale-salad"
        },
        {
            id: "default-follicular-5",
            title: "Energizing Green Smoothie",
            description: "Iron-rich smoothie with vitamin C for better absorption.",
            image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80",
            benefits: ["energy-boosting", "iron-rich", "vitamin C"],
            nutrients: {
                iron: { quantity: 5, unit: "mg" },
                vitaminC: { quantity: 80, unit: "mg" },
                protein: { quantity: 15, unit: "g" }
            },
            ingredients: [
                "2 cups spinach",
                "1 green apple",
                "1 banana",
                "1 tbsp spirulina",
                "1 cup coconut water",
                "1 tbsp hemp seeds"
            ],
            calories: 280,
            servings: 1,
            url: "https://www.example.com/green-smoothie"
        },
        {
            id: "default-follicular-6",
            title: "Mediterranean Chickpea Bowl",
            description: "Plant-based iron and protein-rich meal.",
            image: "https://images.unsplash.com/photo-1529059997568-3d847b1154f0?auto=format&fit=crop&w=800&q=80",
            benefits: ["plant-based iron", "protein", "mediterranean"],
            nutrients: {
                iron: { quantity: 6, unit: "mg" },
                protein: { quantity: 18, unit: "g" },
                fiber: { quantity: 12, unit: "g" }
            },
            ingredients: [
                "2 cups chickpeas",
                "1 cup cherry tomatoes",
                "1 cucumber, diced",
                "1/4 cup olives",
                "Fresh herbs",
                "Lemon-olive oil dressing"
            ],
            calories: 450,
            servings: 2,
            url: "https://www.example.com/chickpea-bowl"
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
        },
        {
            id: "default-ovulation-3",
            title: "Fertility-Boosting Salmon Bowl",
            description: "Rich in omega-3s and antioxidants for optimal fertility.",
            image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
            benefits: ["omega-3 rich", "antioxidants", "protein"],
            nutrients: {
                omega3: { quantity: 2.5, unit: "g" },
                protein: { quantity: 28, unit: "g" },
                vitaminD: { quantity: 600, unit: "IU" }
            },
            ingredients: [
                "6 oz wild-caught salmon",
                "1 cup brown rice",
                "2 cups mixed greens",
                "1 avocado",
                "Sesame ginger dressing",
                "Nori strips"
            ],
            calories: 650,
            servings: 1,
            url: "https://www.example.com/salmon-bowl"
        },
        {
            id: "default-ovulation-4",
            title: "Antioxidant Power Bowl",
            description: "Packed with fertility-supporting antioxidants.",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
            benefits: ["antioxidant-rich", "anti-inflammatory", "nutrient-dense"],
            nutrients: {
                vitaminC: { quantity: 95, unit: "mg" },
                vitaminE: { quantity: 18, unit: "mg" },
                fiber: { quantity: 10, unit: "g" }
            },
            ingredients: [
                "2 cups mixed berries",
                "1 cup Greek yogurt",
                "1/4 cup walnuts",
                "2 tbsp honey",
                "1 tbsp chia seeds",
                "Fresh mint"
            ],
            calories: 420,
            servings: 1,
            url: "https://www.example.com/antioxidant-bowl"
        },
        {
            id: "default-ovulation-5",
            title: "Fertility Green Juice",
            description: "Fresh juice packed with fertility-supporting nutrients.",
            image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80",
            benefits: ["detoxifying", "nutrient-rich", "alkalizing"],
            nutrients: {
                vitaminC: { quantity: 75, unit: "mg" },
                folate: { quantity: 200, unit: "mcg" },
                potassium: { quantity: 500, unit: "mg" }
            },
            ingredients: [
                "2 green apples",
                "1 cucumber",
                "4 celery stalks",
                "1 inch ginger",
                "1 lemon",
                "2 cups spinach"
            ],
            calories: 180,
            servings: 2,
            url: "https://www.example.com/fertility-juice"
        },
        {
            id: "default-ovulation-6",
            title: "Superfood Quinoa Salad",
            description: "Nutrient-dense salad supporting reproductive health.",
            image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=800&q=80",
            benefits: ["protein-rich", "antioxidants", "healthy fats"],
            nutrients: {
                protein: { quantity: 15, unit: "g" },
                iron: { quantity: 4, unit: "mg" },
                omega3: { quantity: 1.5, unit: "g" }
            },
            ingredients: [
                "1 cup quinoa",
                "1 cup edamame",
                "1 bell pepper",
                "1/4 cup pumpkin seeds",
                "Seaweed flakes",
                "Ginger-miso dressing"
            ],
            calories: 480,
            servings: 2,
            url: "https://www.example.com/superfood-salad"
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
        },
        {
            id: "default-luteal-2",
            title: "Serotonin-Boosting Buddha Bowl",
            description: "Complex carbs and protein to support mood and energy.",
            image: "https://images.unsplash.com/photo-1543340904-0b1d843bccda?auto=format&fit=crop&w=800&q=80",
            benefits: ["mood-balancing", "blood sugar stable", "satisfying"],
            nutrients: {
                carbs: { quantity: 65, unit: "g" },
                protein: { quantity: 20, unit: "g" },
                magnesium: { quantity: 120, unit: "mg" }
            },
            ingredients: [
                "1 cup brown rice",
                "1 cup roasted sweet potato",
                "1 cup black beans",
                "1 cup roasted broccoli",
                "Tahini sauce",
                "Pumpkin seeds"
            ],
            calories: 580,
            servings: 1,
            url: "https://www.example.com/buddha-bowl"
        },
        {
            id: "default-luteal-3",
            title: "Calming Chamomile Smoothie",
            description: "Soothing smoothie with magnesium-rich ingredients.",
            image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=800&q=80",
            benefits: ["calming", "anti-inflammatory", "hormone-balancing"],
            nutrients: {
                magnesium: { quantity: 100, unit: "mg" },
                calcium: { quantity: 250, unit: "mg" },
                protein: { quantity: 12, unit: "g" }
            },
            ingredients: [
                "1 cup chamomile tea",
                "1 banana",
                "1 cup almond milk",
                "1 tbsp almond butter",
                "1 date",
                "1/4 tsp cinnamon"
            ],
            calories: 320,
            servings: 1,
            url: "https://www.example.com/calming-smoothie"
        },
        {
            id: "default-luteal-4",
            title: "Magnesium-Rich Dinner Bowl",
            description: "Evening meal to support sleep and relaxation.",
            image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
            benefits: ["sleep-supporting", "magnesium-rich", "balanced"],
            nutrients: {
                magnesium: { quantity: 150, unit: "mg" },
                protein: { quantity: 25, unit: "g" },
                fiber: { quantity: 8, unit: "g" }
            },
            ingredients: [
                "2 cups leafy greens",
                "1 cup quinoa",
                "1 cup roasted chickpeas",
                "1/2 avocado",
                "Pumpkin seeds",
                "Lemon-herb dressing"
            ],
            calories: 520,
            servings: 1,
            url: "https://www.example.com/dinner-bowl"
        },
        {
            id: "default-luteal-5",
            title: "Anti-Bloat Green Soup",
            description: "Digestive-friendly soup with anti-inflammatory properties.",
            image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
            benefits: ["anti-bloating", "digestive support", "hydrating"],
            nutrients: {
                fiber: { quantity: 10, unit: "g" },
                potassium: { quantity: 800, unit: "mg" },
                vitaminC: { quantity: 45, unit: "mg" }
            },
            ingredients: [
                "2 cups zucchini",
                "2 cups spinach",
                "1 cup coconut milk",
                "1 inch ginger",
                "Fresh herbs",
                "Bone broth"
            ],
            calories: 280,
            servings: 2,
            url: "https://www.example.com/green-soup"
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
        },
        {
            id: "default-menstrual-2",
            title: "Iron-Replenishing Breakfast",
            description: "Warm and nourishing breakfast to replenish iron stores.",
            image: "https://images.unsplash.com/photo-1543340904-0b1d843bccda?auto=format&fit=crop&w=800&q=80",
            benefits: ["iron-rich", "warming", "energy-sustaining"],
            nutrients: {
                iron: { quantity: 10, unit: "mg" },
                protein: { quantity: 15, unit: "g" },
                vitaminC: { quantity: 45, unit: "mg" }
            },
            ingredients: [
                "1 cup oatmeal",
                "2 tbsp molasses",
                "1 apple, diced",
                "1/4 cup walnuts",
                "Cinnamon",
                "Plant-based milk"
            ],
            calories: 420,
            servings: 1,
            url: "https://www.example.com/iron-breakfast"
        },
        {
            id: "default-menstrual-3",
            title: "Anti-Inflammatory Golden Milk",
            description: "Soothing turmeric drink to reduce inflammation and cramps.",
            image: "https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb?auto=format&fit=crop&w=800&q=80",
            benefits: ["anti-inflammatory", "pain-reducing", "warming"],
            nutrients: {
                curcumin: { quantity: 200, unit: "mg" },
                calcium: { quantity: 300, unit: "mg" },
                vitaminD: { quantity: 400, unit: "IU" }
            },
            ingredients: [
                "2 cups plant milk",
                "1 tsp turmeric",
                "1/2 tsp ginger",
                "1/4 tsp black pepper",
                "1 tbsp honey",
                "1/4 tsp cinnamon"
            ],
            calories: 180,
            servings: 2,
            url: "https://www.example.com/golden-milk"
        },
        {
            id: "default-menstrual-4",
            title: "Iron-Rich Veggie Stir-Fry",
            description: "Quick and easy iron-rich dinner with vitamin C for absorption.",
            image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
            benefits: ["iron-rich", "quick energy", "anti-inflammatory"],
            nutrients: {
                iron: { quantity: 8, unit: "mg" },
                vitaminC: { quantity: 70, unit: "mg" },
                protein: { quantity: 16, unit: "g" }
            },
            ingredients: [
                "2 cups tempeh",
                "2 cups broccoli",
                "1 bell pepper",
                "1 cup snap peas",
                "Ginger-garlic sauce",
                "Sesame seeds"
            ],
            calories: 480,
            servings: 2,
            url: "https://www.example.com/veggie-stirfry"
        },
        {
            id: "default-menstrual-5",
            title: "Comforting Red Lentil Dahl",
            description: "Iron-rich and comforting dish perfect for the menstrual phase.",
            image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
            benefits: ["iron-rich", "protein", "comforting"],
            nutrients: {
                iron: { quantity: 9, unit: "mg" },
                protein: { quantity: 18, unit: "g" },
                fiber: { quantity: 11, unit: "g" }
            },
            ingredients: [
                "1 cup red lentils",
                "1 can coconut milk",
                "2 tomatoes",
                "Indian spices",
                "Fresh cilantro",
                "Brown rice"
            ],
            calories: 550,
            servings: 2,
            url: "https://www.example.com/lentil-dahl"
        }
    ]
};

const DEFAULT_RECIPE_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkhlYWx0aHkgUmVjaXBlPC90ZXh0Pjwvc3ZnPg==';

// Helper function to get cached recipes
function getCachedRecipes(key) {
    const cached = recipeCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('Using cached recipes for:', key);
        return cached.data;
    }
    return null;
}

// Helper function to cache recipes
function cacheRecipes(key, recipes) {
    recipeCache.set(key, {
        timestamp: Date.now(),
        data: recipes
    });
}

// Helper function to get fallback recipes
function getFallbackRecipes(phase) {
    console.log('Getting fallback recipes for phase:', phase);
    if (phase && phase !== 'all' && DEFAULT_RECIPES[phase]) {
        return DEFAULT_RECIPES[phase];
    }
    return Object.values(DEFAULT_RECIPES).flat().slice(0, 6);
}

// Middleware to verify token
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ success: false, error: 'No token provided' });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
};

// Helper function to get nutritional requirements based on menstrual phase
function getNutritionalRequirements(phase) {
    const requirements = {
        follicular: {
            prefer: [
                'iron-rich foods',
                'vitamin C',
                'lean proteins',
                'leafy greens'
            ],
            avoid: [
                'processed foods',
                'excessive salt',
                'caffeine'
            ]
        },
        ovulation: {
            prefer: [
                'antioxidant-rich foods',
                'fiber-rich foods',
                'healthy fats',
                'whole grains'
            ],
            avoid: [
                'refined sugars',
                'processed foods',
                'excessive dairy'
            ]
        },
        luteal: {
            prefer: [
                'complex carbohydrates',
                'magnesium-rich foods',
                'calcium-rich foods',
                'vitamin B6'
            ],
            avoid: [
                'salty foods',
                'caffeine',
                'alcohol',
                'sugary foods'
            ]
        },
        menstrual: {
            prefer: [
                'iron-rich foods',
                'vitamin B12',
                'omega-3 fatty acids',
                'water-rich foods'
            ],
            avoid: [
                'fatty foods',
                'excessive salt',
                'caffeine',
                'alcohol'
            ]
        }
    };

    // If no phase specified or invalid phase, return empty requirements
    if (!phase || !requirements[phase]) {
        return {
            prefer: [],
            avoid: []
        };
    }

    return requirements[phase];
}

// Helper function to get user's health profile
async function getUserHealthProfile(userId) {
    try {
        const userRef = db.collection('users').doc(userId);
        const profileRef = userRef.collection('personalDetails').doc('profile');
        const profileDoc = await profileRef.get();

        if (!profileDoc.exists) {
            console.log('No health profile found for user, using default');
            return getDefaultHealthProfile();
        }

        const profileData = profileDoc.data() || {};
        console.log('Raw profile data:', profileData);

        // Get data from correct paths
        const diet = profileData.diet || {};
        const health = profileData.health || {};

        return {
            dietType: diet.dietType || '',
            medicalConditions: Array.isArray(health.medicalConditions) ? health.medicalConditions : [],
            allergies: health.allergies || [],
            preferences: {
                waterIntake: diet.waterIntake || '',
                caffeineIntake: diet.caffeineIntake || '',
                supplements: diet.supplements || ''
            },
            phase: 'follicular' // Default phase if not specified
        };
    } catch (error) {
        console.error('Error getting user health profile:', error);
        return getDefaultHealthProfile();
    }
}

// Helper function to get default health profile
function getDefaultHealthProfile() {
    return {
        dietType: '',
        medicalConditions: [],
        allergies: [],
        preferences: {
            waterIntake: '',
            caffeineIntake: '',
            supplements: ''
        },
        phase: 'follicular'
    };
}

// Helper function to make Edamam API request
async function makeEdamamRequest(query, healthProfile, requirements, phase) {
    try {
        // Clean and format the search query - only allow letters, numbers and spaces
        const cleanQuery = query.replace(/[^a-zA-Z0-9\s]/g, ' ')
            .split(' ')
            .filter(word => word.length > 0)
            .join(' ')
            .trim();
        console.log('Cleaned search query:', cleanQuery);

        // Base URL and parameters
        const baseUrl = 'https://api.edamam.com/api/recipes/v2';
        const params = new URLSearchParams();

        // Required parameters
        params.append('type', 'public');
        params.append('q', cleanQuery);
        params.append('app_id', EDAMAM_APP_ID);
        params.append('app_key', EDAMAM_APP_KEY);
        params.append('random', 'true');

        // Add basic diet restrictions - only use what's allowed in free tier
        if (healthProfile?.dietType) {
            const dietType = healthProfile.dietType.toLowerCase();
            if (dietType === 'vegetarian') {
                params.append('health', 'vegetarian');
            } else if (dietType === 'vegan') {
                params.append('health', 'vegan');
            }
        }

        const url = `${baseUrl}?${params.toString()}`;
        console.log('Making Edamam API request to:', url);

        try {
            const response = await axios.get(url, {
                timeout: 5000 // 5 second timeout
            });
            console.log('Edamam API response status:', response.status);

            if (!response.data || !response.data.hits) {
                console.log('No recipes found in API response, using defaults');
                return getDefaultRecipes(phase, healthProfile);
            }

            // Transform recipes and apply additional filtering in memory
            const recipes = response.data.hits.map(hit => {
                const recipe = hit.recipe;
                return {
                    title: recipe.label || '',
                    image: recipe.image || DEFAULT_RECIPE_IMAGE,
                    url: recipe.url || '',
                    ingredients: recipe.ingredientLines || [],
                    calories: Math.round(recipe.calories) || 0,
                    servings: recipe.yield || 4,
                    healthLabels: recipe.healthLabels || [],
                    dietLabels: recipe.dietLabels || [],
                    nutrients: recipe.totalNutrients || {},
                    totalDaily: recipe.totalDaily || {},
                    cuisineType: recipe.cuisineType || [],
                    mealType: recipe.mealType || [],
                    dishType: recipe.dishType || []
                };
            });

            // Apply PCOS-specific filtering in memory
            if (Array.isArray(healthProfile?.medicalConditions) &&
                healthProfile.medicalConditions.some(condition =>
                    condition && condition.toLowerCase().includes('pcos'))) {
                return recipes.filter(recipe => {
                    const sugar = recipe.nutrients?.SUGAR?.quantity || 0;
                    const fiber = recipe.nutrients?.FIBTG?.quantity || 0;
                    const isLowSugar = sugar < 10;
                    const isHighFiber = fiber >= 5;
                    return isLowSugar && isHighFiber;
                });
            }

            return recipes;
        } catch (apiError) {
            console.error('Edamam API request failed:', apiError.message);
            if (apiError.response?.status === 429) {
                console.log('Rate limit exceeded, using default recipes');
            }
            return getDefaultRecipes(phase, healthProfile);
        }
    } catch (error) {
        console.error('Error in recipe suggestion:', error);
        return getDefaultRecipes(phase, healthProfile);
    }
}

// Helper function to get default recipes based on phase
function getDefaultRecipes(phase, healthProfile) {
    const recipes = DEFAULT_RECIPES[phase] || [];

    // Apply PCOS filtering to default recipes if needed
    if (healthProfile?.medicalConditions?.some(c => c?.toLowerCase().includes('pcos'))) {
        return recipes.filter(recipe => {
            const sugar = recipe.nutrients?.SUGAR?.quantity || 0;
            const fiber = recipe.nutrients?.FIBTG?.quantity || 0;
            return sugar < 10 && fiber >= 5;
        });
    }

    return recipes;
}

// Main recipe suggestion endpoint
router.get("/suggestions", verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const { phase = 'follicular' } = req.query;

        // Get user's health profile
        const healthProfile = await getUserHealthProfile(userId);
        console.log('User health profile:', healthProfile);

        // Get base requirements for the phase
        const requirements = getNutritionalRequirements(phase);

        // Try to get cached recipes first
        const cacheKey = `${userId}-${phase}-${healthProfile.medicalConditions.join('-')}`;
        const cachedRecipes = getCachedRecipes(cacheKey);
        if (cachedRecipes) {
            console.log('Using cached recipes');
            return res.json({
                success: true,
                data: {
                    recipes: cachedRecipes,
                    requirements,
                    healthProfile,
                    dietAnalysis: {
                        averageCaloriesPerDay: 2000,
                        mealTypes: { breakfast: 1, lunch: 1, dinner: 1 }
                    }
                }
            });
        }

        // Construct search terms
        let searchTerms = [];

        // Add phase-specific terms first
        if (phase === 'follicular') {
            searchTerms.push('iron rich');
        } else if (phase === 'ovulation') {
            searchTerms.push('protein rich');
        } else if (phase === 'luteal') {
            searchTerms.push('magnesium rich');
        } else if (phase === 'menstrual') {
            searchTerms.push('iron rich');
        }

        // Add diet type if present
        if (healthProfile.dietType) {
            searchTerms.push(healthProfile.dietType);
        }

        // Add PCOS-specific terms if needed
        if (Array.isArray(healthProfile.medicalConditions) &&
            healthProfile.medicalConditions.some(condition =>
                condition && condition.toLowerCase().includes('pcos'))) {
            searchTerms.push('low glycemic');
            searchTerms.push('high fiber');
        }

        // Create search query
        const searchQuery = searchTerms.join(' ');
        console.log('Final search query:', searchQuery);

        // Get recipes from Edamam API
        let recipes = await makeEdamamRequest(searchQuery, healthProfile, requirements, phase);
        console.log('Received recipes from API:', recipes ? recipes.length : 0);

        // If no recipes found, use fallback recipes
        if (!recipes || recipes.length === 0) {
            console.log('No recipes found, using fallback recipes');
            recipes = getFallbackRecipes(phase).map(recipe => ({
                ...recipe,
                image: recipe.image || DEFAULT_RECIPE_IMAGE
            }));
        }

        // Cache the recipes
        cacheRecipes(cacheKey, recipes);

        res.json({
            success: true,
            data: {
                recipes,
                requirements,
                healthProfile,
                dietAnalysis: {
                    averageCaloriesPerDay: 2000,
                    mealTypes: {
                        breakfast: 1,
                        lunch: 1,
                        dinner: 1
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error in recipe suggestions:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get recipe suggestions',
            details: error.message
        });
    }
});

module.exports = router;