import React, { useState, useEffect } from "react";
import "../css/AvailabilityCalendar.css";
import Navbar2 from "../components/Public/navbar2";
import { useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaCalendarAlt } from "react-icons/fa";

const AvailabilityCalendar = () => {
  const navigate = useNavigate();
  // Get current date - initialize calendar to current month and year
  const today = new Date();

  const [currentMonthNum, setCurrentMonthNum] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(
    `${getMonthName(today.getMonth() + 1)} ${today.getFullYear()}`
  );

  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedSlots, setSelectedSlots] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [availabilityData, setAvailabilityData] = useState({});
  const [counselorEmail, setCounselorEmail] = useState("");

  // Get current date for greying out past dates
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDate = today.getDate();

  // Time slot mapping - from internal slot numbers to actual time formats
  const slotTimeMapping = {
    "01": "9:00",
    "02": "9:30",
    "03": "10:00",
    "04": "10:30",
    "05": "11:00",
    "06": "11:30",
    "07": "12:00",
    "08": "12:30",
    "09": "14:00",
    "10": "14:30",
    "11": "15:00",
    "12": "15:30",
    "13": "16:00",
    "14": "16:30",
    "15": "17:00",
    "16": "17:30",
    "17": "18:00",
    "18": "18:30",
  };
  
  // Reverse mapping from time string to slot number
  const timeToSlotMapping = Object.entries(slotTimeMapping).reduce(
    (acc, [slot, time]) => {
      acc[time] = slot;
      return acc;
    },
    {}
  );

  // Fetch current counselor info from API on component mount
  useEffect(() => {
    const fetchCurrentCounselor = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/appointments/current-counselors", {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        console.log("Current counselor data:", data);
        setCounselorEmail(data[0].email);
        console.log("Current counselor email:", data[0].email);

      } catch (error) {
        console.error("Error fetching current counselor:", error);
        setMessage("Error: Unable to fetch counselor information. Please log in again.");
      }
    };

    fetchCurrentCounselor();
  }, []);

  // Helper function to get month name
  function getMonthName(monthNum) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthNum - 1];
  }

  // Fetch availability data for the current month
  useEffect(() => {
    console.log("Fetching availability for counselor here:", counselorEmail);
    if (!counselorEmail) return;
    
    const fetchMonthAvailability = async () => {
      setIsLoading(true);
      try {
        const daysInMonth = getDaysInMonth(currentYear, currentMonthNum);
        const monthData = {};
        
        // Fetch data for each day in the month
        for (let day = 1; day <= daysInMonth; day++) {
          const formattedDay = day < 10 ? `0${day}` : `${day}`;
          const formattedMonth = currentMonthNum < 10 ? `0${currentMonthNum}` : `${currentMonthNum}`;
          const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
          // convert date to ISO format
          const formatDateForBackend = (dateStr) => {
            if (!dateStr) return "";
            
            const date = new Date(dateStr);
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
              .toISOString();
          }
          console.log("Fetching availability for", counselorEmail, formatDateForBackend(dateStr));
          try {
            const response = await fetch(`http://127.0.0.1:8000/appointments/counselors/available_slots?counselor_email=${encodeURIComponent(counselorEmail)}&date=${formatDateForBackend(dateStr)}`);
            if (!response.ok) {
              throw new Error(`API returned status: ${response.status}`);
            }
            const data = await response.json();
            
            // Convert time strings to slot numbers for UI consistency
            const slotNumbers = (data.time_slots || []).map(timeStr => {
              return timeToSlotMapping[timeStr] || null;
            }).filter(slot => slot !== null);
            
            // Store the slot numbers for this day
            monthData[formattedDay] = slotNumbers;
            console.log(`Fetched availability for ${dateStr}:`, data.time_slots, 'converted to:', slotNumbers);
          } catch (error) {
            console.error(`Error fetching availability for ${dateStr}:`, error);
            monthData[formattedDay] = [];
          }
        }
        
        setAvailabilityData(monthData);
        console.log("Month data loaded:", monthData);
      } catch (error) {
        console.error("Error fetching month availability:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMonthAvailability();
  }, [currentYear, currentMonthNum, counselorEmail]);

  // Initialize selected slots when a day is selected
  useEffect(() => {
    const formattedDay =
      selectedDay < 10 ? `0${selectedDay}` : `${selectedDay}`;
    const daySlots = availabilityData[formattedDay] || [];

    // Initialize with all slots unselected
    const initialSelectedSlots = {};
    // Total 18 slots for 30-minute intervals from 9am to 6pm
    for (let i = 1; i <= 18; i++) {
      const slotStr = i < 10 ? `0${i}` : `${i}`;
      initialSelectedSlots[slotStr] = daySlots.includes(slotStr);
    }

    setSelectedSlots(initialSelectedSlots);
    setHasUnsavedChanges(false);
  }, [selectedDay, availabilityData]);

  // Month navigation functions with unsaved changes check
  const handlePrevMonth = () => {
    if (checkUnsavedChanges()) {
      let newMonth = currentMonthNum - 1;
      let newYear = currentYear;

      if (newMonth < 1) {
        newMonth = 12;
        newYear -= 1;
      }

      setCurrentMonthNum(newMonth);
      setCurrentYear(newYear);
      setCurrentMonth(`${getMonthName(newMonth)} ${newYear}`);

      // Reset selected day to 1 when changing months
      setSelectedDay(1);
    }
  };

  const handleNextMonth = () => {
    if (checkUnsavedChanges()) {
      let newMonth = currentMonthNum + 1;
      let newYear = currentYear;

      if (newMonth > 12) {
        newMonth = 1;
        newYear += 1;
      }

      setCurrentMonthNum(newMonth);
      setCurrentYear(newYear);
      setCurrentMonth(`${getMonthName(newMonth)} ${newYear}`);

      // Reset selected day to 1 when changing months
      setSelectedDay(1);
    }
  };

  // Check for unsaved changes before navigation
  const checkUnsavedChanges = () => {
    if (hasUnsavedChanges) {
      return window.confirm(
        "You have unsaved changes. Are you sure you want to navigate away?"
      );
    }
    return true;
  };

  // Handle slot selection - this updates the currently selected slots
  const handleSlotClick = (slotNumber) => {
    const slotStr = slotNumber < 10 ? `0${slotNumber}` : `${slotNumber}`;

    setSelectedSlots((prevSlots) => ({
      ...prevSlots,
      [slotStr]: !prevSlots[slotStr],
    }));

    setHasUnsavedChanges(true);
  };

  // Handle day click
  const handleDayClick = (day) => {
    if (isPastDate(currentYear, currentMonthNum, day)) {
      return; // Don't allow selecting past dates
    }

    if (checkUnsavedChanges()) {
      setSelectedDay(day);
    }
  };

  // Update availability in the database
  const updateAvailability = async () => {
    if (!counselorEmail) {
      setMessage("Error: Counselor information not available. Please log in again.");
      return;
    }
    
    setIsLoading(true);

    try {
      // Get selected slots as an array and convert them to time strings for the API
      const selectedTimeSlots = Object.entries(selectedSlots)
        .filter(([_, isSelected]) => isSelected)
        .map(([slot]) => slotTimeMapping[slot])
        .filter(time => time !== undefined);

      // Format day and month for API request
      const formattedDay = selectedDay < 10 ? `0${selectedDay}` : `${selectedDay}`;
      const formattedMonth = currentMonthNum < 10 ? `0${currentMonthNum}` : `${currentMonthNum}`;
      const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;

      
      const formatDateForBackend = (dateStr) => {
        if (!dateStr) return "";
        
        const date = new Date(dateStr);
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
          .toISOString();
      };
      console.log("Updating availability for", counselorEmail, formatDateForBackend(dateStr), selectedTimeSlots);
      // Modify your fetch call to something like this:
      const response = await fetch(
        `http://127.0.0.1:8000/appointments/counselors/update_slots`, 
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Include your auth token
          },
          body: JSON.stringify({ 
            counselor_email: counselorEmail,
            date: formatDateForBackend(dateStr),
            time_slots: selectedTimeSlots 
          })
        }
      );


      const data = await response.json();

      console.log("Update response:", data);

      // Update local state with slot numbers (not time strings)
      const selectedSlotsArray = Object.entries(selectedSlots)
        .filter(([_, isSelected]) => isSelected)
        .map(([slot]) => slot);
        
      setAvailabilityData((prevData) => ({
        ...prevData,
        [formattedDay]: selectedSlotsArray,
      }));

      setMessage(data.message || "Availability updated successfully!");
      setHasUnsavedChanges(false);

      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating availability:", error);
      setMessage("Error updating availability. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions for calendar generation
  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const isPastDate = (year, month, day) => {
    if (year < todayYear) return true;
    if (year === todayYear && month < todayMonth) return true;
    if (year === todayYear && month === todayMonth && day < todayDate)
      return true;
    return false;
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentYear, currentMonthNum);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonthNum);

    // Previous month days
    const prevMonthDays = firstDayOfMonth;
    let prevMonth = currentMonthNum - 1;
    let prevMonthYear = currentYear;

    if (prevMonth < 1) {
      prevMonth = 12;
      prevMonthYear -= 1;
    }

    const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);

    for (let i = 0; i < prevMonthDays; i++) {
      const day = daysInPrevMonth - prevMonthDays + i + 1;

      days.push(
        <div key={`prev-${day}`} className="calendar-day inactive">
          <span className="day-number">{day}</span>
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDay = day < 10 ? `0${day}` : `${day}`;
      const isPast = isPastDate(currentYear, currentMonthNum, day);
      const isSelected = day === selectedDay;
      const daySlots = availabilityData[formattedDay] || [];
      const hasSlots = daySlots.length > 0;

      days.push(
        <div
          key={`current-${day}`}
          className={`calendar-day ${isPast ? "past" : ""} ${
            isSelected ? "selected" : ""
          } ${hasSlots ? "has-slots" : ""}`}
          onClick={() => !isPast && handleDayClick(day)}
        >
          <span className="day-number">{day}</span>
          {hasSlots && (
            <div className="slot-indicator">
              <span className="dot"></span>
            </div>
          )}
        </div>
      );
    }

    // Next month days
    const totalDaysDisplayed = prevMonthDays + daysInMonth;
    const nextMonthDays = 7 - (totalDaysDisplayed % 7);

    if (nextMonthDays < 7) {
      for (let day = 1; day <= nextMonthDays; day++) {
        days.push(
          <div key={`next-${day}`} className="calendar-day inactive">
            <span className="day-number">{day}</span>
          </div>
        );
      }
    }

    return days;
  };

  // Slot time mapping for display in UI (with start and end times)
  const getSlotTime = (slotNum) => {
    // 18 slots for 30-minute intervals from 9am to 6pm
    const slotTimes = {
      "01": "9:00am - 9:30am",
      "02": "9:30am - 10:00am",
      "03": "10:00am - 10:30am",
      "04": "10:30am - 11:00am",
      "05": "11:00am - 11:30am",
      "06": "11:30am - 12:00pm",
      "07": "12:00pm - 12:30pm",
      "08": "12:30pm - 1:00pm",
      "09": "2:00pm - 2:30pm",
      "10": "2:30pm - 3:00pm",
      "11": "3:00pm - 3:30pm",
      "12": "3:30pm - 4:00pm",
      "13": "4:00pm - 4:30pm",
      "14": "4:30pm - 5:00pm",
      "15": "5:00pm - 5:30pm",
      "16": "5:30pm - 6:00pm",
      "17": "6:00pm - 6:30pm",
      "18": "6:30pm - 7:00pm",
    };

    const slotStr = slotNum < 10 ? `0${slotNum}` : `${slotNum}`;
    return slotTimes[slotStr] || "Time not specified";
  };

  const handleNavigation = (path) => {
    if (hasUnsavedChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to navigate away?")) {
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };

  return (
    <div className="safespace-container">
      <Navbar2 />
      <div className="content-container">
        <div className="sidebar">
          <div className="sidebar-item active" onClick={() => handleNavigation("/counselor/dashboard")}>
            <span className="sidebar-icon">
              <FaTachometerAlt/>
            </span>
            <span>Dashboard</span>
          </div>
          <div className="sidebar-item" onClick={() => handleNavigation("/counselor/requests")}>
            <span className="sidebar-icon">
            <FaCalendarAlt/>
            </span>
            <span>Requests</span>
          </div>
        </div>

        <div className="main-content">
          <div className="header">
            <h1>Counselor Dashboard</h1>
            <h2>Manage Your Availability</h2>
          </div>

          {isLoading && !message && (
            <div className="loading-indicator">Loading calendar data...</div>
          )}

          <div className="calendar-container">
            <div className="calendar-header">
              <h3>{currentMonth}</h3>
              <div className="navigation">
                <div className="nav-button" onClick={handlePrevMonth}>
                  &lt;
                </div>
                <div className="nav-button" onClick={handleNextMonth}>
                  &gt;
                </div>
              </div>
            </div>

            <div className="calendar-weekdays">
              <div className="weekday">Sun</div>
              <div className="weekday">Mon</div>
              <div className="weekday">Tue</div>
              <div className="weekday">Wed</div>
              <div className="weekday">Thu</div>
              <div className="weekday">Fri</div>
              <div className="weekday">Sat</div>
            </div>

            <div className="calendar-grid">{generateCalendarDays()}</div>
          </div>
        </div>

        <div className="right-sidebar">
          <div className="availability-panel">
            <h3 className="avalability-panel-date">
              {selectedDay} {currentMonth}
            </h3>

            {message && <div className="message success">{message}</div>}

            <div className="slots-container">
              {/* Morning slots */}
              <div className="slot-section">
                <h4>Morning</h4>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((slotNum) => {
                  const slotStr = slotNum < 10 ? `0${slotNum}` : `${slotNum}`;
                  return (
                    <button
                      key={slotNum}
                      className={`slot-button ${selectedSlots[slotStr] ? "selected" : ""}`}
                      onClick={() => handleSlotClick(slotNum)}
                      type="button"
                    >
                      <div className="slot-content">
                        <div className="slot-time">{getSlotTime(slotNum)}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Afternoon slots */}
              <div className="slot-section">
                <h4>Afternoon/Evening</h4>
                {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((slotNum) => {
                  const slotStr = slotNum < 10 ? `0${slotNum}` : `${slotNum}`;
                  return (
                    <button
                      key={slotNum}
                      className={`slot-button ${selectedSlots[slotStr] ? "selected" : ""}`}
                      onClick={() => handleSlotClick(slotNum)}
                      type="button"
                    >
                      <div className="slot-content">
                        <div className="slot-time">{getSlotTime(slotNum)}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              className="update-button"
              onClick={updateAvailability}
              disabled={isLoading || !hasUnsavedChanges}
            >
              {isLoading ? "Updating..." : "Update Availability"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;