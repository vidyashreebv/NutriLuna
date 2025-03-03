import React from 'react';

import './Navbarafter.css';
import logo from '../assets/logo.svg';

const Navbarafter = ({ navItems, username }) => {
  console.log('Navbar rendering:', navItems);

  // Update the nav items that are passed in
  const updatedNavItems = navItems.map(item => {
    if (item.label === 'My Profile') {
      return {
        ...item,
        label: `${username}'s Profile`,
        href: '/dashboard',
        active: true
      };
    }
    return item;
  });

  return (
    <nav className="navbarafter-nav">
      <div className="navbarafter-top-line" />
      <div className="navbarafter-logo-container">
        <div className="navbarafter-logo">
          <img src={logo} />
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
