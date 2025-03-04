import React, { useState } from 'react';
import { auth, db } from "../../config/firebase"; // Ensure Firebase is imported
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useLoading } from '../../context/LoadingContext';

import { 
  CalendarIcon, 
  UserIcon, 
  HeartPulseIcon, 
  GlassWaterIcon,
  PillIcon,
  UtensilsCrossedIcon,
  MoonIcon,
  ActivityIcon
} from 'lucide-react';
import './PersonalDetailsForm.css';






const PersonalDetailsForm = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState({
    basicInfo: {
      age: '',
      height: '',
      weight: '',
      bloodType: ''
    },
    lifestyle: {
      exerciseFrequency: '',
      sleepHours: '',
      stressLevel: '',
      occupation: ''
    },
    health: {
      medicalConditions: [],
      medications: '',
      allergies: '',
      vitamins: ''
    },
    diet: {
      dietType: '',
      waterIntake: '',
      caffeineIntake: '',
      supplements: ''
    }
  });

  const sections = ['Basic Information', 'Lifestyle', 'Health', 'Diet & Nutrition'];

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleMultiSelect = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].includes(value)
          ? prev[section][field].filter(item => item !== value)
          : [...prev[section][field], value]
      }
    }));
  };
  const navigate = useNavigate(); // Initialize navigation
  const { showLoader, hideLoader } = useLoading();

  const handleNext = (e) => {
    e.preventDefault(); // Prevent any accidental form submission
  
    if (currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1); // Move to the next section
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      showLoader();
      if (currentSection < sections.length - 1) {
        return; // Prevent submission if not on the last section
      }
  
      const user = auth.currentUser;
  
      if (!user) {
        alert("User not logged in! Please log in first.");
        return;
      }
  
      try {
        const userRef = doc(db, "users", user.uid, "personalDetails", "profile");
        await setDoc(userRef, formData, { merge: true });
  
        console.log("Personal details saved successfully!");
        alert("Personal details saved!");
        navigate("/login")
        
      } catch (error) {
        console.error("Error saving details:", error);
        alert("Failed to save details: " + error.message);
      }
    } finally {
      hideLoader();
    }
  };
  

  

  const renderSection = () => {
    switch(currentSection) {
      case 0:
        return (
          <div className="form-section">
            <div className="form-card">
              <UserIcon className="form-icon" />
              <div className="form-field">
                <label>Age</label>
                <input
                  type="number"
                  value={formData.basicInfo.age}
                  onChange={(e) => handleInputChange('basicInfo', 'age', e.target.value)}
                  placeholder="Enter your age"
                />
              </div>
            </div>

            <div className="form-card">
              <ActivityIcon className="form-icon" />
              <div className="form-field">
                <label>Height (cm)</label>
                <input
                  type="number"
                  value={formData.basicInfo.height}
                  onChange={(e) => handleInputChange('basicInfo', 'height', e.target.value)}
                  placeholder="Enter your height"
                />
              </div>
            </div>

            <div className="form-card">
        <ActivityIcon className="form-icon" />
        <div className="form-field">
          <label>Weight (kg)</label>
          <input
            type="number"
            value={formData.basicInfo.weight}
            onChange={(e) => handleInputChange('basicInfo', 'weight', e.target.value)}
            placeholder="Enter your weight"
          />
        </div>
      </div>

            <div className="form-card">
              <HeartPulseIcon className="form-icon" />
              <div className="form-field">
                <label>Blood Type</label>
                <select
                  value={formData.basicInfo.bloodType}
                  onChange={(e) => handleInputChange('basicInfo', 'bloodType', e.target.value)}
                >
                  <option value="">Select blood type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="form-section">
            <div className="form-card">
              <ActivityIcon className="form-icon" />
              <div className="form-field">
                <label>Exercise Frequency</label>
                <select
                  value={formData.lifestyle.exerciseFrequency}
                  onChange={(e) => handleInputChange('lifestyle', 'exerciseFrequency', e.target.value)}
                >
                  <option value="">Select frequency</option>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light (1-2 days/week)</option>
                  <option value="moderate">Moderate (3-4 days/week)</option>
                  <option value="active">Active (5+ days/week)</option>
                </select>
              </div>
            </div>

            <div className="form-card">
              <MoonIcon className="form-icon" />
              <div className="form-field">
                <label>Sleep Hours</label>
                <input
                  type="number"
                  value={formData.lifestyle.sleepHours}
                  onChange={(e) => handleInputChange('lifestyle', 'sleepHours', e.target.value)}
                  placeholder="Average hours of sleep"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-section">
            <div className="form-card">
              <HeartPulseIcon className="form-icon" />
              <div className="form-field">
                <label>Medical Conditions</label>
                <div className="checkbox-grid">
                  {['Thyroid Issues', 'PCOS', 'Endometriosis', 'Diabetes', 'Anemia'].map(condition => (
                    <label key={condition} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.health.medicalConditions.includes(condition)}
                        onChange={() => handleMultiSelect('health', 'medicalConditions', condition)}
                      />
                      <span>{condition}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-card">
              <PillIcon className="form-icon" />
              <div className="form-field">
                <label>Current Medications</label>
                <textarea
                  value={formData.health.medications}
                  onChange={(e) => handleInputChange('health', 'medications', e.target.value)}
                  placeholder="List your current medications..."
                  rows="3"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-section">
            <div className="form-card">
              <UtensilsCrossedIcon className="form-icon" />
              <div className="form-field">
                <label>Dietary Preferences</label>
                <select
                  value={formData.diet.dietType}
                  onChange={(e) => handleInputChange('diet', 'dietType', e.target.value)}
                >
                  <option value="">Select diet type</option>
                  <option value="omnivore">Omnivore</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="pescatarian">Pescatarian</option>
                  <option value="keto">Keto</option>
                  <option value="paleo">Paleo</option>
                </select>
              </div>
            </div>

            <div className="form-card">
              <GlassWaterIcon className="form-icon" />
              <div className="form-field">
                <label>Daily Water Intake (glasses)</label>
                <input
                  type="number"
                  value={formData.diet.waterIntake}
                  onChange={(e) => handleInputChange('diet', 'waterIntake', e.target.value)}
                  placeholder="Number of glasses per day"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <div className="form-header">
          <h2>Personal Health Profile</h2>
          <p>Help us understand your health better</p>
        </div>

        <div className="progress-container">
          <div className="progress-bar">
            {sections.map((section, index) => (
              <div
                key={section}
                className={`progress-step ${
                  index === currentSection ? 'active' :
                  index < currentSection ? 'completed' : ''
                }`}
              >
                <div className="step-number">
                  {index < currentSection ? '✓' : index + 1}
                </div>
                <div className="step-label">{section}</div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {renderSection()}

          <div className="form-navigation">
  <button
    type="button"
    onClick={() => setCurrentSection(prev => prev - 1)}
    className={`prev-button ${currentSection === 0 ? 'hidden' : ''}`}
  >
    Previous
  </button>

  {currentSection === sections.length - 1 ? (
    <button type="submit" className="next-button">
      Submit
    </button>
  ) : (
    <button type="button" onClick={handleNext} className="next-button">
      Next
    </button>
  )}
</div>

        </form>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;