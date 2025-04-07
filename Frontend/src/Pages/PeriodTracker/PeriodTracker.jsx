import React, { useState, useEffect } from "react";
import "./PeriodTracker.css";
import { auth } from "../../config/firebaseConfig";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Navbarafter from "../../Components/Navbarafter";
import Footer from "../../Components/Footer";
import { useLoading } from '../../context/LoadingContext';
import axiosInstance from '../../config/axios';

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
    const [periodData, setPeriodData] = useState(null);
    const [editingPeriod, setEditingPeriod] = useState(null);
    const { showLoader, hideLoader } = useLoading();

    const navItems = [
        { label: 'Home', href: '/landing' },
        { label: 'About', href: '/aboutusafter' },
        { label: 'Blog', href: '/blogafter' },
        { label: 'Track Your Periods', href: '/period', active: true },
        { label: 'Diet Tracking', href: '/diet' },
        { label: 'Recipe Suggestions', href: '/recipe' },
        { label: 'Consultation', href: '/consultation' },
        { label: 'My Profile', href: '/dashboard' }
    ];

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
        try {
            showLoader();
            const response = await axiosInstance.get(`/api/period/getPeriodData`);
            if (response.data) {
                setPeriodData(response.data);
                setAllPeriods(response.data.periods || []);
                if (response.data.periods && response.data.periods.length > 0) {
                    const mostRecent = getMostRecentPeriod();
                    if (mostRecent) {
                        setLastPeriod(mostRecent.startDate);
                        setCycleLength(mostRecent.cycleLength);
                        setPeriodDuration(mostRecent.duration);
                    }
                }
            }
        } catch (error) {
            console.error("❌ Error fetching period data:", error);
        } finally {
            hideLoader();
        }
    };

    // Helper to get the most recent period
    const getMostRecentPeriod = () => {
        if (!allPeriods || allPeriods.length === 0) return null;

        return allPeriods.reduce((latest, current) => {
            const currentDate = new Date(current.startDate);
            const latestDate = new Date(latest.startDate);
            return currentDate > latestDate ? current : latest;
        });
    };

    // Calculate cycle phases based on most recent period
    const calculateCyclePhases = (date) => {
        const mostRecentPeriod = getMostRecentPeriod();
        if (!mostRecentPeriod) return null;

        const startDate = new Date(mostRecentPeriod.startDate);
        const cycleLength = mostRecentPeriod.cycleLength;
        const ovulationDay = Math.floor(cycleLength / 2) - 2;

        return {
            ovulationDate: new Date(startDate.getTime() + (ovulationDay * 24 * 60 * 60 * 1000)),
            fertileWindowStart: new Date(startDate.getTime() + ((ovulationDay - 5) * 24 * 60 * 60 * 1000)),
            fertileWindowEnd: new Date(startDate.getTime() + ((ovulationDay + 4) * 24 * 60 * 60 * 1000))
        };
    };

    // Helper to get the next predicted period
    const getNextPeriod = () => {
        const mostRecentPeriod = getMostRecentPeriod();
        if (!mostRecentPeriod) return null;

        const startDate = new Date(mostRecentPeriod.startDate);
        const cycleLength = mostRecentPeriod.cycleLength;
        const duration = mostRecentPeriod.duration;

        // Calculate next period start date
        const nextPeriodStart = new Date(startDate);
        nextPeriodStart.setDate(startDate.getDate() + parseInt(cycleLength));

        // Calculate next period end date
        const nextPeriodEnd = new Date(nextPeriodStart);
        nextPeriodEnd.setDate(nextPeriodStart.getDate() + parseInt(duration));

        return {
            startDate: nextPeriodStart,
            endDate: nextPeriodEnd,
            duration: duration
        };
    };

    // Update isPeriodDay to include next predicted period
    const isPeriodDay = (date) => {
        // Check logged periods
        if (allPeriods && allPeriods.length > 0) {
            const isLoggedPeriod = allPeriods.some(period => {
                const startDate = new Date(period.startDate);
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + parseInt(period.duration));

                const checkDateObj = new Date(date);
                return checkDateObj >= startDate && checkDateObj <= endDate;
            });

            if (isLoggedPeriod) return true;
        }

        // Check next predicted period
        const nextPeriod = getNextPeriod();
        if (nextPeriod) {
            const checkDate = new Date(date);
            return checkDate >= nextPeriod.startDate && checkDate <= nextPeriod.endDate;
        }

        return false;
    };

    // Update generateCalendar to use the updated isPeriodDay
    const generateCalendar = (month, year) => {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        setMonthYearText(`${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`);

        const calendarDays = [];

        // Add weekday headers
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            calendarDays.push(
                <div key={`header-${day}`} className="weekday">
                    {day}
                </div>
            );
        });

        // Add empty cells for days before the first of the month
        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(
                <div key={`empty-${i}`} className="day empty"></div>
            );
        }

        // Add the days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const cyclePhases = calculateCyclePhases(currentDate);

            let className = "day";
            let emoji = "";
            let label = "";

            // Check if it's a period day (logged or predicted)
            if (isPeriodDay(currentDate)) {
                className += " period-day";
                emoji = "🌺";

                // Add predicted class if it's a predicted period
                const nextPeriod = getNextPeriod();
                if (nextPeriod &&
                    currentDate >= nextPeriod.startDate &&
                    currentDate <= nextPeriod.endDate) {
                    className += " predicted";
                    label = "Predicted Period";
                } else {
                    label = "Period Day";
                }
            }
            // Then check for ovulation and fertile window
            else if (cyclePhases) {
                const dayStr = currentDate.toISOString().split('T')[0];

                if (dayStr === cyclePhases.ovulationDate.toISOString().split('T')[0]) {
                    className += " ovulation-day";
                    emoji = "🥚";
                    label = "Ovulation Day";
                }
                else if (
                    currentDate >= cyclePhases.fertileWindowStart &&
                    currentDate <= cyclePhases.fertileWindowEnd
                ) {
                    className += " fertile-day";
                    emoji = "✨";
                    label = "Fertile Window";
                }
            }

            calendarDays.push(
                <div
                    key={`day-${day}`}
                    className={className}
                    title={label}
                >
                    <div className="day-content">
                        <span className="day-number">{day}</span>
                        {emoji && <span className="day-emoji">{emoji}</span>}
                    </div>
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

        generateCalendar(currentMonth, currentYear);
    };

    const handleEdit = (period) => {
        setEditingPeriod(period);
        setLastPeriod(period.startDate);
        setCycleLength(period.cycleLength.toString());
        setPeriodDuration(period.duration.toString());
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (periodId) => {
        try {
            showLoader();
            await axiosInstance.delete(`/api/period/deletePeriod/${periodId}`);
            setAllPeriods(prevPeriods => prevPeriods.filter(p => p.id !== periodId));
            setPeriodData(prev => ({
                ...prev,
                periods: prev.periods.filter(p => p.id !== periodId)
            }));
        } catch (error) {
            console.error("Error deleting period:", error);
        } finally {
            hideLoader();
        }
    };

    const savePeriodData = async () => {
        try {
            showLoader();
            const newPeriod = {
                startDate: lastPeriod,
                cycleLength: parseInt(cycleLength),
                duration: parseInt(periodDuration)
            };

            const response = await axiosInstance.post('/api/period/savePeriod', newPeriod);
            if (response.data) {
                setAllPeriods(prev => [...prev, response.data]);
                setPeriodData(prev => ({
                    ...prev,
                    periods: [...(prev.periods || []), response.data]
                }));
                setLastPeriod("");
                setCycleLength("");
                setPeriodDuration("");
            }
        } catch (error) {
            console.error("Error saving period data:", error);
        } finally {
            hideLoader();
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

    const calculatePeriodStatus = (lastPeriod, cycleLength) => {
        if (!lastPeriod || !cycleLength) return null;

        const lastPeriodDate = new Date(lastPeriod);
        const today = new Date();
        const nextPeriodDate = new Date(lastPeriodDate);
        nextPeriodDate.setDate(lastPeriodDate.getDate() + parseInt(cycleLength));

        const diffTime = nextPeriodDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return {
                status: 'late',
                days: Math.abs(diffDays),
                nextDate: nextPeriodDate
            };
        } else {
            return {
                status: 'upcoming',
                days: diffDays,
                nextDate: nextPeriodDate
            };
        }
    };

    return (
        <div className="period-tracker">
            <Navbarafter navItems={navItems} />
            <div className="container">
                <h1 className="title" style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                    Period Tracker
                </h1>
                <div className="period-tracker-container">

                    {/* Add Period Status Card */}
                    {periodData && periodData.lastPeriod && (
                        <div className="period-status-section">
                            {(() => {
                                const status = calculatePeriodStatus(
                                    periodData.lastPeriod,
                                    periodData.cycleLength
                                );

                                if (!status) return null;

                                return (
                                    <div className={`period-status-card ${status.status}`}>
                                        <div className="status-icon">
                                            {status.status === 'late' ? '⚠️' : '📅'}
                                        </div>
                                        <div className="status-text">
                                            {status.status === 'late' ? (
                                                <>
                                                    <h3>Period is {status.days} days late</h3>
                                                    <p>Expected date was {status.nextDate.toLocaleDateString()}</p>
                                                </>
                                            ) : (
                                                <>
                                                    <h3>Next period in {status.days} days</h3>
                                                    <p>Expected on {status.nextDate.toLocaleDateString()}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    <input type="date" className="input-date" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)} />
                    <label className="lab-period">Cycle Length (in days):</label>
                    <input type="number" className="input-number" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)} placeholder="e.g., 28" />
                    <label className="lab-period">Period Duration (in days):</label>
                    <input type="number" className="input-number" value={periodDuration} onChange={(e) => setPeriodDuration(e.target.value)} placeholder="e.g., 5" />
                    <button className="btn-show-calendar" onClick={() => handleShowCalendar()}>
                        {editingPeriod ? 'Update Period' : 'Add Period'}
                    </button>
                    {editingPeriod && (
                        <button
                            className="btn-show-calendar"
                            onClick={() => {
                                setEditingPeriod(null);
                                setLastPeriod("");
                                setCycleLength("");
                                setPeriodDuration("");
                            }}
                            style={{ marginTop: '1rem', backgroundColor: '#666' }}
                        >
                            Cancel Edit
                        </button>
                    )}
                    <div className="output-box">{output}</div>

                    {/* Period Logs Section */}
                    <div className="period-logs-section">
                        <h2 className="period-logs-title">Period History</h2>
                        {allPeriods.length > 0 ? (
                            allPeriods
                                .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                                .map((period) => (
                                    <div key={period.id} className="period-log-item">
                                        <div className="period-log-info">
                                            <div className="period-log-date">
                                                {new Date(period.startDate).toLocaleDateString()}
                                            </div>
                                            <div className="period-log-details">
                                                Duration: {period.duration} days | Cycle Length: {period.cycleLength} days
                                            </div>
                                        </div>
                                        <div className="period-log-actions">
                                            <button
                                                className="period-log-button edit-button"
                                                onClick={() => handleEdit(period)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="period-log-button delete-button"
                                                onClick={() => handleDelete(period.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="no-logs-message">
                                No period logs available. Start tracking your periods above.
                            </div>
                        )}
                    </div>

                    <div className="calendar-section">
                        <div className="calendar-header">
                            <button onClick={() => changeMonth(-1)}>Previous</button>
                            <h3>{monthYearText}</h3>
                            <button onClick={() => changeMonth(1)}>Next</button>
                        </div>
                        <div className="calendar">
                            {calendarHTML}
                        </div>
                        <div className="cycle-legend">
                            <div className="legend-item">
                                <div className="legend-color legend-period"></div>
                                <span>Period 🌺</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color legend-ovulation"></div>
                                <span>Ovulation 🥚</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color legend-fertile"></div>
                                <span>Fertile Window ✨</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default PeriodTracker;