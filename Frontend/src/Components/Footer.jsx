import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content-wrapper">
        <div className="footer-brand-section">
          <img src="./../Frontend/src/assets/logo.svg" alt="NutriLuna" className="footer-logo" />
          <h2>NutriLuna</h2>
          <p>Empowering women through personalized wellness tracking and insights.</p>
          <div className="social-links">
            <a href="#" className="social-icon">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="footer-link-column">
            <h3>Company</h3>
            <Link to="/about">About Us</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/blog">Blog</Link>
          </div>

          <div className="footer-link-column">
            <h3>Features</h3>
            <Link to="/period-tracking">Period Tracking</Link>
            <Link to="/nutrition">Nutrition</Link>
            <Link to="/recipes">Recipes</Link>
            <Link to="/consultation">Consultation</Link>
          </div>

          <div className="footer-link-column">
            <h3>Support</h3>
            <Link to="/help">Help Center</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Use</Link>
            <Link to="/faq">FAQ</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>© 2024 NutriLuna. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
