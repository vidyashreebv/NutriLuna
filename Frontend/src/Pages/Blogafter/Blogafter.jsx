import React, { useEffect, useState } from "react";
import "./../Blog/Blog.css";
import Navbarafter from "../../Components/Navbarafter";
import Footer from "../../Components/Footer";
import { useLoading } from '../../context/LoadingContext';
import videoSource from '../../assets/video.mp4';
import { API_ENDPOINTS } from '../../config/apiConfig';

// Fallback articles in case the API fails
const FALLBACK_ARTICLES = [
  {
    title: "Women's Health and Nutrition Guide",
    description: "A comprehensive guide to maintaining optimal health through proper nutrition. Learn about the essential nutrients women need at different life stages.",
    url: "https://www.healthline.com/nutrition/womens-health-nutrition-guide",
    urlToImage: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Hormonal Balance Through Diet",
    description: "Learn how your diet can help maintain hormonal balance and improve overall wellbeing. Discover foods that support your endocrine system and help regulate hormones naturally.",
    url: "https://www.healthline.com/nutrition/hormonal-balance-diet",
    urlToImage: "https://images.unsplash.com/photo-1519824144514-5faadc7d025e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Wellness Tips for Women",
    description: "Essential wellness tips and practices for women of all ages. From self-care routines to lifestyle changes, discover ways to enhance your overall wellbeing.",
    url: "https://www.healthline.com/health/womens-health/wellness-tips",
    urlToImage: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Menstrual Health and Diet",
    description: "How your diet affects your menstrual health. Learn which foods can help alleviate symptoms and which ones to avoid during your cycle.",
    url: "https://www.healthline.com/nutrition/menstrual-health-diet",
    urlToImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Fertility and Nutrition",
    description: "The connection between nutrition and fertility. Discover how certain foods and nutrients can support reproductive health and improve fertility outcomes.",
    url: "https://www.healthline.com/nutrition/fertility-nutrition",
    urlToImage: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Menopause and Diet",
    description: "Nutritional strategies for managing menopause symptoms. Learn how diet changes can help alleviate hot flashes, mood swings, and other common symptoms.",
    url: "https://www.healthline.com/nutrition/menopause-diet",
    urlToImage: "https://images.unsplash.com/photo-1511295742362-92c96b1cf484?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Bone Health for Women",
    description: "Maintaining strong bones through proper nutrition. Discover calcium-rich foods and other nutrients essential for preventing osteoporosis.",
    url: "https://www.healthline.com/nutrition/bone-health-women",
    urlToImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Heart Health for Women",
    description: "Heart disease is the leading cause of death for women. Learn about heart-healthy foods and lifestyle changes to protect your cardiovascular health.",
    url: "https://www.healthline.com/health/womens-health/heart-health",
    urlToImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

const Blogafter = () => {
  const { showLoader, hideLoader } = useLoading();
  const [articles, setArticles] = useState([]);
  const [videoError, setVideoError] = useState(false);
  const [apiError, setApiError] = useState(false);

  const navItems = [
    { label: 'Home', href: '/landing' },
    { label: 'About', href: '/aboutusafter' },
    { label: 'Blog', href: '/blogafter', active: true  },
    { label: 'Track Your Periods', href: '/period'},
    { label: 'Diet Tracking', href: '/diet'},
    { label: 'Recipe Suggestions', href: '/recipe' },
    { label: 'Consultation', href: 'consultation' },
    { label: 'My Profile', href: '/dashboard' }
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        showLoader();
        setApiError(false);
        const apiUrl = API_ENDPOINTS.NEWS_API("women health nutrition wellness", 20);
        console.log("Fetching from News API:", apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`News API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.status === "error") {
          throw new Error(`News API error: ${data.message || "Unknown error"}`);
        }
        
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles);
        } else {
          throw new Error("No articles returned from News API");
        }
      } catch (error) {
        console.error("Error fetching blog articles:", error);
        setApiError(true);
        setArticles(FALLBACK_ARTICLES);
      } finally {
        hideLoader();
      }
    };

    fetchBlogs();
  }, []);

  const handleVideoError = () => {
    console.error("Video failed to load");
    setVideoError(true);
  };

  return (
    <div className="blog-page-wrapper">
      <Navbarafter navItems={navItems} />

      <div className="blog-hero-section">
        <div className="hero-video-wrapper">
          {!videoError ? (
            <video 
              autoPlay 
              loop 
              muted 
              className="hero-video"
              onError={handleVideoError}
              playsInline
            >
              <source src={videoSource} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="hero-video-fallback">
              <img 
                src="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Wellness background" 
                className="hero-video"
              />
            </div>
          )}
        </div>
        <div className="blog-hero-content">
          <h1>Wellness & Health Blog</h1>
          <p>Discover insights for a healthier lifestyle</p>
        </div>
      </div>

      <div className="blog-main-content">
        <div className="blog-posts-container">
          <h2>Latest Articles</h2>
          {apiError && (
            <div className="api-error-message">
              <p>We're having trouble connecting to our news service. Showing featured articles instead.</p>
            </div>
          )}
          <div className="blog-posts-grid">
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <div key={index} className="blog-card">
                  <div className="blog-card-image">
                    <img
                      src={article.urlToImage || "/default-blog-image.jpg"}
                      alt={article.title}
                      onError={(e) => {
                        e.target.src = "/default-blog-image.jpg";
                      }}
                    />
                  </div>
                  <div className="blog-card-content">
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                    <div className="blog-card-footer">
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="blog-read-more"
                      >
                        Read More →
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="blog-loading">Loading articles...</div>
            )}
          </div>
        </div>

        <div className="blog-newsletter">
          <div className="newsletter-content">
            <h2>Subscribe to Our Newsletter</h2>
            <p>Get the latest health and wellness tips delivered to your inbox.</p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-button">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blogafter;
