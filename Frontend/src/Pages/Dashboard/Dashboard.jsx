import React from "react";
import "./Dashboard.css";
import { FaHome, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">Dashboard</h2>
        <ul className="menu">
          <li className="menu-item"><FaHome /> Home</li>
          <li className="menu-item"><FaUser /> Profile</li>
          <li className="menu-item"><FaCog /> Settings</li>
          <li className="menu-item logout"><FaSignOutAlt /> Logout</li>
        </ul>
      </aside>
      <main className="main-content">
        <header className="header">
          <h1>Welcome to Your Dashboard</h1>
        </header>
        <section className="content">
          <p>This is your main dashboard content area.</p>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
