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
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginRegister />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/diet" element={<DietTracking />} />
            <Route path="/period" element={<PeriodTracker />} />
            <Route path="/aboutusafter" element={<AboutUsAfter />} />
            <Route path="/personaldetails" element={<PersonalDetailsForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/blogafter" element={<Blogafter />} />
            <Route path="/navbarafter" element={<Navbarafter />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
export default App;