import React, { useState, useEffect } from "react";
import "./periodTracker.css";

function PeriodTracker() {
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState("");
  const [periodDuration, setPeriodDuration] = useState("");
  const [output, setOutput] = useState("");
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [days, setDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    generateCalendar(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const generateCalendar = (year, month) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const newDays = [];

    // Add days of the week headers
    daysOfWeek.forEach((day) => {
      newDays.push({ type: "header", label: day });
    });

    // Empty slots before first day
    for (let i = 0; i < firstDayOfWeek; i++) {
      newDays.push({ type: "empty" });
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      newDays.push({ type: "day", label: day });
    }

    setDays(newDays);
  };

  const handleMonthChange = (offset) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const openModal = (day) => {
    setSelectedDate(`${monthNames[currentMonth]} ${day}, ${currentYear}`);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const displayCalendar = () => {
    if (!lastPeriod || isNaN(cycleLength) || isNaN(periodDuration)) {
      setOutput("Please provide valid inputs for all fields.");
      return;
    }

    const lastPeriodDate = new Date(lastPeriod);
    const nextPeriodDate = new Date(lastPeriodDate);
    nextPeriodDate.setDate(lastPeriodDate.getDate() + parseInt(cycleLength));

    const options = { year: "numeric", month: "long", day: "numeric" };
    setOutput(`Your next period is expected around: ${nextPeriodDate.toLocaleDateString(undefined, options)}`);
    generateCalendar(currentYear, currentMonth);
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Navigation Bar */}
      <div className="indicator"></div>
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="svg-container">
            <img src="Menstrual Cycle.svg" alt="Menstrual Cycle" height="40px" className="logo" />
          </div>
          <div className="brand-name">NutriLuna</div>
        </div>
        <div className="nav-options">
          <a href="indexafterlogin.html" className="nav-item">Home</a>
          <a href="aboutafterlogin.html" className="nav-item">About</a>
          <a href="blogafterlogin.html" className="nav-item">Blog</a>
          <a href="period-tracker.html" className="nav-item active">Track Your Periods</a>
          <a href="diet-tracking.html" className="nav-item">Diet Tracking</a>
          <a href="recipe-suggestions.html" className="nav-item">Recipe Suggestions</a>
          <a href="consultation.html" className="nav-item">Consultation</a>
          <a href="dashboard.html" className="nav-item">My Profile</a>
          <a href="index.html" className="nav-item sign-out">
            <div className="svg-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
                <path d="M24 4A10 10 0 1024 24 10 10 0 1024 4zM36.021 28H11.979C9.785 28 8 29.785 8 31.979V33.5c0 3.312 1.885 6.176 5.307 8.063C16.154 43.135 19.952 44 24 44c7.706 0 16-3.286 16-10.5v-1.521C40 29.785 38.215 28 36.021 28z"></path>
              </svg>
              Sign Out
            </div>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center py-16" style={{ marginTop: "50px" }}>
        <div className="w-webkit-fill-available  mx-auto p-6 pt-10 pb-8 pl-8 pr-8 my-8 bg-white rounded-lg shadow-lg" style={{ paddingBottom: "40px" }}>
        <h1 className="text-3xl text-center font-semibold text-teal-600 mb-8" style={{ paddingTop: "30px", paddingBottom: "30px" }}>Track Your Periods</h1>

          <div className="space-y-4" >
            <input
              type="date"
              id="last-period"
              className="w-webkit-fill-available p-3 mx-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
            />
            <label htmlFor="cycle-length" className="block text-teal-500">Cycle Length (in days):</label>
            <input
              type="number"
              id="cycle-length"
              className="w-webkit-fill-available p-3 mx-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              placeholder="e.g., 28"
            />

            <label htmlFor="period-duration" className="block text-teal-500">Period Duration (in days):</label>
            <input
              type="number"
              id="period-duration"
              className="w-webkit-fill-available p-3 mx-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={periodDuration}
              onChange={(e) => setPeriodDuration(e.target.value)}
              placeholder="e.g., 5"
            />

            <button
              className="w-webkit-fill-available p-3 mx-4 bg-teal-600 text-white p-3 rounded-md hover:bg-teal-500"
              onClick={displayCalendar}
            >
              Show Calendar
            </button>

            <div className="output-box mt-4 text-teal-600 font-semibold w-webkit-fill-available p-3 mx-4" id="output">{output}</div>

            <div className="calendar-header mt-6 flex justify-between items-center ">
              <button
                className="text-teal-600 font-semibold text-lg w-webkit-fill-available p-3 mx-4"
                onClick={() => handleMonthChange(-1)}
              >
                Previous
              </button>
              <h2 className="text-teal-600 text-xl font-semibold w-webkit-fill-available p-3 mx-4">{monthNames[currentMonth]} {currentYear}</h2>
              <button
                className="text-teal-600 font-semibold text-lg"
                onClick={() => handleMonthChange(1)}
              >
                Next
              </button>
            </div>

            <div className="calendar mt-6 grid grid-cols-7 gap-2 ">
              {days.map((day, index) => (
                day.type === "empty" ? (
                  <div key={index}></div>
                ) : day.type === "header" ? (
                  <div key={index} className="text-center font-semibold text-teal-600">{day.label}</div>
                ) : (
                  <div
                    key={index}
                    className="text-center py-2 border cursor-pointer hover:bg-teal-100"
                    onClick={() => openModal(day.label)}
                  >
                    {day.label}
                  </div>
                )
              ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="modal-overlay absolute inset-0 bg-black opacity-50"></div>
                <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded-lg shadow-lg z-50 overflow-y-auto">
                  <div className="modal-content py-4 text-left px-6">
                    <div className="flex justify-between items-center pb-3">
                      <p className="text-2xl font-bold">Selected Date</p>
                      <button onClick={closeModal} className="modal-close px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring">✕</button>
                    </div>
                    <div className="text-xl font-semibold">{selectedDate}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PeriodTracker;
