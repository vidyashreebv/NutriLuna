// Navbar.jsx
import React from 'react';
import { LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo">
            <img src="/api/placeholder/32/32" alt="NutriLuna Logo" className="logo-img" />
            <span className="logo-text">NutriLuna</span>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/blog" className="nav-link">Blog</a>
          <a href="/track" className="nav-link">Track Your Periods</a>
          <a href="/diet" className="nav-link">Diet Tracking</a>
          <a href="/recipes" className="nav-link">Recipe Suggestions</a>
          <a href="/consultation" className="nav-link">Consultation</a>
        </div>

        {/* Profile Section */}
        <div className="profile-section">
          <a href="/profile" className="profile-button">My Profile</a>
          <div className="user-profile">
            <img src="/api/placeholder/32/32" alt="User Profile" className="profile-img" />
            <span className="user-name">Emma Johnson</span>
          </div>
          <button className="sign-out-button">
            <LogOut className="sign-out-icon" />
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;