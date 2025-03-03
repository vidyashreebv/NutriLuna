import React, { useState, useEffect } from 'react';
import './Consultation.css';
import Navbarafter from '../../Components/Navbarafter';
import Footer from '../../Components/Footer';
import consultVideo from '../../assets/consult.mp4';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useSubscription } from '../../context/SubscriptionContext';

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

const plans = {
  basic: {
    type: "basic",
    amount: 999,
    consultationCount: 7,
    validityDays: 30
  },
  standard: {
    type: "standard",
    amount: 1799,
    consultationCount: 17,
    validityDays: 60
  },
  premium: {
    type: "premium",
    amount: 2799,
    consultationCount: 27,
    validityDays: 90
  }
};

const Header = () => (
  <div className="hero-section-consultaion">
    <div className="video-overlay">
      <video autoPlay loop muted className="background-video">
        <source src={consultVideo} type="video/mp4" />
      </video>
    </div>
    <div className="hero-content">
      <h1>Expert Medical Consultation</h1>
      <p>Get personalized healthcare guidance from experienced professionals</p>
      <button onClick={() => document.querySelector('.plans-section').scrollIntoView({ behavior: 'smooth' })} className="cta-button">View Our Plans</button>
    </div>
  </div>
);

const ConsultationPage = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const { subscription, loading } = useSubscription();

  useEffect(() => {
    if (!loading) {
      if (!subscription) {
        // No subscription, redirect to subscription page
        navigate('/subscription');
      } else if (subscription.consultationsLeft <= 0) {
        // No consultations left, show upgrade option
        navigate('/subscription?upgrade=true');
      } else {
        // Has active subscription with consultations, go to booking
        navigate('/book-appointment');
      }
    }
  }, [subscription, loading, navigate]);

  const handleSubscription = async (planType) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please login to purchase a subscription');
        navigate('/login');
        return;
      }

      if (subscription) {
        toast.warning('You already have an active subscription. Please use your remaining consultations or wait for the current subscription to expire.');
        navigate('/book-appointment');
        return;
      }

      const token = await user.getIdToken();
      const plan = plans[planType];

      const response = await fetch('http://localhost:5001/api/consultation/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          packageType: plan.type,
          amount: plan.amount,
          consultationCount: plan.consultationCount,
          validityDays: plan.validityDays
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Subscription purchased successfully!');
        navigate('/book-appointment');
      } else {
        toast.error(data.message || 'Failed to purchase subscription');
      }
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      toast.error('Failed to purchase subscription. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="consultation-wrapper">
        <Navbarafter navItems={navItems} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Checking subscription status...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="consultation-wrapper">
      <Navbarafter navItems={navItems} />
      <Header />
      
      <div className="consultation-main-container">
        <div className="section-title">
          <h2>Choose Your Consultation Package</h2>
          <p>Select the plan that best fits your healthcare needs</p>
          {subscription && subscription.consultationsLeft === 0 && (
            <div className="subscription-status-message">
              Your current subscription has no remaining consultations. 
              Please purchase a new package to continue.
            </div>
          )}
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
              <button onClick={() => handleSubscription('basic')} className="plan-btn">Subscribe Now</button>
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
              <button onClick={() => handleSubscription('standard')} className="plan-btn">Subscribe Now</button>
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
              <button onClick={() => handleSubscription('premium')} className="plan-btn">Subscribe Now</button>
            </div>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ConsultationPage;

