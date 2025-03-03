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
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../context/SubscriptionContext';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

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
    const navigate = useNavigate();
    const { subscription, checkSubscriptionStatus, updateSubscription } = useSubscription();
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [bookingDisabled, setBookingDisabled] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        date: '',
        reason: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
    const [remainingConsultations, setRemainingConsultations] = useState(0);
    const auth = getAuth();

    useEffect(() => {
        const verifySubscription = async () => {
            const user = auth.currentUser;
            if (!user) {
                toast.error('Please login first');
                navigate('/login');
                return;
            }

            const hasActiveSubscription = await checkSubscriptionStatus(user.uid);
            if (!hasActiveSubscription) {
                toast.info('Please subscribe to book a consultation');
                navigate('/consultation');
                return;
            }

            if (subscription?.remainingConsultations === 0) {
                toast.info('No consultations remaining. Please upgrade your plan.');
                navigate('/consultation');
                return;
            }
        };

        verifySubscription();
    }, []);

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

    useEffect(() => {
        const fetchRemainingConsultations = async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;

                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const currentSub = userData.currentSubscription;
                    if (currentSub) {
                        setRemainingConsultations(currentSub.remainingConsultations);
                    }
                }
            } catch (error) {
                console.error('Error fetching remaining consultations:', error);
            }
        };

        fetchRemainingConsultations();
    }, [subscription]);

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

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            date: '',
            reason: ''
        });
        setSelectedDoctor(null);
        setSelectedTimeSlot(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const user = auth.currentUser;
            if (!user) {
                toast.error('Please login to book a consultation');
                return;
            }

            // Check subscription status again before booking
            const hasActiveSubscription = await checkSubscriptionStatus(user.uid);
            if (!hasActiveSubscription) {
                toast.info('Please subscribe to book a consultation');
                navigate('/consultation');
                return;
            }

            const token = await user.getIdToken();
            const requestPayload = {
                userId: user.uid,
                doctorId: selectedDoctor.id,
                appointmentDate: formData.date,
                timeSlot: selectedTimeSlot,
                patientDetails: {
                    name: formData.name,
                    email: formData.email,
                    reason: formData.reason
                },
                doctorDetails: {
                    name: selectedDoctor.name,
                    specialization: selectedDoctor.specialization,
                    image: selectedDoctor.image
                }
            };

            const response = await fetch('http://localhost:5001/api/consultation/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestPayload)
            });

            const data = await response.json();

            if (data.success) {
                // Update subscription in context and show success message
                if (subscription) {
                    const newRemainingConsultations = subscription.remainingConsultations - 1;
                    await updateSubscription({
                        ...subscription,
                        remainingConsultations: newRemainingConsultations,
                        isActive: newRemainingConsultations > 0
                    });
                }

                setSuccessMessage('Your consultation has been successfully booked! Our team will contact you via email.');
                setShowSuccess(true);
                toast.success('Consultation booked successfully!');

                // Clear form
                resetForm();

                // If no consultations remaining, redirect after a delay
                if (subscription?.remainingConsultations <= 1) {
                    setTimeout(() => {
                        navigate('/consultation');
                    }, 3000);
                }
            } else {
                throw new Error(data.message || 'Failed to book consultation');
            }
        } catch (error) {
            console.error('Error booking consultation:', error);
            toast.error(error.message || 'Failed to book consultation');
        }
    };

    const handleCarouselChange = (index) => {
        setActiveCarouselIndex(index);
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading booking information...</p>
            </div>
        );
    }

    if (bookingDisabled) {
        return (
            <div className="consultation-limit-message">
                <h3>Consultation Limit Reached</h3>
                <p>You have used all your consultations. Please upgrade your plan to continue booking.</p>
                <button 
                    className="upgrade-btn"
                    onClick={() => navigate('/subscription?upgrade=true')}
                >
                    Upgrade Plan
                </button>
            </div>
        );
    }

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

                        <div className={`form-container ${bookingDisabled ? 'disabled' : ''}`}>
                            {bookingDisabled && (
                                <div className="consultation-limit-message">
                                    <h3>Consultation Limit Reached</h3>
                                    <p>You have used all your consultations. Please upgrade your plan to continue booking.</p>
                                    <button 
                                        className="upgrade-btn"
                                        onClick={() => navigate('/subscription?upgrade=true')}
                                    >
                                        Upgrade Plan
                                    </button>
                                </div>
                            )}

                            <h3>Complete Your Booking</h3>
                            <form className="booking-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className='form-l' htmlFor="name">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className={`form-control ${formErrors.name ? 'error' : ''}`}
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.name && (
                                        <div className="error-message">
                                            <FaExclamationCircle />
                                            {formErrors.name}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className='form-l' htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className={`form-control ${formErrors.email ? 'error' : ''}`}
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.email && (
                                        <div className="error-message">
                                            <FaExclamationCircle />
                                            {formErrors.email}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className='form-l' htmlFor="date">Appointment Date</label>
                                    <input
                                        type="date"
                                        id="date"
                                        className={`form-control ${formErrors.date ? 'error' : ''}`}
                                        value={formData.date}
                                        onChange={handleInputChange}
                                    />
                                    {formErrors.date && (
                                        <div className="error-message">
                                            <FaExclamationCircle />
                                            {formErrors.date}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className='form-l' htmlFor="reason">Reason for Consultation</label>
                                    <textarea
                                        id="reason"
                                        className={`form-control ${formErrors.reason ? 'error' : ''}`}
                                        rows="4"
                                        value={formData.reason}
                                        onChange={handleInputChange}
                                    ></textarea>
                                    {formErrors.reason && (
                                        <div className="error-message">
                                            <FaExclamationCircle />
                                            {formErrors.reason}
                                        </div>
                                    )}
                                </div>

                                <button 
                                    type="submit" 
                                    className="submit-btn" 
                                    disabled={isLoading || !isFormValid || bookingDisabled}
                                >
                                    {isLoading ? 'Booking...' : 'Confirm Booking'}
                                </button>
                            </form>

                            {showSuccess && (
                                <div className="success-message">
                                    <p style={{ color: '#2e7d32', fontSize: '16px', fontWeight: '500' }}>
                                        {successMessage}
                                    </p>
                                    <p className="remaining-consultations" style={{ color: '#1b5e20', fontSize: '14px', fontWeight: 'bold' }}>
                                        Remaining consultations: {remainingConsultations}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </section>

            <Footer />

            

            <style jsx>{`
                .consultation-status {
                    margin-top: 20px;
                    padding: 15px;
                    background-color: #f5f5f5;
                    border-radius: 8px;
                    text-align: center;
                }

                .consultation-status p {
                    font-size: 16px;
                    color: #333;
                    margin-bottom: 10px;
                }

                .upgrade-button {
                    background-color:rgb(8, 155, 13);
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                }

                .upgrade-button:hover {
                    background-color: #45a049;
                }

                .success-message {
                    background-color: #e8f5e9;
                    border: 1px solid #a5d6a7;
                    border-radius: 8px;
                    padding: 15px 20px;
                    margin: 20px 0;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }

                .success-message p {
                    margin: 8px 0;
                }
            `}</style>
        </div>
    );
};

export default BookAppointment;
