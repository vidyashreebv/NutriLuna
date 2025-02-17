import React, { useEffect, useState } from "react";
import "./blog.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => (
  <nav>
    <div>
      <div className="svg-container">
        <img src="Menstrual Cycle.svg" alt="" height="40px" />
      </div>
      <div>NutriLuna</div>
    </div>
    <div className="nav-options">
      <a href="index.html" className="nav-item">Home</a>
      <a href="about.html" className="nav-item">About</a>
      <a href="blog.html" className="nav-item active">Blog</a>
      <a href="signin.html" className="nav-item">
        <div className="svg-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
            <path d="M24 4A10 10 0 1024 24 10 10 0 1024 4zM36.021 28H11.979C9.785 28 8 29.785 8 31.979V33.5c0 3.312 1.885 6.176 5.307 8.063C16.154 43.135 19.952 44 24 44c7.706 0 16-3.286 16-10.5v-1.521C40 29.785 38.215 28 36.021 28z"></path>
          </svg>
          Sign in
        </div>
      </a>
    </div>
  </nav>
);

const HeroSection = () => (
  <section className="hero">
    <video autoPlay loop muted className="hero-video">
    <source src="/blogpage.mp4" type="video/mp4" />



      Your browser does not support the video tag.
    </video>
    <div className="hero-content">
      <h2>Welcome to Your Wellness Journey</h2>
      <p>Discover insights and tips for menstrual wellness.</p>
      <a href="#blog-posts" className="btn btn-primary">Explore Our Blog</a>
    </div>
  </section>
);

const BlogPosts = () => {
  const [articles, setArticles] = useState([]);
  
  useEffect(() => {
    const apiUrl = "https://newsapi.org/v2/everything?q=health+diet+menstrual+wellness&pageSize=100&apiKey=9fd24d14ddd54ddcadda53c41d9f2d55";
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => setArticles(data.articles || []))
      .catch(error => console.error("Error fetching data:", error));
  }, []);
  
  return (
    <section className="blog-posts" id="blog-posts">
      <div className="section-heading">
        <h2>Our Blog</h2>
      </div>
      <div className="blog-grid">
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <div key={index} className="blog-card">
              <img src={article.urlToImage || "default-image.jpg"} alt={article.title} />
              <div className="card-content">
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
              </div>
            </div>
          ))
        ) : (
          <p>No news available.</p>
        )}
      </div>
    </section>
  );
};

const SubscribeSection = () => (
  <section className="subscribe">
    <h2>Stay Informed!</h2>
    <p>Subscribe to receive personalized wellness tips for every phase of your cycle.</p>
    <form id="subscribe-form">
      <input className="inputs" type="email" id="email" placeholder="Enter your email" required />
      <button type="submit">Subscribe</button>
    </form>
  </section>
);

const Footer = () => (
  <footer>
    <div className="footer-content">
      <p>© 2025 Wellness Saga. All Rights Reserved.</p>
      <p>Disclaimer: This website provides general information and is not a substitute for professional advice.</p>
    </div>
  </footer>
);

const BlogPage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <BlogPosts />
      <SubscribeSection />
      <Footer />
    </div>
  );
};

export default BlogPage;
