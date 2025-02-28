import React from 'react';
import './Consultation.css';
import Navbarafter from '../../Components/Navbarafter';
import Footer from '../../Components/Footer';
import consultVideo from '../../assets/consult.mp4';

const navItems = [
  { label: 'Home', href: '/landing' },
  { label: 'About', href: '/aboutusafter' },
  { label: 'Blog', href: '/blogafter' },
  { label: 'Track Your Periods', href: '/period'},
  { label: 'Diet Tracking', href: '/diet' },
  { label: 'Recipe Suggestions', href: '/recipe' },
  { label: 'Consultation', href: '/consultation', active: true },
  { label: 'My Profile', href: '/dashboard' }
];

const Header = () => (
  <div className="hero-section">
    <div className="video-overlay">
      <video autoPlay loop muted className="background-video">
        <source src={consultVideo} type="video/mp4" />
      </video>
    </div>
    <div className="hero-content">
      <h1>Expert Medical Consultation</h1>
      <p>Get personalized healthcare guidance from experienced professionals</p>
      <a href="#plans" className="cta-button">View Our Plans</a>
    </div>
  </div>
);

const ConsultationPage = () => (
  <div className="consultation-wrapper">
    <Navbarafter navItems={navItems} />
    <Header />
    
    <div className="consultation-main-container" id="plans">
      <div className="section-title">
        <h2>Choose Your Consultation Package</h2>
        <p>Select the plan that best fits your healthcare needs</p>
      </div>
      
      <div className="container-consultation">
        <section className="plans-section">
          <div className="plan-card">
            <h3>Basic Package</h3>
            <div className="plan-price">₹999<span>/month</span></div>
            <div className="consultation-count">7 Consultations</div>
            <ul className="plan-features">
              <li>Basic health consultation</li>
              <li>Email support</li>
              <li>Digital prescription</li>
              <li>Valid for 30 days</li>
            </ul>
            <a href="/bookappointment" className="plan-btn">Book Now</a>
          </div>
          
          <div className="plan-card">
            <h3>Standard Package</h3>
            <div className="plan-price">₹1799<span>/month</span></div>
            <div className="consultation-count">17 Consultations</div>
            <ul className="plan-features">
              <li>Detailed health consultation</li>
              <li>Priority email & chat support</li>
              <li>Digital prescription</li>
              <li>Follow-up sessions</li>
              <li>Valid for 60 days</li>
            </ul>
            <a href="/bookappointment" className="plan-btn">Book Now</a>
          </div>
          
          <div className="plan-card">
            <h3>Premium Package</h3>
            <div className="plan-price">₹2799<span>/month</span></div>
            <div className="consultation-count">27 Consultations</div>
            <ul className="plan-features">
              <li>Comprehensive health consultation</li>
              <li>24/7 priority support</li>
              <li>Digital prescription</li>
              <li>Unlimited follow-ups</li>
              <li>Health tracking</li>
              <li>Valid for 90 days</li>
            </ul>
            <a href="/bookappointment" className="plan-btn">Book Now</a>
          </div>
        </section>
      </div>
    </div>
    
    <Footer />
  </div>
);

export default ConsultationPage;