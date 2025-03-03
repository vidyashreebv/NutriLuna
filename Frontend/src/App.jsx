import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Dashboard from './Pages/Dashboard/Dashboard';
import LoginRegister from './Pages/LoginRegister/LoginRegister';
import { useAuth } from './context/AuthContext';
import './App.css'
//import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap.bundle.min';
import Landing from './Pages/Landing/Landing';
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

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={currentUser ? <Navigate to="/dashboard" replace /> : <Landing />} 
        />
        <Route 
          path="/login" 
          element={currentUser ? <Navigate to="/dashboard" replace /> : <LoginRegister />} 
        />
        <Route 
          path="/dashboard" 
          element={currentUser ? <Dashboard /> : <Navigate to="/login" replace />} 
        />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/diet" element={<DietTracking />} />
        <Route path="/period" element={<PeriodTracker />} />
        <Route path="/aboutusafter" element={<AboutUsAfter />} />
        <Route path="/personaldetails" element={<PersonalDetailsForm />} />
        <Route path="/blogafter" element={<Blogafter />} />
        <Route path="/navbarafter" element={<Navbarafter />} />
        <Route path="/recipe" element={<RecipeSuggestion2 />} />
        <Route path="/consultation" element={<Consultation />} />
        <Route path="/bookappointment" element={<BookAppointment />} />
      </Routes>
    </Router>
  );
}

export default App;