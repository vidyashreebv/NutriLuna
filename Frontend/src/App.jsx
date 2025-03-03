import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';

// Import your components
import LoginRegister from './Pages/LoginRegister/LoginRegister';
import Landing from './Pages/Landing/Landing';
import AboutUs from './Pages/AboutUs/AboutUs';
import Blog from './Pages/Blog/Blog';
import Period from './Pages/Period/Period';
import Diet from './Pages/Diet/Diet';
import Recipe from './Pages/Recipe/Recipe';
import Consultation from './Pages/Consultation/Consultation';
import BookAppointment from './Pages/Consultation/BookAppointment';
import Dashboard from './Pages/Dashboard/Dashboard';

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<LoginRegister />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/period" element={<Period />} />
              <Route path="/diet" element={<Diet />} />
              <Route path="/recipe" element={<Recipe />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/book-appointment" element={<BookAppointment />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </Router>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;