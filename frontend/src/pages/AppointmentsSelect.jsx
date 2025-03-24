import React, { useState, useEffect } from "react";
import "../css/AppointmentsSelect.css";
import Navbar2 from "../components/Public/navbar2";
import { useNavigate, useLocation } from "react-router-dom";
import { PiColumnsPlusLeftLight } from "react-icons/pi";

function AppointmentSelect() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureLoading, setProfilePictureLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { counselor } = location.state || {};

  useEffect(() => {
    if (!counselor) {
      navigate("/appointments");
    }
  }, [counselor, navigate]);

  // Time slots that could potentially be available
  const allTimeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",

  ];
  // Fetch available time slots whenever the selected date changes
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      console.log("counselor detail ", counselor)
      if (!counselor || !counselor.email) return;
      console.log("jinga")
      setIsLoading(true);
      try {
        // Format date as YYYY-MM-DD for the API
        // convert date to ISO format
        const formattedDate = (dateStr) => {
          if (!dateStr) return "";
          
          const date = new Date(dateStr);
          return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
            .toISOString();
        }
        console.log("Formatted date:", formattedDate(selectedDate));
        // const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
        
        const response = await fetch(`http://127.0.0.1:8000/appointments/counselors/available_slots?counselor_email=${counselor.email}&date=${formattedDate(selectedDate)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch available slots');
        }
        console.log("Fetching slots for date:", formattedDate);
        const data = await response.json();
        console.log("Available slots:", data.time_slots);
        const formattedTimeSlots = data.time_slots.map(time => {
          const [hour, minute] = time.split(':').map(Number);
          const period = hour >= 12 ? 'PM' : 'AM';
          const formattedHour = hour % 12 || 12; // Convert 0 -> 12 and 13+ -> 1+
          return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
        });
        
        setAvailableTimeSlots(formattedTimeSlots);
      } catch (error) {
        console.error("Error fetching available slots:", error);
        setAvailableTimeSlots([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate, counselor]);

  // Fetch counselor profile picture
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!counselor || !counselor.name) return;
      
      setProfilePictureLoading(true);
      try {
        // Create URL for profile picture endpoint
        const response = await fetch(`http://127.0.0.1:8000/api/auth/get-profile-picture/${counselor.name}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile picture');
        }
        // Create a blob URL from the image data
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setProfilePicture(imageUrl);
      } catch (error) {
        console.error("Error fetching profile picture:", error);
        setProfilePicture(null);
      } finally {
        setProfilePictureLoading(false);
      }
    };

    fetchProfilePicture();
    
    // Cleanup function to revoke object URL
    return () => {
      if (profilePicture) {
        URL.revokeObjectURL(profilePicture);
      }
    };
  }, [counselor]);

  
  const handleTimeSelect = (time) => {
    // Only allow selection if the slot is available
    if (availableTimeSlots.includes(time)) {
      setSelectedTime(selectedTime === time ? null : time);
    }
  };
  
  const formatDate = (date) => {
    const options = { weekday: "long", day: "numeric", month: "long" };
    return date.toLocaleDateString("en-US", options);
  };

  const monthYearFormat = (date) => {
    const options = { month: "long", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
    setSelectedTime(null); // Reset selected time when date changes
  };

  const handleBack = () => {
    navigate(-1); // Go back one page
  };

  const handleBooking = () => {
    navigate("/appointmentform", {
      state: {
        counselor,
        selectedDate: selectedDate.toDateString(),
        selectedTime,
      },
    });
  };

  // Generate calendar data
  const getCalendarDays = () => {
    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();

    const firstDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (
      let i = 0;
      i < (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);
      i++
    ) {
      days.push({ day: null, isEmpty: true });
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const isSelected =
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth.getMonth() &&
        selectedDate.getFullYear() === currentMonth.getFullYear();

      // Determine if the date is in the past
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

      days.push({
        day,
        isSelected,
        isPast,
        isEmpty: false,
      });
    }

    return days;
  };

  const calendarDays = getCalendarDays();

  // Default placeholder image for when profile picture is loading or not available
  const defaultImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cccccc'%3E%3Cpath d='M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.32 0-10 1.68-10 5v3h20v-3c0-3.32-6.68-5-10-5z'/%3E%3C/svg%3E";

  return (
    <div className="appointment-page">
      <Navbar2 />

      <div className="appointment-container">
        <div className="appointment-content">
          <div className="left-side">
            <div className="back-button-container">
              <button className="back-button" onClick={handleBack}>
                <span className="back-icon">←</span>
              </button>
            </div>

            <div className="counselor-info">
              <div className="counselor-icon">
                <img
                  src={profilePictureLoading ? defaultImage : (profilePicture || defaultImage)}
                  alt="Counselor Profile"
                  width="200"
                  height="200"
                  // style={{ borderRadius: "0%" }}
                  className={profilePictureLoading ? "image-loading" : ""}
                />
              </div>
              <div className="counselor-details">
                <h2>{counselor?.name}</h2>
                <p>{counselor?.description}</p>
                <p className="session-duration">30 mins</p>
              </div>
            </div>

            <h3 className="booking-title">Select Date and Time</h3>

            <div className="selected-date-display">
              {formatDate(selectedDate)}
            </div>

            <div className="time-slots-container">
              {isLoading ? (
                <div className="loading-indicator">Loading available slots...</div>
              ) : (
                allTimeSlots.map((time) => (
                  <button
                    key={time}
                    className={`time-slot ${
                      selectedTime === time ? "selected" : ""
                    } ${!availableTimeSlots.includes(time) ? "unavailable" : ""}`}
                    onClick={() => handleTimeSelect(time)}
                    disabled={!availableTimeSlots.includes(time)}
                  >
                    {time}
                  </button>
                ))
              )}
            </div>

            <div className="booking-action">
              <button
                onClick={handleBooking}
                disabled={!selectedTime}
                className="confirm-button"
              >
                Confirm Appointment
              </button>
            </div>
          </div>

          <div className="right-side">
            <div className="calendar-header">
              <button onClick={goToPreviousMonth} className="month-nav-button">
                <span className="month-nav-icon">←</span>
              </button>
              <h3 className="month-year">{monthYearFormat(currentMonth)}</h3>
              <button onClick={goToNextMonth} className="month-nav-button">
                <span className="month-nav-icon">→</span>
              </button>
            </div>

            <div className="calendar">
              <div className="weekdays">
                <div className="weekday">MON</div>
                <div className="weekday">TUE</div>
                <div className="weekday">WED</div>
                <div className="weekday">THU</div>
                <div className="weekday">FRI</div>
                <div className="weekday">SAT</div>
                <div className="weekday">SUN</div>
              </div>

              <div className="calendar-grid">
                {calendarDays.map((day, index) => (
                  <div
                    key={`day-${index}`}
                    className={`calendar-day ${day.isEmpty ? "empty" : ""} ${
                      day.isSelected ? "selected" : ""
                    } ${day.isPast ? "past" : ""}`}
                    onClick={() =>
                      !day.isEmpty && !day.isPast && handleDateSelect(day.day)
                    }
                  >
                    {day.day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentSelect;