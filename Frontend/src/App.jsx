import React from 'react';
import { AuthProvider } from './context/AuthContext';
import './App.css'
//import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginRegister from './Pages/LoginRegister/LoginRegister'
import Landing from './Pages/Landing/Landing';
import BlogPage from './Pages/Blog/Blog';
import AboutUs from './Pages/Aboutus/Aboutus';
import DietTracking from './Pages/Diettracking/dietTracking';
import PeriodTracker from './Pages/PeriodTracker/PeriodTracker';
import PersonalDetailsForm from './Pages/LoginRegister/PersonalDetailsForm';
import Navbarafter from './Components/Navbarafter';
import AboutUsAfter from './Pages/Aboutusafter/Aboutusafter';
import Dashboard from './Pages/Dashboard/Dashboard';
import Blogafter from './Pages/Blogafter/Blogafter';
import RecipeSuggestion2 from './Pages/RecipeSuggestion/RecipeSuggestion2';
import Consultation from './Pages/Consultation/Consultation';
import BookAppointment from './Pages/Consultation/BookAppointment';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SubscriptionProvider } from './context/SubscriptionContext';
import Subscription from './Pages/Subscription/Subscription';

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<LoginRegister />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/diet" element={<DietTracking />} />
              <Route path="/period" element={<PeriodTracker />} />
              <Route path="/aboutusafter" element={<AboutUsAfter />} />
              <Route path="/personaldetails" element={<PersonalDetailsForm />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/blogafter" element={<Blogafter />} />
              <Route path="/navbarafter" element={<Navbarafter />} />
              <Route path="/recipe" element={<RecipeSuggestion2 />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/book-appointment" element={<BookAppointment />} />
              <Route path="/subscription" element={<Subscription />} />
            </Routes>
          </div>
        </Router>
      </SubscriptionProvider>
    </AuthProvider>
  );
}
export default App;