import React from 'react';
import './App.css'
//import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginRegister from './Pages/LoginRegister/LoginRegister'
import Landing from './Pages/Landing/Landing';
import BlogPage from './Pages/Blog/Blog';
import AboutUs from './Pages/Aboutus/Aboutus';
import DietTracking from './Pages/Diettracking/dietTracking';
import PeriodTracker from './Pages/periodTracker/periodTracker';
import PersonalDetailsForm from './Pages/LoginRegister/PersonalDetailsForm';
function App() {
  return (
    
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginRegister/>} />
          <Route path="/landing" element={<Landing/>} />
          <Route path="/about" element={<AboutUs/>} />
          <Route path="/blog" element={<BlogPage/>} />
          <Route path="/diet" element={<DietTracking/>} />
          <Route path="/periodtracker" element={<PeriodTracker/>} />
          <Route path="/personaldetails" element={<PersonalDetailsForm/>} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;