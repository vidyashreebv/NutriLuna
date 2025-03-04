import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Dashboard from './Pages/Dashboard/Dashboard';
import LoginRegister from './Pages/LoginRegister/LoginRegister';
import { useAuth } from './context/AuthContext';
import './App.css';
import Landing from './Pages/Landing/Landing';
import Landingafter from './Pages/Landingafter/Landingafter';
import BlogPage from './Pages/Blog/Blog';
import AboutUs from './Pages/Aboutus/Aboutus';
import DietTracking from './Pages/Diettracking/dietTracking';
import PeriodTracker from './Pages/PeriodTracker/PeriodTracker';
import PersonalDetailsForm from './Pages/LoginRegister/PersonalDetailsForm';
import Navbarafter from './Components/Navbarafter';
import AboutUsAfter from './Pages/Aboutusafter/Aboutusafter';
import Blogafter from './Pages/Blogafter/Blogafter';
import RecipeSuggestion2 from './Pages/RecipeSuggestion/RecipeSuggestion2';
import Consultation from './Pages/Consultation/Consultation';
import BookAppointment from './Pages/Consultation/BookAppointment';
import Loading from './Components/Loading';
import PinVerification from './Components/PinVerification/PinVerification';
import axios from 'axios';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';

// Wrapper component to handle PIN verification
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isPinRequired, setIsPinRequired] = useState(false);

  useEffect(() => {
    const checkAuthAndPinStatus = async () => {
      console.log('ProtectedRoute: Starting auth and PIN status check');
      console.log('Current User:', currentUser);
      console.log('Current Path:', location.pathname);
      
      // If no current user, redirect to login
      if (!currentUser) {
        console.log('ProtectedRoute: No current user, redirecting to login');
        navigate('/login');
        setIsLoading(false);
        return;
      }

      try {
        // Skip PIN check for login and root pages
        if (['/login', '/'].includes(location.pathname)) {
          console.log('ProtectedRoute: On login/root page, skipping PIN check');
          setIsLoading(false);
          return;
        }

        // Explicitly get token with error handling
        let token;
        try {
          token = await currentUser.getIdToken(true);
          console.log('Token retrieved successfully:', !!token);
        } catch (tokenError) {
          console.error('Error retrieving token:', tokenError);
          navigate('/login');
          setIsLoading(false);
          return;
        }

        if (!token) {
          console.error('No token available');
          navigate('/login');
          setIsLoading(false);
          return;
        }

        // Check PIN status with explicit error handling
        let response;
        try {
          response = await axios.get('http://localhost:5001/api/pin/status', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          console.log('PIN status response:', response.data);
        } catch (apiError) {
          console.error('API call error:', apiError.response ? apiError.response.data : apiError.message);
          
          // If unauthorized, force logout
          if (apiError.response && apiError.response.status === 401) {
            console.log('Unauthorized: Logging out');
            navigate('/login');
            setIsLoading(false);
            return;
          }
        }

        // Proceed with PIN verification logic only if we have a valid response
        if (response && response.data) {
          const isPinSet = response.data.isPinSet;
          
          // Always check PIN verification with a time-based approach
          const lastPinVerificationTime = localStorage.getItem('lastPinVerificationTime');
          const currentTime = Date.now();
          const PIN_VERIFICATION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

          console.log('PIN Set:', isPinSet);
          console.log('Last PIN Verification Time:', lastPinVerificationTime);
          console.log('Current Time:', currentTime);

          // Determine if we need to show PIN verification
          const shouldShowPinVerification = isPinSet && (
            !lastPinVerificationTime || 
            (currentTime - parseInt(lastPinVerificationTime) > PIN_VERIFICATION_EXPIRY)
          );

          // Additional check to prevent repeated verifications
          const lastPinVerificationPath = localStorage.getItem('lastPinVerificationPath');
          const isNewPath = lastPinVerificationPath !== location.pathname;

          console.log('Should Show PIN Verification:', shouldShowPinVerification);
          console.log('Is New Path:', isNewPath);

          if (shouldShowPinVerification && isNewPath) {
            console.log('ProtectedRoute: PIN is set, FORCING verification');
            localStorage.setItem('intendedPath', location.pathname);
            localStorage.setItem('lastPinVerificationPath', location.pathname);
            localStorage.removeItem('pinVerified');
            setIsPinRequired(true);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('ProtectedRoute: Unexpected error', error);
        navigate('/login');
        setIsLoading(false);
      }
    };

    // Only run check if we have a current user
    if (currentUser) {
      checkAuthAndPinStatus();
    } else {
      setIsLoading(false);
    }
  }, [currentUser, location.pathname, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  if (isPinRequired) {
    console.log('RENDERING PIN VERIFICATION PAGE');
    return <PinVerification onVerify={() => {
      console.log('ProtectedRoute: PIN verified');
      setIsPinRequired(false);
      localStorage.setItem('pinVerified', 'true');
      localStorage.setItem('lastPinVerificationTime', Date.now().toString());
      const intendedPath = localStorage.getItem('intendedPath') || '/landing';
      navigate(intendedPath);
    }} />;
  }

  return children;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      // Clear PIN verification on logout
      if (!user) {
        localStorage.removeItem('pinVerified');
        localStorage.removeItem('intendedPath');
      }
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthProvider>
      <SubscriptionProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={currentUser ? <Navigate to="/landing" replace /> : <LoginRegister />} 
            />
            <Route 
              path="/" 
              element={currentUser ? <Navigate to="/landing" replace /> : <Landing />} 
            />

            {/* Protected routes */}
            <Route 
              path="/landing" 
              element={
                <ProtectedRoute>
                  {currentUser ? <Landingafter /> : <Navigate to="/login" replace />}
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  {currentUser ? <Dashboard /> : <Navigate to="/login" replace />}
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/about" 
              element={
                <ProtectedRoute>
                  <AboutUs />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/blog" 
              element={
                <ProtectedRoute>
                  <BlogPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/diet" 
              element={
                <ProtectedRoute>
                  <DietTracking />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/period" 
              element={
                <ProtectedRoute>
                  <PeriodTracker />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/aboutusafter" 
              element={
                <ProtectedRoute>
                  <AboutUsAfter />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/personaldetails" 
              element={
                <ProtectedRoute>
                  <PersonalDetailsForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/blogafter" 
              element={
                <ProtectedRoute>
                  <Blogafter />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/navbarafter" 
              element={
                <ProtectedRoute>
                  <Navbarafter />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/recipe" 
              element={
                <ProtectedRoute>
                  <RecipeSuggestion2 />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/consultation" 
              element={
                <ProtectedRoute>
                  <Consultation />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/bookappointment" 
              element={
                <ProtectedRoute>
                  <BookAppointment />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;