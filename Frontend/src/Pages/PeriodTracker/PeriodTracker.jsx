import React, { useState, useEffect } from "react";
import "./PeriodTracker.css";
import { auth } from "../../config/firebaseConfig";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function PeriodTracker() {
    const [lastPeriod, setLastPeriod] = useState("");
    const [cycleLength, setCycleLength] = useState("");
    const [periodDuration, setPeriodDuration] = useState("");
    const [output, setOutput] = useState("");
    const [calendarHTML, setCalendarHTML] = useState("");
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [user, setUser] = useState(null);
    const [monthYearText, setMonthYearText] = useState("");
    const [allPeriods, setAllPeriods] = useState([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log("Auth State Changed:", currentUser);
            if (currentUser) {
                setUser(currentUser);
                fetchPeriodData(currentUser);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    // Update calendar whenever allPeriods changes
    useEffect(() => {
        if (lastPeriod && cycleLength && periodDuration) {
            displayCalendar();
        }
    }, [allPeriods, currentMonth, currentYear]);

    const fetchPeriodData = async (currentUser) => {
        if (!currentUser) return;

        try {
            const token = await auth.currentUser.getIdToken(true);
            const response = await fetch("http://localhost:5001/api/period/getPeriodData", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const responseText = await response.text();

            try {
                const data = JSON.parse(responseText);
                console.log("✅ Fetched Data:", data);

                // Update the form fields
                setLastPeriod(data.lastPeriod || "");
                setCycleLength(data.cycleLength || "");
                setPeriodDuration(data.periodDuration || "");

                // Update the periods history
                if (data.periodsHistory && Array.isArray(data.periodsHistory)) {
                    setAllPeriods(data.periodsHistory);
                }
            } catch (jsonError) {
                console.error("❌ JSON Parsing Error:", jsonError.message);
                throw new Error("Received non-JSON response from server");
            }
        } catch (error) {
            console.error("❌ Error fetching period data:", error);
        }
    };

    const generateCalendar = (month, year, lastPeriodDate, periodDuration, nextPeriodDate) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        setMonthYearText(`${new Date(year, month).toLocaleString("default", { month: "long" })} ${year}`);

        const calendarDays = [];

        // Add empty cells for days before the first of the month
        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(<div className="day empty" key={`empty-${i}`}></div>);
        }

        // Generate calendar days
        for (let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(year, month, i);
            let dayClass = "day";

            // Check historical periods
            allPeriods.forEach(period => {
                const periodStart = new Date(period.startDate);
                const periodEnd = new Date(periodStart);
                periodEnd.setDate(periodStart.getDate() + parseInt(period.duration));

                if (currentDate >= periodStart && currentDate <= periodEnd) {
                    dayClass += " period-day"; // Past periods
                }
            });

            // Check predicted next period
            if (nextPeriodDate && currentDate >= nextPeriodDate &&
                currentDate < new Date(nextPeriodDate.getTime() + periodDuration * 24 * 60 * 60 * 1000)) {
                dayClass += " next-period"; // Predicted period
            }

            calendarDays.push(
                <div className={dayClass} key={i}>
                    {i}
                </div>
            );
        }

        setCalendarHTML(calendarDays);
    };

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

    const savePeriodData = async () => {
        if (!lastPeriod || isNaN(cycleLength) || isNaN(periodDuration)) {
            setOutput("Please provide valid inputs for all fields.");
            return;
        }

        try {
            const token = await auth.currentUser.getIdToken(true);

            // Create a new period entry
            const newPeriod = {
                startDate: lastPeriod,
                duration: parseInt(periodDuration),
                cycleLength: parseInt(cycleLength)
            };

            // Update periods history
            const updatedPeriods = [...allPeriods, newPeriod];

            const response = await fetch("http://localhost:5001/api/period/savePeriodData", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    lastPeriod,
                    cycleLength,
                    periodDuration,
                    periodsHistory: updatedPeriods
                }),
            });

            const result = await response.json();
            if (response.ok) {
                setAllPeriods(updatedPeriods);
                setOutput(result.message);
            } else {
                setOutput(result.error);
            }
        } catch (error) {
            console.error("❌ Error saving period data:", error);
            setOutput("Error saving period data.");
        }
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

    const handleShowCalendar = () => {
        displayCalendar();
        savePeriodData();
    };

    return (
        <div className="period-tracker">
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
            <div className="container">
                <h1 className="title">Track Your Periods</h1>
                <input type="date" className="input-date" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)} />
                <label className="lab-period">Cycle Length (in days):</label>
                <input type="number" className="input-number" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)} placeholder="e.g., 28" />
                <label className="lab-period">Period Duration (in days):</label>
                <input type="number" className="input-number" value={periodDuration} onChange={(e) => setPeriodDuration(e.target.value)} placeholder="e.g., 5" />
                <button className="btn-show-calendar" onClick={() => handleShowCalendar()}>Show Calendar</button>
                <div className="output-box">{output}</div>
                <div className="calendar-header flex items-center">
                    <button className="btn-prev" onClick={() => changeMonth(-1)}>Previous</button>
                    <h3 className="month-year">{monthYearText}</h3>
                    <button className="btn-next" onClick={() => changeMonth(1)}>Next</button>
                </div>
                <div className="calendar">{calendarHTML}</div>
            </div>
        </div>
    );
}

export default PeriodTracker;