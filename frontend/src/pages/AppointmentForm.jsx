import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import "../css/AppointmentForm.css";
import Navbar from "../components/Public/navbar";

function AppointmentForm() {
  // 1. Retrieve data from navigate("/appointmentform", { state: { ... } })
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure the passed-in state (if any)
  const {
    counselor,
    selectedDate,  // e.g. "Thu Aug 10 2023" (from toDateString())
    selectedTime,   // e.g. "02:30pm"
  } = location.state || {};

  // 2. Form states
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [problemDescription, setProblemDescription] = useState("");

  // 3. Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Do something with the form data
    alert(
      `Appointment Confirmed!\n\n` +
      `Counselor: ${counselor?.name || "N/A"}\n` +
      `Date: ${selectedDate || "N/A"}\n` +
      `Time: ${selectedTime || "N/A"}\n\n` +
      `Name: ${name}\nContact: ${contactNumber}\nEmail: ${email}`
    );
    // Navigate somewhere or make an API call here
    // navigate("/some-other-page");
  };

  // 4. Optionally handle "Back" button
  const handleBack = () => {
    navigate(-1); // Go back one page
  };

  return (
    <div className="appointment-form-container">
      {/* ---------- NAVBAR ---------- */}
      <Navbar />

      {/* ---------- MAIN CONTENT AREA ---------- */}
      <div className="appointment-content">
        {/* LEFT PANEL - Info about the appointment */}
        <div className="appointment-info">
          <button className="back-button" onClick={handleBack}>
            <span className="back-arrow">&#8592;</span> Back
          </button>

          <h2>{counselor?.name || "Dr. Counselor Name"}</h2>
          <p>{counselor?.experience ? `${counselor.experience} years experience` : "30 mins"}</p>
          {/* You can combine date & time into a single string, or show them separately */}
          <p>
            {selectedTime || "02:30pm"} - 03:00pm, {selectedDate || "Thursday, August 10th"}
          </p>
        </div>

        {/* RIGHT PANEL - Form to collect user details */}
        <div className="appointment-details">
          <h3>Enter Details</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="text"
                placeholder="+91 | Enter Mobile Number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Email-ID</label>
              <input
                type="email"
                placeholder="Enter Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Problem Description</label>
              <input
                type="text"
                placeholder="Please describe your problem"
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="confirm-button">
              Confirm
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AppointmentForm;
