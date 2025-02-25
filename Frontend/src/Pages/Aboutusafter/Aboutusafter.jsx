import React from 'react';
import './Aboutusafter.css';
import Navbarafter from "../../Components/Navbarafter";
import Footer from "../../Components/Footer";

const AboutUsAfter = () => {
  const navItems = [
    { label: 'Home', href: '/indexafter' },
    { label: 'About', href: '/aboutusafter', active: true },
    { label: 'Blog', href: '/blogafter' },
    { label: 'Track Your Periods', href: '/period' },
    { label: 'Diet Tracking', href: '/diet' },
    { label: 'Recipe Suggestions', href: 'recipe-suggestions.html' },
    { label: 'Consultation', href: 'consultation.html' },
    { label: 'My Profile', href: '/dashboard' }
  ];

  return (
    <div>
      <Navbarafter navItems={navItems} />
      <div className="about-us">
        <div className="hero-section">
          <div className="hero-content">
            <h1>Welcome to NutriLuna</h1>
            <p>Empowering Women's Health Through Innovation</p>
          </div>
        </div>

        <div className="cards-container">
          <div className="info-card">
            <h2>Our Vision</h2>
            <p>To revolutionize women's health management through innovative digital solutions that provide personalized care and support.</p>
          </div>

          <div className="info-card">
            <h2>Our Mission</h2>
            <p>Empowering women with comprehensive health tracking tools and personalized insights for better well-being and informed decision-making.</p>
          </div>

          <div className="info-card">
            <h2>What Sets Us Apart</h2>
            <p>Our unique combination of period tracking, nutritional guidance, and personalized health insights makes us your complete women's health companion.</p>
          </div>
        </div>

        <h2 className="section-title">Our Key Features</h2>
        <div className="features">
          <div className="feature-card">
            <h3>Period Tracking</h3>
            <p>Advanced menstrual cycle tracking with predictive analytics and personalized insights.</p>
          </div>
          <div className="feature-card">
            <h3>Nutrition Monitoring</h3>
            <p>Comprehensive diet tracking with customized nutritional recommendations.</p>
          </div>
          <div className="feature-card">
            <h3>Health Insights</h3>
            <p>Data-driven health analytics and personalized wellness recommendations.</p>
          </div>
          <div className="feature-card">
            <h3>Expert Support</h3>
            <p>Access to healthcare professionals and nutritionists for personalized guidance.</p>
          </div>
        </div>

        <div className="statistics-section">
          <div className="stat-card">
            <h3>10K+</h3>
            <p>Active Users</p>
          </div>
          <div className="stat-card">
            <h3>95%</h3>
            <p>User Satisfaction</p>
          </div>
          <div className="stat-card">
            <h3>24/7</h3>
            <p>Support Available</p>
          </div>
        </div>

        <div className="cta">
          <h2>Start Your Health Journey Today</h2>
          <p>Join thousands of women who have already transformed their health management with NutriLuna.</p>
          <a href="/login" className="cta-button">Get Started</a>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default AboutUsAfter;
