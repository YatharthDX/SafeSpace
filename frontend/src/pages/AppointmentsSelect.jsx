import Navbar from "../components/Public/navbar";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Calendar from "react-calendar";

function AppointmentsSelect() {
  const location = useLocation();
  const counselor = location.state?.counselor;
  const [value, setValue] = useState(new Date()); // No need for TypeScript types

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
        <Calendar onChange={setValue} value={value} />
        
      </div>
    </>
  );
}

export default AppointmentsSelect;
