// import React, { useState } from "react";
// import "../css/AvailabilityCalendar.css";
// import Navbar from "../components/Public/navbar";
// import { useEffect } from "react";

// const AvailabilityCalendar = () => {
//   // Get current date - initialize calendar to current month and year
//   const today = new Date();
//   const getMonthName = (monthNum) => {
//     const months = [
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ];
//     return months[monthNum - 1];
//   };
//   const [currentMonthNum, setCurrentMonthNum] = useState(today.getMonth() + 1); // JavaScript months are 0-indexed
//   const [currentYear, setCurrentYear] = useState(today.getFullYear());
//   const [currentMonth, setCurrentMonth] = useState(
//     `${getMonthName(today.getMonth() + 1)} ${today.getFullYear()}`
//   );

//   const [selectedDay, setSelectedDay] = useState(today.getDate());
//   const [selectedSlots, setSelectedSlots] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   // Get current date for greying out past dates
//   const todayYear = today.getFullYear();
//   const todayMonth = today.getMonth() + 1;
//   const todayDate = today.getDate();
//   // Initialize availability data
//   const [availabilityData, setAvailabilityData] = useState({
//     "01": ["01", "02", "03"],
//     "02": ["02", "03"],
//     "03": ["01", "03"],
//     "07": ["02", "03"],
//     "08": [],
//     "09": ["01", "02", "03"],
//     10: ["03"],
//     11: ["01", "02", "03"],
//     12: ["02", "03"],
//     13: ["01", "03"],
//     14: ["01", "02", "03"],
//     16: ["02", "03"],
//     17: ["03"],
//     18: ["01", "02", "03"],
//     19: [],
//     20: ["01", "02", "03"],
//     21: ["01", "03"],
//     22: [],
//     23: ["01", "03"],
//     24: ["02", "03"],
//     25: [],
//     26: ["01", "02", "03"],
//     27: [],
//     28: [],
//     29: ["01", "03"],
//     30: ["02", "03"],
//   });
//   // Initialize empty selected slots for the selected day
//   // This ensures we only show what the user is currently selecting
//   useEffect(() => {
//     const initialSelectedSlots = {};
//     for (let i = 1; i <= 8; i++) {
//       initialSelectedSlots[i] = false;
//     }
//     setSelectedSlots(initialSelectedSlots);
//   }, [selectedDay]);

//   // Helper function to get month name

//   // Month navigation functions (unchanged)

//   // Handle slot selection - this updates the currently selected slots

//   // Generate calendar days function remains mostly unchanged
//   const generateCalendarDays = () => {
//     const days = [];
//     const daysInMonth = getDaysInMonth(currentYear, currentMonthNum);
//     const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonthNum);

//     // Previous month days...
//     const prevMonthDays = firstDayOfMonth;
//     let prevMonth = currentMonthNum - 1;
//     let prevMonthYear = currentYear;

//     if (prevMonth < 1) {
//       prevMonth = 12;
//       prevMonthYear -= 1;
//     }

//     const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);

//     for (let i = 0; i < prevMonthDays; i++) {
//       const day = daysInPrevMonth - prevMonthDays + i + 1;
//       const dayStr = day < 10 ? `0${day}` : `${day}`;

//       days.push(
//         <div key={`prev-${dayStr}`} className="calendar-day inactive">
//           <span className="day-number">{dayStr}</span>
//         </div>
//       );
//     }
//     // Current month days
//     for (let day = 1; day <= daysInMonth; day++) {
//       const formattedDay = day < 10 ? `0${day}` : `${day}`;
//       const isPast = isPastDate(currentYear, currentMonthNum, day);
//       const isSelected = day === selectedDay;

//       days.push(
//         <div
//           key={`current-${day}`}
//           className={`calendar-day ${isPast ? "past" : ""} ${
//             isSelected ? "selected" : ""
//           }`}
//           onClick={() => handleDayClick(day)}
//         >
//           <span className="day-number">{day}</span>
//           <div className="slot-container">
//             {/* Display slots from DB for reference only */}
//             {availabilityData[formattedDay]?.map((slot) => (
//               <span key={slot} className={`slot slot-${slot}`}>
//                 {slot}
//               </span>
//             ))}
//           </div>
//         </div>
//       );
//     }

//     // Next month days...
//     const totalCellsNeeded = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
//     const nextMonthDays = totalCellsNeeded - (firstDayOfMonth + daysInMonth);

//     for (let i = 1; i <= nextMonthDays; i++) {
//       const dayStr = i < 10 ? `0${i}` : `${i}`;

//       days.push(
//         <div key={`next-${dayStr}`} className="calendar-day inactive">
//           <span className="day-number">{dayStr}</span>
//         </div>
//       );
//     }

//     return days;
//   };
//   // Initialize slots for the selected day
//   useEffect(() => {
//     const formattedSelectedDay =
//       selectedDay < 10 ? `0${selectedDay}` : `${selectedDay}`;
//     const daySlots = availabilityData[formattedSelectedDay] || [];

//     const initialSelectedSlots = {};
//     for (let i = 1; i <= 8; i++) {
//       initialSelectedSlots[i] =
//         daySlots.includes(`0${i}`) || daySlots.includes(`${i}`);
//     }

//     setSelectedSlots(initialSelectedSlots);
//   }, [selectedDay, availabilityData]);

//   // Month navigation functions
//   const handlePrevMonth = () => {
//     let newMonth = currentMonthNum - 1;
//     let newYear = currentYear;

//     if (newMonth < 1) {
//       newMonth = 12;
//       newYear -= 1;
//     }

//     setCurrentMonthNum(newMonth);
//     setCurrentYear(newYear);
//     setCurrentMonth(`${getMonthName(newMonth)} ${newYear}`);

//     // In a real app, you would fetch new data for the previous month
//     // resetData();
//   };

//   const handleNextMonth = () => {
//     let newMonth = currentMonthNum + 1;
//     let newYear = currentYear;

//     if (newMonth > 12) {
//       newMonth = 1;
//       newYear += 1;
//     }

//     setCurrentMonthNum(newMonth);
//     setCurrentYear(newYear);
//     setCurrentMonth(`${getMonthName(newMonth)} ${newYear}`);

//     // In a real app, you would fetch new data for the next month
//     // resetData();
//   };

//   // Get days in month
//   const getDaysInMonth = (year, month) => {
//     return new Date(year, month, 0).getDate();
//   };

//   // Get first day of month (0 = Sunday, 1 = Monday, etc.)
//   const getFirstDayOfMonth = (year, month) => {
//     // Adjust for Monday as first day of week
//     let firstDay = new Date(year, month - 1, 1).getDay() - 1;
//     if (firstDay === -1) firstDay = 6; // Sunday becomes last day of week
//     return firstDay;
//   };

//   // Check if date is in the past
//   const isPastDate = (year, month, day) => {
//     if (year < todayYear) return true;
//     if (year === todayYear && month < todayMonth) return true;
//     if (year === todayYear && month === todayMonth && day < todayDate)
//       return true;
//     return false;
//   };

//   // Handle slot selection
//   const handleSlotClick = (slotNumber) => {
//     setSelectedSlots((prevSlots) => ({
//       ...prevSlots,
//       [slotNumber]: !prevSlots[slotNumber],
//     }));
//   };

//   // Handle day selection
//   const handleDayClick = (day) => {
//     // Don't allow selecting past dates
//     if (isPastDate(currentYear, currentMonthNum, day)) return;

//     setSelectedDay(day);
//   };

//   // Update availability
//   const updateAvailability = () => {
//     setIsLoading(true);

//     // Convert selected slots to format matching availabilityData
//     const formattedSelectedDay =
//       selectedDay < 10 ? `0${selectedDay}` : `${selectedDay}`;
//     const newSlots = Object.entries(selectedSlots)
//       .filter(([_, isSelected]) => isSelected)
//       .map(([slotNum, _]) => (slotNum < 10 ? `0${slotNum}` : `${slotNum}`));

//     // Update the availability data
//     setAvailabilityData((prevData) => ({
//       ...prevData,
//       [formattedSelectedDay]: newSlots,
//     }));

//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false);
//       setMessage("Availability updated successfully!");

//       // Clear message after 3 seconds
//       setTimeout(() => {
//         setMessage("");
//       }, 3000);

//       console.log("Updated availability data:", {
//         date: `${currentYear}-${currentMonthNum}-${formattedSelectedDay}`,
//         slots: newSlots,
//       });
//     }, 1000);
//   };


//   // Format the selected date
//   const getFormattedDate = () => {
//     const formattedDay = selectedDay < 10 ? `0${selectedDay}` : selectedDay;
//     return `${getMonthName(currentMonthNum)} ${formattedDay}`;
//   };

//   return (
//     <div className="safespace-container">
//       <Navbar />
//       <div className="content-container">
//         <div className="sidebar">
//           <div className="sidebar-item">
//             <span className="sidebar-icon">ðŸ“…</span>
//             <span className="sidebar-text">Calendar</span>
//           </div>
//           <div className="sidebar-item">
//             <span className="sidebar-icon">ðŸ•’</span>
//             <span className="sidebar-text">Appointments</span>
//           </div>
//         </div>

//         <div className="main-content">
//           <div className="header">
//             <h1>Hi, Counselor1</h1>
//             <h2>My Availability</h2>
//           </div>

//           <div className="calendar-container">
//             <div className="calendar-header">
//               <h3>{currentMonth}</h3>
//               <div className="navigation">
//                 <button onClick={handlePrevMonth} className="nav-button">
//                   &lt;
//                 </button>
//                 <button onClick={handleNextMonth} className="nav-button">
//                   &gt;
//                 </button>
//               </div>
//             </div>

//             <div className="calendar-weekdays">
//               <div className="weekday">Mon</div>
//               <div className="weekday">Tue</div>
//               <div className="weekday">Wed</div>
//               <div className="weekday">Thu</div>
//               <div className="weekday">Fri</div>
//               <div className="weekday">Sat</div>
//               <div className="weekday">Sun</div>
//             </div>

//             <div className="calendar-grid">{generateCalendarDays()}</div>
//           </div>

//           {message && <div className="message success">{message}</div>}
//         </div>
//         <div className="right-sidebar">
//           <div className="availability-panel">
//             <h3>
//               {currentMonth} {selectedDay}
//             </h3>

//             {message && <div className="message success">{message}</div>}

//             {/* Display slots based on current selections, not DB data */}
//             {[1, 2, 3, 4, 5, 6, 7, 8].map((slotNum) => (
//               <div
//                 key={slotNum}
//                 className={`slot-option ${
//                   selectedSlots[slotNum] ? "selected" : ""
//                 }`}
//                 onClick={() => handleSlotClick(slotNum)}
//               >
//                 <div className="slot-title">Slot {slotNum}</div>
//                 <div className="slot-time">10:00am - 11:00am</div>
//               </div>
//             ))}

//             <button
//               className="update-button"
//               onClick={updateAvailability}
//               disabled={isLoading}
//             >
//               {isLoading ? "Updating..." : "Update Availability"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AvailabilityCalendar;

// // Rest of the functions (getDaysInMonth, getFirstDayOfMonth, isPastDate, handleDayClick)...

// // The render component should display the selected slots in the right sidebar

import React, { useState, useEffect } from "react";
import "../css/AvailabilityCalendar.css";
import Navbar from "../components/Public/navbar";

const AvailabilityCalendar = () => {
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
  
  // Get current date for greying out past dates
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDate = today.getDate();
  
  // Initialize availability data from database (mock data for now)
  const [availabilityData, setAvailabilityData] = useState({
    "01": ["01", "02", "03"],
    "02": ["02", "03"],
    "03": ["01", "03"],
    "07": ["02", "03"],
    "08": [],
    "09": ["01", "02", "03"],
    "10": ["03"],
    "11": ["01", "02", "03"],
    "12": ["02", "03"],
    "13": ["01", "03"],
    "14": ["01", "02", "03"],
    "16": ["02", "03"],
    "17": ["03"],
    "18": ["01", "02", "03"],
    "19": [],
    "20": ["01", "02", "03"],
    "21": ["01", "03"],
    "22": [],
    "23": ["01", "03"],
    "24": ["02", "03"],
    "25": [],
    "26": ["01", "02", "03"],
    "27": [],
    "28": [],
    "29": ["01", "03"],
    "30": ["02", "03"],
  });
  
  // Helper function to get month name
  function getMonthName(monthNum) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    return months[monthNum - 1];
  }
  
  // Initialize selected slots when a day is selected
  useEffect(() => {
    const formattedDay = selectedDay < 10 ? `0${selectedDay}` : `${selectedDay}`;
    const daySlots = availabilityData[formattedDay] || [];
    
    // Initialize with all slots unselected
    const initialSelectedSlots = {};
    for (let i = 1; i <= 8; i++) {
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
      return window.confirm("You have unsaved changes. Are you sure you want to navigate away?");
    }
    return true;
  };
  
  // Handle slot selection - this updates the currently selected slots
  const handleSlotClick = (slotNumber) => {
    const slotStr = slotNumber < 10 ? `0${slotNumber}` : `${slotNumber}`;
    
    setSelectedSlots(prevSlots => ({
      ...prevSlots,
      [slotStr]: !prevSlots[slotStr]
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
    setIsLoading(true);
    
    try {
      // Get selected slots as an array
      const selectedSlotsArray = Object.entries(selectedSlots)
        .filter(([_, isSelected]) => isSelected)
        .map(([slot]) => slot);
      
      // Format day for database
      const formattedDay = selectedDay < 10 ? `0${selectedDay}` : `${selectedDay}`;
      
      // Mock API call - in a real app, this would be an actual API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state to reflect the changes
      setAvailabilityData(prevData => ({
        ...prevData,
        [formattedDay]: selectedSlotsArray
      }));
      
      setMessage("Availability updated successfully!");
      setHasUnsavedChanges(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
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
    if (year === todayYear && month === todayMonth && day < todayDate) return true;
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
      const dayStr = day < 10 ? `0${day}` : `${day}`;
      
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
      
      days.push(
        <div
          key={`current-${day}`}
          className={`calendar-day ${isPast ? 'past' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => !isPast && handleDayClick(day)}
        >
          <span className="day-number">{day}</span>
          <div className="slot-container">
            {availabilityData[formattedDay]?.map(slot => (
              <span key={slot} className={`slot slot-${slot}`}>{slot}</span>
            ))}
          </div>
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
  
  // Slot time mapping
  const getSlotTime = (slotNum) => {
    const slotTimes = {
      "01": "9:00am - 10:00am",
      "02": "10:00am - 11:00am",
      "03": "11:00am - 12:00pm",
      "04": "12:00pm - 1:00pm",
      "05": "2:00pm - 3:00pm",
      "06": "3:00pm - 4:00pm",
      "07": "4:00pm - 5:00pm",
      "08": "5:00pm - 6:00pm"
    };
    
    const slotStr = slotNum < 10 ? `0${slotNum}` : `${slotNum}`;
    return slotTimes[slotStr] || "Time not specified";
  };
  
  return (
    <div className="safespace-container">
      <Navbar />
      
      <div className="content-container">
        <div className="main-content">
          <div className="header">
            <h1>Counselor Dashboard</h1>
            <h2>Manage Your Availability</h2>
          </div>
          
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
            
            <div className="calendar-grid">
              {generateCalendarDays()}
            </div>
          </div>
        </div>
        
        <div className="right-sidebar">
          <div className="availability-panel">
            <h3>{currentMonth} {selectedDay}</h3>
            
            {message && <div className="message success">{message}</div>}
            
            {/* Display slots based on current selections */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map(slotNum => {
              const slotStr = slotNum < 10 ? `0${slotNum}` : `${slotNum}`;
              return (
                <div
                  key={slotNum}
                  className={`slot-option ${selectedSlots[slotStr] ? 'selected' : ''}`}
                  onClick={() => handleSlotClick(slotNum)}
                >
                  <div className="slot-title">Slot {slotNum}</div>
                  <div className="slot-time">{getSlotTime(slotNum)}</div>
                </div>
              );
            })}
            
            <button
              className="update-button"
              onClick={updateAvailability}
              disabled={isLoading || !hasUnsavedChanges}
            >
              {isLoading ? 'Updating...' : 'Update Availability'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
