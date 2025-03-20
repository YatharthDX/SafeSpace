import React, { useState } from "react";
import "../css/AppointmentsSelect.css";
import Navbar2 from "../components/Public/navbar2";
import { useNavigate, useLocation } from "react-router-dom";

function AppointmentSelect() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();
  const location = useLocation();
  const { counselor } = location.state || {};

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
    setSelectedDate(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    );
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

  // Time slots
  const timeSlots = [
    "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", 
    "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM"
  ];
  

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
                {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns={counselor.image}>
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#333333"/>
                  <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#333333"/>
                </svg> */}
                <img
                  src={counselor.image}
                  alt="Counselor Profile"
                  width="48"
                  height="48"
                  style={{ borderRadius: "0%" }}
                />
              </div>
              <div className="counselor-details">
                <h2>{counselor.name}</h2>
                <p>{counselor.specialization}</p>
                <p>{counselor.experience} years experience</p>
                <p className="session-duration">30 mins</p>
              </div>
            </div>

            <h3 className="booking-title">Select Date and Time</h3>

            <div className="selected-date-display">
              {formatDate(selectedDate)}
            </div>

            <div className="time-slots-container">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  className={`time-slot ${
                    selectedTime === time ? "selected" : ""
                  }`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
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
