import Navbar from "../components/Public/navbar";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";

function AppointmentsSelect() {
  const location = useLocation();
  const counselor = location.state?.counselor;
  const [selectedDate, setSelectedDate] = useState(new Date()); // No need for TypeScript types
  const [selectedTime, setSelectedTime] = useState(null);
  const navigate = useNavigate();
  const Booking = () => {
    navigate("/appointmentform", {
      state: {
        counselor,
        selectedDate: selectedDate.toDateString(), 
        selectedTime, 
      },
    });
  };

  const timeSlots = [];
  let startTime = new Date();
  startTime.setHours(10, 30, 0, 0); // 10:30 AM

  for (let i = 0; i < 9; i++) {
    let timeString = startTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    timeSlots.push(timeString);
    startTime.setMinutes(startTime.getMinutes() + 30); // Increase by 30 minutes
  }

  return (
    <>
      <Navbar />
      <div>
        <h1>Book an Appointment</h1>
        <h2>{counselor.name}</h2>
        <h3>{counselor.specialization}</h3>
        <h4>{counselor.experience} years experience</h4>
      </div>
      <div>
        <h2>Select Date and Time</h2>
        <Calendar onChange={setSelectedDate} value={selectedDate} />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          {timeSlots.map((time, index) => (
            <button
              key={index}
              onClick={() => setSelectedTime(time)}
              style={{
                padding: "10px 15px",
                borderRadius: "8px",
                border:
                  selectedTime === time
                    ? "2px solid #007bff"
                    : "1px solid gray",
                backgroundColor: selectedTime === time ? "#007bff" : "white",
                color: selectedTime === time ? "white" : "black",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {time}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={Booking}
            disabled={!selectedTime}
            style={{
              padding: "10px 20px",
              backgroundColor: selectedTime ? "#28a745" : "gray",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: selectedTime ? "pointer" : "not-allowed",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Confirm Appointment
          </button>
        </div>
      </div>
    </>
  );
}

export default AppointmentsSelect;
