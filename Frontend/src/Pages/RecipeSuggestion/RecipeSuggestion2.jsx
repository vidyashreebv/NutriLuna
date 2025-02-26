import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./RecipieSuggestion2.css";
import recipesVideo from'../../assets/recipes.mp4';
import Navbarafter from '../../Components/Navbarafter';
import Footer from "../../Components/Footer";



const RecipeSuggestion2 = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 6;
  const [paginatedRecipes, setPaginatedRecipes] = useState([]);
  const [pageCount, setPageCount] = useState(0);

  // Move wellnessRecipes data to a separate data file and import it
  const wellnessRecipes = [
    {
      id: 1,
      title: "Soothing Raspberry Moon Milk",
      description:
        "A calming blend of warm milk, raspberry, and adaptogens to support restful sleep and hormone balance.",
      image:
        "https://gonnaneedmilk.com/wp-content/uploads/2021/03/Recipe_2019_07_16_Cherry-Beet-Moon-Milk_1024x768.jpg",
      phase: "menstrual",
      benefits: [
        "Promotes relaxation",
        "Supports hormone balance",
        "Rich in antioxidants",
      ],
    },
    {
      id: 2,
      title: "Iron-Boosting Berry Smoothie Bowl",
      description:
        "A vibrant smoothie bowl packed with iron-rich ingredients and topped with seeds and berries to replenish energy.",
      image:
        "https://simplegreensmoothies.com/wp-content/uploads/image-1.png",
      phase: "menstrual",
      benefits: ["Iron replenishment", "Energy boost", "Anti-inflammatory"],
    },
    {
      id: 3,
      title: "Golden Hormone Balance Latte",
      description:
        "A warming turmeric-based latte with adaptogenic herbs to support hormonal harmony and reduce inflammation.",
      image:
        "https://pilateshuddersfield.co.uk/wp-content/uploads/2021/12/instant-turmeric-latte.jpg.webp",
      phase: "follicular",
      benefits: [
        "Hormone support",
        "Reduces inflammation",
        "Improves circulation",
      ],
    },
    {
      id: 4,
      title: "Almond Butter Smoothie",
      description:
        "A creamy smoothie made with almond butter to support hormone balance and boost energy levels.",
      image:
        "https://www.eatingbirdfood.com/wp-content/uploads/2023/02/banana-almond-butter-smoothie-hero.jpg",
      phase: "follicular",
      benefits: [
        "Supports hormone balance",
        "Boosts energy levels",
        "Rich in protein",
      ],
    },
    {
      id: 5,
      title: "Chia Pudding",
      description:
        "A nutritious pudding made with chia seeds, rich in omega-3s and perfect for balancing blood sugar.",
      image:
        "https://feelgoodfoodie.net/wp-content/uploads/2018/06/3-Ingredient-Chia-Pudding-06.jpg",
      phase: "luteal",
      benefits: [
        "Rich in omega-3 fatty acids",
        "Helps stabilize blood sugar levels",
        "Great for digestive health",
      ],
    },
    {
      id: 6,
      title: "Spinach Salad",
      description:
        "A fresh salad loaded with spinach, iron, and antioxidants to promote overall health and bone strength.",
      image:
        "https://cdn.loveandlemons.com/wp-content/uploads/2023/11/spinach-salad-1-772x1024.jpg",
      phase: "ovulation",
      benefits: [
        "Loaded with iron",
        "Rich in antioxidants",
        "Helps with bone health",
      ],
    },
    {
      id: 7,
      title: "Citrus Energy Booster Smoothie",
      description:
        "An invigorating citrus-based smoothie packed with vitamin C and antioxidants for a natural energy lift.",
      image:
        "https://somethewiser.com/wp-content/uploads/2016/02/Citrus-Smoothie.jpg",
      phase: "follicular",
      benefits: [
        "Boosts immunity",
        "Increases energy",
        "High in vitamin C",
      ],
    },
    {
      id: 8,
      title: "Quinoa and Kale Power Bowl",
      description:
        "A nutrient-dense power bowl combining quinoa, kale, and a citrus vinaigrette to nourish and energize.",
      image:
        "https://cookieandkate.com/images/2024/01/southwestern-kale-power-salad-recipe.jpg",
      phase: "luteal",
      benefits: [
        "Supports digestion",
        "Packed with vitamins",
        "Rich in fiber",
      ],
    },
    {
      id: 9,
      title: "Avocado and Egg Toast",
      description:
        "A simple yet satisfying combination of creamy avocado and protein-rich eggs on whole-grain toast.",
      image:
        "https://www.allrecipes.com/thmb/mJJPeaKKj61DZ4kc_jHHVI3kmG8=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/AvocadoToastwithEggFranceC4x3-bb87e3bbf1944657b7db35f1383fabdb.jpg",
      phase: "ovulation",
      benefits: [
        "Boosts protein intake",
        "Provides healthy fats",
        "Supports brain function",
      ],
    },
    {
      id: 10,
      title: "Beetroot Detox Juice",
      description:
        "A refreshing juice made with beetroot, apple, and ginger to cleanse and rejuvenate your body.",
      image:
        "https://www.alphafoodie.com/wp-content/uploads/2024/06/Beet-Juice-Recipe-Main-1.jpeg",
      phase: "menstrual",
      benefits: [
        "Detoxifies the body",
        "Improves blood circulation",
        "Rich in antioxidants",
      ],
    },
    {
      id: 11,
      title: "Warm Cinnamon Apple Oats",
      description:
        "Comforting oatmeal topped with spiced apples and nuts for hormonal balance and warmth.",
      image:
        "https://www.eatingbirdfood.com/wp-content/uploads/2022/11/apple-cinnamon-oatmeal-hero-633x950.jpg",
      phase: "menstrual",
      benefits: ["Provides warmth", "Rich in fiber", "Balances hormones"],
    },
    {
      id: 12,
      title: "Matcha Green Energy Latte",
      description:
        "A revitalizing green tea latte packed with antioxidants and natural caffeine.",
      image:
        "https://primulaproducts.com/cdn/shop/articles/jackieo_Youve_been_drinking_matcha_green_tea_latte_for_a_few_w_f5899c8d-f20b-4331-b1a8-d1eb1736d367_1200x1200.png?v=1687789713",
      phase: "follicular",
      benefits: [
        "Boosts metabolism",
        "Enhances energy",
        "High in antioxidants",
      ],
    },
    {
      id: 13,
      title: "Coconut Cashew Energy Bites",
      description:
        "Delicious no-bake bites loaded with healthy fats and protein for sustained energy.",
      image:
        "https://acleanbake.com/wp-content/uploads/2016/05/IMG_0624.jpg",
      phase: "ovulation",
      benefits: [
        "Boosts energy",
        "Supports brain health",
        "Rich in healthy fats",
      ],
    },
    {
      id: 14,
      title: "Zucchini Noodle Salad",
      description:
        "A light salad with zucchini noodles, cherry tomatoes, and a zesty vinaigrette.",
      image:
        "https://www.eatingbirdfood.com/wp-content/uploads/2021/06/zoodle-salad-overhead-633x950.jpg",
      phase: "luteal",
      benefits: [
        "Low in calories",
        "Rich in vitamins",
        "Supports digestion",
      ],
    },
    {
      id: 15,
      title: "Berry Chia Detox Water",
      description:
        "A refreshing water infused with berries, chia seeds, and mint to hydrate and cleanse.",
      image:
        "https://img.etimg.com/thumb/109650325/109650325.jpg?height=746&width=420&resizemode=76&imgsize=48868",
      phase: "menstrual",
      benefits: [
        "Promotes hydration",
        "Aids detoxification",
        "Rich in antioxidants",
      ],
    },
    {
      id: 16,
      title: "Pumpkin Spice Smoothie",
      description:
        "A cozy smoothie with pumpkin puree, spices, and almond milk for seasonal nourishment.",
      image:
        "https://www.lemontreedwelling.com/wp-content/uploads/2013/09/Pumpkin-Spice-Smoothie-square-2.jpg",
      phase: "follicular",
      benefits: ["Supports immunity", "Boosts energy", "Rich in vitamin A"],
    },
    {
      id: 17,
      title: "Grilled Salmon and Asparagus",
      description:
        "A protein-packed dish with omega-3-rich salmon and nutrient-dense asparagus.",
      image:
        "https://www.somewhatsimple.com/wp-content/uploads/2020/05/grilled_salmon_asparagus_1.jpg",
      phase: "ovulation",
      benefits: [
        "Rich in omega-3s",
        "Boosts brain function",
        "Supports bone health",
      ],
    },
    {
      id: 18,
      title: "Turmeric Ginger Tea",
      description:
        "A soothing tea with turmeric and ginger to reduce inflammation and improve circulation.",
      image:
        "https://www.allrecipes.com/thmb/ylDD0bh-Dcn3vkbr42yOKk1nEPo=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/AR-242148-Ginger-Turmeric-Herbal-Tea-4x3-827f4b208340471eae703606d123806a.jpg",
      phase: "menstrual",
      benefits: [
        "Reduces inflammation",
        "Improves circulation",
        "Boosts immunity",
      ],
    },
    {
      id: 19,
      title: "Roasted Sweet Potato and Chickpea Salad",
      description:
        "A hearty salad with roasted sweet potatoes, chickpeas, and a tahini dressing.",
      image:
        "https://minimalistbaker.com/wp-content/uploads/2015/08/HEALTHY-Roasted-Sweet-Potato-Crispy-Chickpea-Salad-with-a-3-ingredient-Creamy-Tahini-Dressing-vegan-glutenfree-plantbased-healthy-recipe-dinner-salad-686x1024.jpg",
      phase: "luteal",
      benefits: ["Rich in fiber", "Supports digestion", "Promotes satiety"],
    },
    {
      id: 20,
      title: "Mango Spinach Smoothie",
      description:
        "A tropical green smoothie with mango, spinach, and coconut water for hydration.",
      image:
        "https://www.wellplated.com/wp-content/uploads/2016/01/Mango-Green-Smoothie-Recipe.jpg",
      phase: "follicular",
      benefits: ["Hydrates naturally", "High in vitamins", "Boosts energy"],
    },
    {
      id: 21,
      title: "Lemon Garlic Quinoa",
      description:
        "A light yet filling dish with quinoa, fresh lemon, and garlic for flavor and nutrients.",
      image:
        "https://foolproofliving.com/wp-content/uploads/2020/04/Herb-Lemon-Quinoa-Recipe-640x640.jpg",
      phase: "ovulation",
      benefits: [
        "Boosts metabolism",
        "Rich in protein",
        "Supports digestion",
      ],
    },
    {
      id: 22,
      title: "Dark Chocolate Almond Bark",
      description:
        "A sweet treat with antioxidant-rich dark chocolate and nutrient-packed almonds.",
      image:
        "https://www.forkknifeswoon.com/wp-content/uploads/2014/12/20141204-Fork_Knife_Swoon_Salted_Dark_Chocolate_Almond_Bark_WEB_01-605x908.jpg",
      phase: "menstrual",
      benefits: [
        "Rich in antioxidants",
        "Supports heart health",
        "Boosts mood",
      ],
    },
    {
      id: 23,
      title: "Kale and Avocado Salad",
      description:
        "A vibrant salad with massaged kale, creamy avocado, and a lemon vinaigrette.",
      image:
        "https://foolproofliving.com/wp-content/uploads/2013/06/Kale-Avocado-Salad-600x600.jpg",
      phase: "follicular",
      benefits: [
        "Rich in healthy fats",
        "Boosts energy",
        "Supports detoxification",
      ],
    },
    {
      id: 24,
      title: "Spiced Lentil Soup",
      description:
        "A warming soup with lentils, spices, and vegetables for nourishment and comfort.",
      image:
        "https://ohsheglows.com/wp-content/uploads/2016/04/065A3820.jpg",
      phase: "luteal",
      benefits: [
        "High in protein",
        "Promotes digestion",
        "Supports immunity",
      ],
    },
    {
      id: 25,
      title: "Herbed Citrus Infused Water",
      description:
        "Hydrating water infused with citrus slices and fresh herbs for a refreshing boost.",
      image:
        "https://champagne-tastes.com/wp-content/uploads/2018/06/infused-water2-small-1.jpg",
      phase: "ovulation",
      benefits: [
        "Promotes hydration",
        "Rich in vitamins",
        "Supports digestion",
      ],
    },
    {
      id: 26,
      title: "Berry Almond Yogurt Parfait",
      description:
        "A layered parfait with creamy yogurt, fresh berries, and crunchy almonds.",
      image:
        "https://gittaskitchen.com/wp-content/uploads/2019/08/IMG_8545-768x1024.jpg",
      phase: "follicular",
      benefits: [
        "Rich in probiotics",
        "Boosts energy",
        "Supports gut health",
      ],
    },
    {
      id: 27,
      title: "Stuffed Bell Peppers",
      description:
        "Colorful bell peppers stuffed with quinoa, black beans, and spices for a wholesome meal.",
      image:
        "https://www.budgetbytes.com/wp-content/uploads/2023/08/Stuffed-Bell-Peppers-V2-800x1067.jpg",
      phase: "luteal",
      benefits: ["Rich in fiber", "High in protein", "Promotes satiety"],
    },
    {
      id: 28,
      title: "Avocado Berry Toast",
      description:
        "A unique toast topped with creamy avocado and fresh berries for a sweet and savory snack.",
      image:
        "https://www.healingtomato.com/wp-content/uploads/2017/09/quick-breakfast.jpg",
      phase: "ovulation",
      benefits: [
        "Boosts energy",
        "Provides healthy fats",
        "Rich in antioxidants",
      ],
    },
    {
      id: 29,
      title: "Beet and Orange Salad",
      description:
        "A refreshing salad with roasted beets, orange segments, and a tangy vinaigrette.",
      image:
        "https://feelgoodfoodie.net/wp-content/uploads/2017/04/Beet-Orange-Salad-3.jpg",
      phase: "menstrual",
      benefits: [
        "Detoxifies the body",
        "Rich in vitamins",
        "Improves circulation",
      ],
    },
    {
      id: 30,
      title: "Honey Lemon Ginger Tea",
      description:
        "A soothing tea with honey, lemon, and ginger for warmth and immune support.",
      image:
        "https://www.allrecipes.com/thmb/E1weMF_WYbOgdWqFY-HNX2l-mmI=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/256236-warm-lemon-honey-ginger-soother-ddmfs-3X4-0613-521f2166f75645e3b1c352ce81d52a85.jpg",
      phase: "menstrual",
      benefits: [
        "Boosts immunity",
        "Promotes relaxation",
        "Reduces inflammation",
      ],
    },
  ];

  const displayRecipes = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const filteredRecipes = wellnessRecipes.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPhase = selectedPhase === 'all' || recipe.phase === selectedPhase;
      return matchesSearch && matchesPhase;
    });

    const start = (currentPage - 1) * itemsPerPage;
    const paginatedRecipes = filteredRecipes.slice(start, start + itemsPerPage);
    
    setPaginatedRecipes(paginatedRecipes);
    setPageCount(Math.ceil(filteredRecipes.length / itemsPerPage));
    setLoading(false);
  };

  useEffect(() => {
    displayRecipes();
  }, [currentPage, searchTerm, selectedPhase]);
  const navItems = [
    { label: 'Home', href: '/landing'},
        { label: 'About', href: '/aboutusafter' , active: true },
        { label: 'Blog', href: '/blogafter' },
        { label: 'Track Your Periods', href: '/period'},
        { label: 'Diet Tracking', href: '/diet'},
        { label: 'Recipe Suggestions', href: '/recipe' },
        { label: 'Consultation', href: 'consultation' },
        { label: 'My Profile', href: '/dashboard' }
  ];

  return (
    <>
        <Navbarafter navItems={navItems}/>
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

      <div className="main-search">
        <button onClick={displayRecipes}>Discover Recipes</button>
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

      {loading && <div className="loading" />}

      <div id="recipes-container" className="book-transition">
        {paginatedRecipes.map((recipe, index) => (
          <div key={recipe.id} className="recipe" style={{animationDelay: `${index * 0.1}s`}}>
            <img src={recipe.image} alt={recipe.title} />
            <div className="recipe-content">
              <span className="phase-tag">{recipe.phase} phase</span>
              <h3>{recipe.title}</h3>
              <p>{recipe.description}</p>
              <ul className="benefits-list">
                {recipe.benefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
              <a href="#" className="view-recipe-btn">View Recipe</a>
            </div>
          </div>
        ))}
      </div>

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
      <Footer/>
    </>
  );
};

export default RecipeSuggestion2;
