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
  const { subscription, loading, updateSubscription } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (subscription && subscription.remainingConsultations > 0) {
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

      setIsLoading(true);
      const plan = plans[planType];
      const success = await updateSubscription({
        planId: planType,
        price: plan.amount,
        totalConsultations: plan.consultationCount,
        duration: plan.validityDays === 30 ? '1 month' : 
                 plan.validityDays === 60 ? '2 months' : '3 months'
      });

      if (success) {
        toast.success('Subscription purchased successfully!');
        navigate('/book-appointment');
      } else {
        toast.error('Failed to purchase subscription');
      }
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      toast.error('Failed to purchase subscription. Please try again.');
    } finally {
      setIsLoading(false);
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
          <h2>
            {subscription?.remainingConsultations <= 0 
              ? 'Upgrade Your Plan' 
              : 'Choose Your Consultation Package'}
          </h2>
          <p>
            {subscription?.remainingConsultations <= 0 
              ? 'You have used all your consultations. Choose a new plan to continue.' 
              : 'Select the plan that best fits your healthcare needs'}
          </p>
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
              <button 
                onClick={() => handleSubscription('basic')} 
                className="plan-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Subscribe Now'}
              </button>
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
              <button 
                onClick={() => handleSubscription('standard')} 
                className="plan-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Subscribe Now'}
              </button>
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
              <button 
                onClick={() => handleSubscription('premium')} 
                className="plan-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ConsultationPage;

