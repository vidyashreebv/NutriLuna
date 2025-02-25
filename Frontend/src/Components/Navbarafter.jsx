import React from 'react';

import './Navbarafter.css';
import logo from '../assets/logo.svg';

const Navbarafter = ({ navItems }) => {
  console.log('Navbar rendering:', navItems);
  return (

    <nav className="navbarafter-nav">
      <div className="navbarafter-logo-container">
        <div className="navbarafter-logo">
          <img src={logo} />
        </div>
        <div className="navbarafter-brand">NutriLuna</div>
      </div>
      <div className="navbarafter-nav-items">
        {navItems && navItems.length > 0 ? (
          navItems.map((item, index) => (
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
