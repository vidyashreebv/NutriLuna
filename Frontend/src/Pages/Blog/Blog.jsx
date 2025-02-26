import React, { useEffect, useState } from "react";
import "./blog.css";
import Navbarafter from "../../Components/Navbarafter";
import Footer from "../../Components/Footer";
import blogVideo from "../../assets/blogpage.mp4";

const Blog = () => {
  const [articles, setArticles] = useState([]);

  const navItems = [
    { label: 'Home', href: '/landing' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog', active: true },
    { label: 'Login', href: '/login' }
  ];
  

  useEffect(() => {
    const apiUrl = "https://newsapi.org/v2/everything?q=health+diet+menstrual+wellness&pageSize=100&apiKey=9fd24d14ddd54ddcadda53c41d9f2d55";
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => setArticles(data.articles || []))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="blog-page-wrapper">
      <Navbarafter navItems={navItems} />

      <div className="blog-hero-section">
        <div className="hero-video-wrapper">
          <video autoPlay loop muted className="hero-video">
            <source src={blogVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="blog-hero-content">
          <h1>Wellness & Health Blog</h1>
          <p>Discover insights for a healthier lifestyle</p>
        </div>
      </div>

      <div className="blog-main-content">
        <div className="blog-posts-container">
          <h2>Latest Articles</h2>
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

export default Blog;
