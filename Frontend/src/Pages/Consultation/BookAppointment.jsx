import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Navbarafter from '../../Components/Navbarafter';
import Footer from '../../Components/Footer';
import './BookAppointment.css';

// Navigation items
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

// Carousel items
const carouselItems = [
  {
    image: "https://img.freepik.com/free-photo/young-female-doctor-white-coat-with-stethoscope-standing-hospital-corridor_1303-21212.jpg",
    title: "Expert Medical Consultation",
    description: "Connect with our experienced healthcare professionals"
  },
  {
    image: "https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg",
    title: "Personalized Care",
    description: "Get tailored health solutions for your unique needs"
  },
  {
    image: "https://img.freepik.com/free-photo/medical-workers-covid-19-vaccination-concept-confident-female-doctor-physician-hospital-pointing-fingers-left-showing-way-smiling-recommend-clinic-service-banner_1258-57360.jpg",
    title: "Quality Healthcare",
    description: "Experience world-class medical services"
  }
];

// Doctor data
const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Reproductive Health Specialist",
    experience: "15+ years experience",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH975ZNsO7A9DcVASROrqHXJPlx0XB5jA3EQ&s"
  },
  {
    id: 2,
    name: "Dr. Emily Chen",
    specialization: "Nutritionist & Women's Health",
    experience: "12+ years experience",
    image: "https://t3.ftcdn.net/jpg/03/13/77/82/360_F_313778250_Y0o5can6MA490Nt7G6p03Zfu5fKmWCIv.jpg"
  },
  {
    id: 3,
    name: "Dr. Michael Brown",
    specialization: "Clinical Nutritionist",
    experience: "10+ years experience",
    image: "https://t4.ftcdn.net/jpg/02/60/04/09/360_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg"
  }
];

// Time slots
const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"
];

const BookAppointment = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    reason: ''
  });

  // Set minimum date to today
  useEffect(() => {
    const dateInput = document.getElementById('date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }
  }, []);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedDoctor || !selectedTimeSlot) {
      alert("Please select a doctor and time slot");
      return;
    }
    
    // Show success message
    setShowSuccess(true);
    
    // Reset form after showing success message
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedDoctor(null);
      setSelectedTimeSlot(null);
      setFormData({
        name: '',
        email: '',
        date: '',
        reason: ''
      });
    }, 3000);
  };

  return (
    <div className="book-appointment-wrapper">
      <Navbarafter navItems={navItems} />
      
      {/* Auto-playing Carousel Section */}
      <section className="hero-section">
        <Carousel
          showArrows={true}
          showStatus={false}
          showThumbs={false}
          infiniteLoop={true}
          autoPlay={true}
          interval={3000}
          className="hero-carousel"
        >
          {carouselItems.map((item, index) => (
            <div className="carousel-slide" key={index}>
              <img src={item.image} alt={item.title} />
              <div className="legend">
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Booking Form Section */}
      <section className="booking-section">
        <div className="container">
          <h2 className="section-title">Book Your Consultation</h2>
          <p className="section-subtitle">Connect with our expert nutritionists and reproductive health specialists</p>
          
          <div className="booking-container">
            {/* Doctor Selection */}
            <div className="selection-container">
              <h3>Choose Your Doctor</h3>
              <div className="doctors-grid">
                {doctors.map(doctor => (
                  <div 
                    key={doctor.id} 
                    className={`doctor-card ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    <div className="doctor-info">
                      <img src={doctor.image} alt={doctor.name} className="doctor-avatar" />
                      <div className="doctor-details">
                        <h4>{doctor.name}</h4>
                        <p>{doctor.specialization}</p>
                        <p>{doctor.experience}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Time Slot Selection */}
            <div className="selection-container">
              <h3>Select Time Slot</h3>
              <div className="time-slots-grid">
                {timeSlots.map((slot, index) => (
                  <div 
                    key={index}
                    className={`time-slot ${selectedTimeSlot === slot ? 'selected' : ''}`}
                    onClick={() => handleTimeSlotSelect(slot)}
                  >
                    {slot}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Booking Form */}
            <div className="form-container">
              <h3>Complete Your Booking</h3>
              <form className="booking-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="Full Name"
                    className="form-control" 
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="Email Address"
                    className="form-control" 
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <input 
                    type="date" 
                    id="date" 
                    className="form-control" 
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <textarea
                    id="reason"
                    placeholder="Reason for Consultation"
                    className="form-control"
                    rows="4"
                    required
                    value={formData.reason}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn">
                  Confirm Booking
                </button>
              </form>

              {showSuccess && (
                <div className="success-message">
                  Your consultation has been successfully scheduled! We'll send you a confirmation email shortly.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookAppointment;