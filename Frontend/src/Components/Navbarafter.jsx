import React from 'react';
import './Navbarafter.css';
import logo from '../assets/logo.svg';
import { useAuth } from '../context/AuthContext';

const Navbarafter = ({ navItems }) => {
  const { currentUser } = useAuth();

  // Get username from email or displayName
  const username = currentUser ?
    (currentUser.displayName || currentUser.email?.split('@')[0] || 'User') :
    'User';

  // Update the nav items that are passed in
  const updatedNavItems = navItems.map(item => {
    if (item.label === 'My Profile') {
      return {
        ...item,
        label: `${username.toUpperCase()}'s Profile`,
        href: '/dashboard',
        active: window.location.pathname === '/dashboard'
      };
    }
    return item;
  });

  return (
    <nav className="navbarafter-nav">
      <div className="navbarafter-top-line" />
      <div className="navbarafter-logo-container">
        <div className="navbarafter-logo">
          <img src={logo} alt="NutriLuna Logo" />
        </div>
        <div className="navbarafter-brand">NutriLuna</div>
      </div>
      <div className="navbarafter-nav-items">
        {updatedNavItems && updatedNavItems.length > 0 ? (
          updatedNavItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`navbarafter-nav-link ${item.active ? 'navbarafter-nav-link-active' : ''}`}
            >
              {item.label}
            </a>
          ))
        ) : (
          <p className="navbarafter-placeholder">No menu items available</p>
        )}
      </div>
    </nav>
  );
};

export default Navbarafter;
