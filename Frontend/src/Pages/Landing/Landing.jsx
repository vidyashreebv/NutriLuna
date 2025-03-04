import React, { useState, useEffect, useCallback } from "react";
import Navbarafter from "../../Components/Navbarafter";
import "./Landing.css";
import one from "../../assets/one.jpg";
import two from "../../assets/2.jpg";
import three from "../../assets/3.jpg";
import four from "../../assets/4.jpg";
import five from "../../assets/5.jpg";
import six from "../../assets/6.jpg";
import { useLoading } from '../../context/LoadingContext';

function Landing() {
  const navItems = [
    { label: 'Home', href: '/', active: true },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Login', href: '/login' }
  ];

  const data = [
    {
      place: "Menstrual Health",
      title: "DOS & DON'TS",
      title2: "MENSTRUAL HEALTH",
      description:
        "<strong>Dos:</strong><ul><li>Stay hydrated and drink plenty of water.</li><li>Maintain a balanced diet rich in iron and vitamins.</li><li>Exercise regularly to alleviate cramps and improve mood.</li><li>Track your menstrual cycle for better health management.</li></ul><strong>Don'ts:</strong><ul><li>Don't skip meals or restrict calories.</li><li>Avoid excessive caffeine and sugar.</li><li>Don't ignore severe pain; consult a healthcare provider.</li><li>Refrain from using harsh soaps or douches.</li></ul>",
      image: one,
    },
    {
      place: "Menstrual Health",
      title: "INTERESTING",
      title2: "FACTS",
      description:
        "<strong>Interesting Facts:</strong><ul><li>Menstrual cycles can vary from 21 to 35 days.</li><li>The average period lasts between 3 to 7 days.</li><li>Hormonal changes during menstruation can affect mood and energy levels.</li><li>Tracking your cycle can help identify health issues early.</li></ul>",
      image: two,
    },
    {
      place: "Menstrual Health",
      title: "MYTHS &",
      title2: "REALITIES",
      description:
        "<strong>Myths:</strong><ul><li>Periods should always be regular. <em>(Reality: Menstrual cycles can vary due to stress, diet, and other factors.)</em></li><li>It's unhealthy to exercise during menstruation. <em>(Reality: Light exercise can actually relieve cramps and improve mood.)</em></li><li>You shouldn't swim during your period. <em>(Reality: With the right hygiene products, swimming is safe and even beneficial!)</em></li></ul><strong>Realities:</strong><ul><li>Menstrual hygiene products should be changed every 4-6 hours to prevent infections.</li><li>It's normal to feel bloated or tired due to hormonal shifts.</li></ul>",
      image: three,
    },
    {
      place: "Menstrual Health",
      title: "SELF-CARE",
      title2: "TIPS",
      description:
        "<strong>Self-Care Tips:</strong><ul><li>Use heat pads or warm baths to ease cramps.</li><li>Practice relaxation techniques like deep breathing or yoga.</li><li>Opt for comfortable clothing and avoid tight waistbands.</li><li>Get plenty of sleep, as rest is essential for managing menstrual symptoms.</li></ul><strong>Mental Wellness:</strong><ul><li>Engage in gentle activities that make you feel happy and relaxed.</li><li>Stay connected with friends and talk openly about your experience.</li><li>Focus on positive affirmations to counter negative mood swings.</li></ul>",
      image: four,
    },
    {
      place: "Menstrual Health",
      title: "NUTRITIONAL",
      title2: "GUIDE",
      description:
        "<strong>Best Foods:</strong><ul><li>Iron-rich foods like spinach, beans, and red meat to replenish blood loss and Foods high in magnesium (such as nuts and seeds) to reduce bloating.</li><li>Ginger tea for nausea and to alleviate period pain.</li></ul><strong>Foods to Avoid:</strong><ul><li>Salty foods that increase bloating.</li><li>Processed sugars that can cause energy spikes and crashes.</li><li>Fatty foods that can worsen cramps.</li></ul>",
      image: five,
    },
    {
      place: "Menstrual Health",
      title: "SIGNALS",
      title2: "TO WATCH",
      description:
        "<strong>Key Signals:</strong><ul><li>Heavy bleeding lasting more than 7 days: <em>This may indicate an underlying issue.</em></li><li>Intense pain that disrupts daily activities: <em>Seek medical advice, as it could signal conditions like endometriosis.</em></li><li>Missed periods without pregnancy: <em>This could be a sign of hormonal imbalance or stress.</em></li><li>Unusual symptoms like dizziness or fainting: <em>Contact a healthcare provider for evaluation.</em></li></ul>",
      image: six,
    }
  ];

  const { showLoader, hideLoader } = useLoading();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        showLoader();
        // Your existing data fetching code
      } finally {
        hideLoader();
      }
    };

    fetchUserData();
  }, [showLoader, hideLoader]);

  const [currentSlide, setCurrentSlide] = useState(0);

  const changeSlide = useCallback((newSlide) => {
    setCurrentSlide(newSlide);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      changeSlide((prev) => (prev + 1) % data.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [changeSlide, data.length]);

  const nextSlide = () => {
    changeSlide((prev) => (prev + 1) % data.length);
  };

  const prevSlide = () => {
    changeSlide((prev) => (prev - 1 + data.length) % data.length);
  };

  return (
    <div className="landing-container">
      <Navbarafter navItems={navItems} />
      <div className="landing-carousel">
        {data.map((slide, index) => (
          <div
            key={index}
            className={`landing-carousel-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="landing-carousel-content">
              <div className="landing-content-place">{slide.place}</div>
              <div className="landing-content-title-1">{slide.title}</div>
              <div className="landing-content-title-2">{slide.title2}</div>
              <div
                className="landing-content-description"
                dangerouslySetInnerHTML={{ __html: slide.description }}
              />
            </div>
          </div>
        ))}
      </div>

      <button className="landing-carousel-prev" onClick={prevSlide}>&#10094;</button>
      <button className="landing-carousel-next" onClick={nextSlide}>&#10095;</button>

      <div className="landing-carousel-dots">
        {data.map((_, index) => (
          <span
            key={index}
            className={`landing-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => changeSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default Landing;