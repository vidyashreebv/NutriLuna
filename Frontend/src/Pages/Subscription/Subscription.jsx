import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSubscription } from '../../context/SubscriptionContext';
import { auth } from '../../config/firebase';
import './Subscription.css';

const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 999,
    totalConsultations: 3,
    duration: '1 month',
    features: [
      '3 Consultations with Nutritionists',
      'Basic Diet Planning',
      'Email Support',
      'Valid for 30 days'
    ]
  },
  {
    id: 'standard',
    name: 'Standard Plan',
    price: 1999,
    totalConsultations: 6,
    duration: '2 months',
    features: [
      '6 Consultations with Nutritionists',
      'Detailed Diet Planning',
      'Priority Email & Chat Support',
      'Valid for 60 days',
      'Monthly Progress Tracking'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 2999,
    totalConsultations: 10,
    duration: '3 months',
    features: [
      '10 Consultations with Nutritionists',
      'Comprehensive Diet Planning',
      '24/7 Priority Support',
      'Valid for 90 days',
      'Weekly Progress Tracking',
      'Personalized Meal Plans'
    ]
  }
];

const Subscription = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subscription, updateSubscription } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const isUpgrade = new URLSearchParams(location.search).get('upgrade') === 'true';

  useEffect(() => {
    if (subscription && !isUpgrade) {
      navigate('/book-appointment');
    }
  }, [subscription, isUpgrade, navigate]);

  const handleSubscribe = async (plan) => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      // Here you would typically integrate with a payment gateway
      // For now, we'll just update the subscription
      await updateSubscription({
        planId: plan.id,
        planName: plan.name,
        totalConsultations: plan.totalConsultations,
        duration: plan.duration,
        purchaseDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toISOString() // 30 days from now
      });

      navigate('/book-appointment');
    } catch (error) {
      console.error('Subscription error:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscription-page">
      <div className="subscription-header">
        <h1>{isUpgrade ? 'Upgrade Your Plan' : 'Choose Your Plan'}</h1>
        <p>Select the perfect consultation package for your needs</p>
      </div>

      <div className="subscription-plans">
        {subscriptionPlans.map((plan) => (
          <div 
            key={plan.id} 
            className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <div className="plan-header">
              <h3>{plan.name}</h3>
              <div className="plan-price">
                <span>₹</span>{plan.price}
                <span className="duration">/{plan.duration}</span>
              </div>
            </div>

            <div className="plan-features">
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <button 
              className="subscribe-btn"
              onClick={() => handleSubscribe(plan)}
              disabled={loading}
            >
              {loading ? 'Processing...' : isUpgrade ? 'Upgrade Now' : 'Subscribe Now'}
            </button>
          </div>
        ))}
      </div>

      {subscription && isUpgrade && (
        <div className="current-plan">
          <h3>Your Current Plan</h3>
          <p>Plan: {subscription.planName}</p>
          <p>Consultations Left: {subscription.consultationsLeft}</p>
        </div>
      )}
    </div>
  );
};

export default Subscription; 