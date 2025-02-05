import React, { useState, useEffect } from 'react';
import './AboutUs.css';

const AboutUs = () => {
  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    awards: 0,
  });

  useEffect(() => {
    const incrementStats = () => {
      let start = { users: 0, projects: 0, awards: 0 };
      const end = { users: 1500, projects: 120, awards: 35 };
      const duration = 2000;
      const steps = 50;
      const interval = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        setStats({
          users: Math.min(end.users, Math.floor((end.users / steps) * step)),
          projects: Math.min(end.projects, Math.floor((end.projects / steps) * step)),
          awards: Math.min(end.awards, Math.floor((end.awards / steps) * step)),
        });

        if (step >= steps) {
          clearInterval(timer);
        }
      }, interval);
    };

    incrementStats();
  }, []);

  return (
    <div className="about-us">
      
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to NutriLuna</h1>
          <p>
            We’re dedicated to creating innovative solutions that connect people and technology for a better tomorrow.
          </p>
        </div>
      </div>

      <div className="mission-section">
        <h2>Our Mission</h2>
        <p>
          At NutriLuna, we're dedicated to revolutionizing women's health by bridging the gap between nutrition and reproductive wellness.
        </p>
      </div>

      <div className="features-section">
        <h2>What Sets Us Apart</h2>
        <div className="features">
          <div className="feature">
            <h3>Personalized Tracking</h3>
            <p>Advanced nutrition and cycle tracking tailored to your unique needs and goals.</p>
          </div>
          <div className="feature">
            <h3>Expert Guidance</h3>
            <p>Connect with qualified health professionals for personalized consultations and advice.</p>
          </div>
          <div className="feature">
            <h3>Smart Recipes</h3>
            <p>Access nutrient-rich recipes designed to support your reproductive health goals.</p>
          </div>
          <div className="feature">
            <h3>Data Insights</h3>
            <p>Understand the correlation between your diet and reproductive health through advanced analytics.</p>
          </div>
        </div>
      </div>

      <div className="statistics-section">
        <div className="stat">
          <h3>{stats.users}+</h3>
          <p>Happy Active Users</p>
        </div>
        <div className="stat">
          <h3>{stats.projects}+</h3>
          <p>Expert consultations</p>
        </div>
        <div className="stat">
          <h3>{stats.awards}+</h3>
          <p>Healthy recipes</p>
        </div>
      </div>

      <div className="cta">
        <h2>Join Our Community</h2>
        <p>Take control of your reproductive health journey with personalized nutrition guidance.</p>
        <a href="#" className="cta-button">Get Started Today</a>
      </div>
    </div>
  );
};

export default AboutUs;
