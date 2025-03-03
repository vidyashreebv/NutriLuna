import React, { useState, useEffect } from 'react';
import './Consultation.css';
import Navbarafter from '../../Components/Navbarafter';
import Footer from '../../Components/Footer';
import consultVideo from '../../assets/consult.mp4';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import { db } from '../../config/firebase';
import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';

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
    consultationCount: 3,
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
  const { subscription, updateSubscription, checkSubscriptionStatus } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const checkAndRedirect = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const currentSub = userData.currentSubscription;

          if (currentSub && 
              new Date(currentSub.endDate) > new Date() && 
              currentSub.remainingConsultations > 0 && 
              currentSub.isActive) {
            navigate('/bookappointment');
          }
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    };

    checkAndRedirect();
  }, [navigate, auth]);

  const getPackageDetails = (packageType) => {
    switch (packageType) {
      case 'basic':
        return {
          name: 'Basic Package',
          consultations: 3,
          validityDays: 30,
          price: 1499
        };
      case 'premium':
        return {
          name: 'Premium Package',
          consultations: 5,
          validityDays: 60,
          price: 2499
        };
      default:
        return null;
    }
  };

  const handleSubscriptionClick = async (packageType) => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('Please login to subscribe');
        navigate('/login');
        return;
      }

      const packageDetails = getPackageDetails(packageType);
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + packageDetails.validityDays);

      const subscriptionData = {
        packageType: packageType,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        remainingConsultations: packageDetails.consultations,
        totalConsultations: packageDetails.consultations,
        price: packageDetails.price,
        isActive: true,
        purchasedAt: serverTimestamp()
      };

      // Update user document with subscription
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        currentSubscription: subscriptionData,
        subscriptionHistory: {
          lastUpdated: serverTimestamp(),
          package: packageType,
          purchaseDate: serverTimestamp()
        }
      });

      // Update subscription context
      await updateSubscription(subscriptionData);

      toast.success('Subscription activated successfully!');
      navigate('/bookappointment');

    } catch (error) {
      console.error('Error in subscription:', error);
      toast.error('Failed to process subscription');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="consultation-wrapper">
        <Navbarafter navItems={navItems} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
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
                onClick={() => handleSubscriptionClick('basic')} 
                className={`plan-btn ${isLoading ? 'loading' : ''}`}
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
                onClick={() => handleSubscriptionClick('standard')} 
                className={`plan-btn ${isLoading ? 'loading' : ''}`}
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
                onClick={() => handleSubscriptionClick('premium')} 
                className={`plan-btn ${isLoading ? 'loading' : ''}`}
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

