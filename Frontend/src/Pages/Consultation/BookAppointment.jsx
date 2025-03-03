import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Navbarafter from '../../Components/Navbarafter';
import Footer from '../../Components/Footer';
import './BookAppointment.css';
import { FaCheckCircle, FaClock, FaStar, FaUserMd } from 'react-icons/fa'; // Import icons
import img10 from '../../assets/10.jpg';
import img11 from '../../assets/11.jpg';
import img12 from '../../assets/12.jpg';
import img13 from '../../assets/13.jpg';
import img14 from '../../assets/14.jpg';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';

const navItems = [
    { label: 'Home', href: '/landing' },
    { label: 'About', href: '/aboutusafter' },
    { label: 'Blog', href: '/blogafter' },
    { label: 'Track Your Periods', href: '/period' },
    { label: 'Diet Tracking', href: '/diet' },
    { label: 'Recipe Suggestions', href: '/recipe' },
    { label: 'Consultation', href: '/consultation', active: true },
    { label: 'My Profile', href: '/dashboard' }
];

const carouselItems = [
    {
        image: img10,
        title: "Expert Medical Consultation",
        description: "Connect with our experienced healthcare professionals for personalized care"
    },
    {
        image: img11,
        title: "Personalized Care",
        description: "Get tailored health solutions designed specifically for your unique needs"
    },
    {
        image: img12,
        title: "Quality Healthcare",
        description: "Experience world-class medical services from the comfort of your home"
    },
    {
        image: img13,
        title: "Professional Guidance",
        description: "Receive expert advice from our team of qualified healthcare specialists"
    },
    {
        image: img14,
        title: "Comprehensive Care",
        description: "Complete healthcare solutions for your well-being and peace of mind"
    }
];

const doctors = [
    {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialization: "Reproductive Health Specialist",
        experience: "15+ years experience",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH975ZNsO7A9DcVASROrqHXJPlx0XB5jA3EQ&s",
        available: true,
        rating: 4.9,
        specialty: ["PCOS", "Fertility", "Hormonal Health"]
    },
    {
        id: 2,
        name: "Dr. Emily Chen",
        specialization: "Nutritionist & Women's Health",
        experience: "12+ years experience",
        image: "https://t3.ftcdn.net/jpg/03/13/77/82/360_F_313778250_Y0o5can6MA490Nt7G6p03Zfu5fKmWCIv.jpg",
        available: true,
        rating: 4.8,
        specialty: ["Diet Planning", "Pregnancy Nutrition", "Weight Management"]
    },
    {
        id: 3,
        name: "Dr. Michael Brown",
        specialization: "Clinical Nutritionist",
        experience: "10+ years experience",
        image: "https://t4.ftcdn.net/jpg/02/60/04/09/360_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg",
        available: false,
        rating: 4.7,
        specialty: ["Sports Nutrition", "Holistic Diet", "Gut Health"]
    }
];

const timeSlots = [
    { time: "09:00 AM", popularity: "low" },
    { time: "10:00 AM", popularity: "medium" },
    { time: "11:00 AM", popularity: "high" },
    { time: "02:00 PM", popularity: "medium" },
    { time: "03:00 PM", popularity: "low" },
    { time: "04:00 PM", popularity: "low" }
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
    const [formErrors, setFormErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

    useEffect(() => {
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        const { name, email, date, reason } = formData;
        setIsFormValid(
            name.trim() !== '' &&
            email.trim() !== '' &&
            date.trim() !== '' &&
            reason.trim() !== '' &&
            selectedDoctor !== null &&
            selectedTimeSlot !== null
        );
    }, [formData, selectedDoctor, selectedTimeSlot]);

    const handleDoctorSelect = (doctor) => {
        if (doctor.available) {
            setSelectedDoctor(doctor);
        } else {
            alert("This doctor is currently not available. Please select another doctor.");
        }
    };

    const handleTimeSlotSelect = (slot) => {
        setSelectedTimeSlot(slot.time);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid) {
            setFormErrors({
                name: formData.name.trim() === '' ? 'Name is required' : '',
                email: formData.email.trim() === '' ? 'Email is required' : '',
                date: formData.date.trim() === '' ? 'Date is required' : '',
                reason: formData.reason.trim() === '' ? 'Reason is required' : '',
            });
            return;
        }

        try {
            const auth = getAuth();
            const user = auth.currentUser;
            
            if (!user) {
                toast.error('Please login to book a consultation');
                return;
            }

            const token = await user.getIdToken();

            // First check if user has an active subscription
            const subscriptionResponse = await fetch('http://localhost:5001/api/consultation/my-subscription', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const subscriptionData = await subscriptionResponse.json();

            if (!subscriptionData.success || !subscriptionData.data) {
                toast.error('Please purchase a subscription first');
                return;
            }

            // Book the consultation
            const response = await fetch('http://localhost:5001/api/consultation/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    doctorId: selectedDoctor.id,
                    doctorName: selectedDoctor.name,
                    doctorSpecialization: selectedDoctor.specialization,
                    doctorImage: selectedDoctor.image,
                    appointmentDate: formData.date,
                    timeSlot: selectedTimeSlot,
                    patientName: formData.name,
                    email: formData.email,
                    reason: formData.reason
                })
            });

            const data = await response.json();

            if (data.success) {
                setShowSuccess(true);
                toast.success('Consultation booked successfully!');

                // Reset form after successful booking
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
                    setFormErrors({});
                }, 3000);
            } else {
                toast.error(data.message || 'Failed to book consultation');
            }
        } catch (error) {
            console.error('Error booking consultation:', error);
            toast.error('Failed to book consultation. Please try again.');
        }
    };

    const handleCarouselChange = (index) => {
        setActiveCarouselIndex(index);
    };

    return (
        <div className="book-appointment-wrapper book-appointment-section">
          <div className='navdiv'>
          <Navbarafter navItems={navItems} />
          </div>

            <div className="hero-sectionbooks book3">
                <Carousel
                    showArrows={true}
                    showStatus={false}
                    showThumbs={false}
                    infiniteLoop={true}
                    autoPlay={true}
                    interval={3000}
                    transitionTime={500}
                    swipeable={true}
                    emulateTouch={true}
                    dynamicHeight={false}
                    className="hero-carousel"
                    selectedItem={activeCarouselIndex}
                    onChange={handleCarouselChange}
                    stopOnHover={true}
                >
                    {carouselItems.map((item, index) => (
                        <div 
                            className={`carousel-slide ${activeCarouselIndex === index ? 'selected' : ''}`} 
                            key={index}
                        >
                            <img src={item.image} alt={item.title} />
                            <div className="legend">
                                <h2>{item.title}</h2>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>

            <section className="booking-section">
                <div className="containe">

                    <div>
                        <h2 className="section-title">Book Your Consultation</h2>
                        <p className="section-subtitle">Connect with our expert nutritionists and reproductive health specialists for personalized care</p>
                    </div>

                    <div className="booking-containers">
                        <div className="selection-container">
                            <h3>Choose Your Doctor</h3>
                            <div className="doctors-grid">
                                {doctors.map(doctor => (
                                    <div
                                        key={doctor.id}
                                        className={`doctor-card ${selectedDoctor?.id === doctor.id ? 'selected' : ''} ${!doctor.available ? 'disabled' : ''}`}
                                        onClick={() => handleDoctorSelect(doctor)}
                                    >
                                        <div className="doctor-info">
                                            <img src={doctor.image} alt={doctor.name} className="doctor-avatar" />
                                            <div className="doctor-details">
                                                <div className='doctor-headers' >
                                                    <FaUserMd className="doctor-icon" />
                                                    <h4>{doctor.name} </h4>
                                                </div>
                                                <p>{doctor.specialization}</p>
                                                <p>{doctor.experience}</p>
                                                <div className='doctor-headers2' >
                                                    <FaStar className="star-icon" />
                                                    <p className="doctor-rating">
                                                         {doctor.rating}/5 rating
                                                    </p>
                                                </div>
                                                {!doctor.available && <p className="availability-badge">Currently Unavailable</p>}
                                            </div>
                                        </div>
                                        <div className="doctor-specialties">
                                            {doctor.specialty.map((spec, index) => (
                                                <span key={index} className="specialty-tag">{spec}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="selection-container">
                            <h3>Select Time Slot</h3>
                            <div className="time-slots-grid">
                                {timeSlots.map((slot, index) => (
                                    <div
                                        key={index}
                                        className={`time-slot ${selectedTimeSlot === slot.time ? 'selected' : ''} ${slot.popularity}`}
                                        onClick={() => handleTimeSlotSelect(slot)}
                                    >
                                        <div className='time-s'>
                                            <div>
                                                <FaClock className="clock-icon" />
                                            </div>
                                            <div>
                                                {slot.time} <br />
                                                {slot.popularity === 'high' && <span className="popularity-indicator">Popular</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="time-zone-note">All times are in your local time zone</p>
                        </div>

                        <div className="form-container">
                            <h3>Complete Your Booking</h3>
                            <form className="booking-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className='form-l' htmlFor="name">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="form-control"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.name && <p className="error-message">{formErrors.name}</p>}
                                </div>

                                <div className="form-group">
                                    <label className='form-l' htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="form-control"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.email && <p className="error-message">{formErrors.email}</p>}
                                </div>

                                <div className="form-group">
                                    <label className='form-l' htmlFor="date">Appointment Date</label>
                                    <input
                                        type="date"
                                        id="date"
                                        className="form-control"
                                        required
                                        value={formData.date}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.date && <p className="error-message">{formErrors.date}</p>}
                                </div>

                                <div className="form-group">
                                    <label className='form-l' htmlFor="reason">Reason for Consultation</label>
                                    <textarea
                                        id="reason"
                                        className="form-control"
                                        rows="4"
                                        required
                                        value={formData.reason}
                                        onChange={handleInputChange}
                                    ></textarea>
                                    {formErrors.reason && <p className="error-message">{formErrors.reason}</p>}
                                </div>

                                <button type="submit" className="submit-btn" disabled={!isFormValid}>
                                    Confirm Booking
                                </button>
                            </form>

                            {showSuccess && (
                                <div className="success-message">
                                    <FaCheckCircle className="success-icon" />
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
