import React, { useState } from "react";
import "./periodTracker.css";

function PeriodTracker() {
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState("");
  const [periodDuration, setPeriodDuration] = useState("");
  const [output, setOutput] = useState("");
  const [calendarHTML, setCalendarHTML] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const displayCalendar = () => {
    if (!lastPeriod || isNaN(cycleLength) || isNaN(periodDuration)) {
      setOutput("Please provide valid inputs for all fields.");
      setCalendarHTML("");
      return;
    }

    const lastPeriodDate = new Date(lastPeriod);
    const nextPeriodDate = new Date(lastPeriodDate);
    nextPeriodDate.setDate(lastPeriodDate.getDate() + parseInt(cycleLength));

    const options = { year: "numeric", month: "long", day: "numeric" };
    setOutput(`Your next period is expected around: ${nextPeriodDate.toLocaleDateString(undefined, options)}`);

    generateCalendar(currentMonth, currentYear, lastPeriodDate, parseInt(periodDuration), nextPeriodDate);
  };

  const generateCalendar = (month, year, lastPeriodDate, periodDuration, nextPeriodDate) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    document.getElementById("month-year").textContent = `${new Date(year, month).toLocaleString("default", { month: "long" })} ${year}`;

    let calendarHTML = "";
    for (let i = 0; i < firstDay; i++) {
      calendarHTML += '<div class="day"></div>';
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      let dayClass = "day";

      if (currentDate >= lastPeriodDate && currentDate < new Date(lastPeriodDate.getTime() + periodDuration * 24 * 60 * 60 * 1000)) {
        dayClass += " period";
      } else if (currentDate >= nextPeriodDate && currentDate < new Date(nextPeriodDate.getTime() + periodDuration * 24 * 60 * 60 * 1000)) {
        dayClass += " next-period";
      }

      calendarHTML += `<div class="${dayClass}">${i}</div>`;
    }

    setCalendarHTML(calendarHTML);
  };

  const changeMonth = (offset) => {
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
    displayCalendar();
  };

  return (
    <div>
      <div className="indicator"></div>
      <nav>
        <div>
          <div className="svg-container">
            <img src="Menstrual Cycle.svg" alt="" height="40px" />
          </div>
          <div>NutriLuna</div>
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
          <a href="index.html" className="nav-item">
            <div className="svg-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
                <path d="M24 4A10 10 0 1024 24 10 10 0 1024 4zM36.021 28H11.979C9.785 28 8 29.785 8 31.979V33.5c0 3.312 1.885 6.176 5.307 8.063C16.154 43.135 19.952 44 24 44c7.706 0 16-3.286 16-10.5v-1.521C40 29.785 38.215 28 36.021 28z"></path>
              </svg>
              Sign Out
            </div>
          </a>
        </div>
      </nav>
      <div className="container">
        <h1>Track Your Periods</h1>
        <label htmlFor="last-period">Last Period Date:</label>
        <input type="date" id="last-period" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)} />

        <label htmlFor="cycle-length">Cycle Length (in days):</label>
        <input type="number" id="cycle-length" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)} placeholder="e.g., 28" />

        <label htmlFor="period-duration">Period Duration (in days):</label>
        <input type="number" id="period-duration" value={periodDuration} onChange={(e) => setPeriodDuration(e.target.value)} placeholder="e.g., 5" />

        <button onClick={displayCalendar}>Show Calendar</button>

        <div className="output" id="output">{output}</div>

        <div className="calendar-header">
          <button onClick={() => changeMonth(-1)}>Previous</button>
          <h2 id="month-year"></h2>
          <button onClick={() => changeMonth(1)}>Next</button>
        </div>

        <div id="calendar-container" className="calendar" dangerouslySetInnerHTML={{ __html: calendarHTML }}></div>
      </div>
    </div>
  );
}

export default PeriodTracker;
