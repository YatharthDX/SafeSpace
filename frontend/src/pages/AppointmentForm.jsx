import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/AppointmentForm.css";
import Navbar2 from "../components/Public/navbar2";

function add30Minutes(timeStr) {
  // Convert "12:30 PM" to hours and minutes
  let [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  // Convert to 24-hour format
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  // Add 30 minutes
  minutes += 30;
  if (minutes >= 60) {
    minutes -= 60;
    hours += 1;
  }

  // Convert back to 12-hour format
  let newModifier = hours >= 12 ? "PM" : "AM";
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;

  // Format minutes properly (e.g., "2:5" → "2:05")
  let newTime = `${hours}:${minutes
    .toString()
    .padStart(2, "0")} ${newModifier}`;
  return newTime;
}

function AppointmentForm() {
  // 1. Retrieve data from navigate("/appointmentform", { state: { ... } })
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure the passed-in state (if any)
  const {
    counselor,
    selectedDate, // e.g. "Thu Aug 10 2023" (from toDateString())
    selectedTime, // e.g. "02:30pm"
  } = location.state || {};
  console.log("Counselor data:", counselor);
  console.log("Selected date:", selectedDate);
  console.log("Selected time:", selectedTime);
  // 2. Form states
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Format time slot as expected by backend
  const formatTimeForBackend = (timeStr) => {
    if (!timeStr) return "";
    let timeStr1 = timeStr.split(" ")[0];
    let [hours, minutes] = timeStr1.split(":").map(Number);
    if (timeStr.includes("PM") && hours !== 12) hours += 12;
    if (timeStr.includes("AM") && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };
  console.log("Formatted time:", formatTimeForBackend(selectedTime));

  // Format date as expected by backend (YYYY-MM-DD)
  const formatDateForBackend = (dateStr) => {
    if (!dateStr) return "";
    
    const date = new Date(dateStr);
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
      .toISOString();
  };
  
  console.log("Selected date:", selectedDate);
  console.log("Formatted date:", formatDateForBackend(selectedDate));

  // 3. Handle form submission
  const handleSubmit = async (e) => {
    console.log("Submitting form...");
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Prepare appointment data
      const appointmentData = {
        user_name: name,
        user_email: email,
        counselor_email: counselor?.email || "",
        date: formatDateForBackend(selectedDate),
        time_slot: formatTimeForBackend(selectedTime),
        contact_no: contactNumber,
        description: problemDescription,
        status: "pending"
      };

      console.log("Sending appointment data:", appointmentData);

      const token = localStorage.getItem("token");

      // Send POST request to backend with credentials to include HttpOnly cookies
      const response = await fetch("http://127.0.0.1:8000/appointments/appointments", {
        method: "POST",
        credentials: "include", // This ensures cookies are sent with the request
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Ensure token is available
        },
        body: JSON.stringify(appointmentData)
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        // If the error is due to authentication, redirect to login
        if (response.status === 401) {
          setError("You must be logged in to book an appointment");
          setTimeout(() => {
            navigate("/", { 
              state: { 
                redirectAfterLogin: "/appointmentform",
                appointmentData: { counselor, selectedDate, selectedTime }
              } 
            });
          }, 2000);
          return;
        }
        throw new Error(data.detail || "Failed to book appointment");
      }

      function showSafeSpaceAlert(counselor, selectedDate, selectedTime, appointmentId) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'safespace-modal-overlay';
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'safespace-modal';
        
        // Modal content
        modal.innerHTML = `
          <div class="safespace-modal-header">
            <h3 class="safespace-modal-title">Appointment Confirmed!</h3>
          </div>
          <div class="safespace-modal-body">
            <div class="safespace-appointment-info">
              <div class="safespace-info-item">
                <div class="safespace-info-label">Counselor:</div>
                <div class="safespace-info-value">${counselor || "N/A"}</div>
              </div>
              <div class="safespace-info-item">
                <div class="safespace-info-label">Date:</div>
                <div class="safespace-info-value">${selectedDate || "N/A"}</div>
              </div>
              <div class="safespace-info-item">
                <div class="safespace-info-label">Time:</div>
                <div class="safespace-info-value">${selectedTime || "N/A"}</div>
              </div>
            </div>
            <div class="safespace-appointment-id">Appointment ID: ${appointmentId || "Generated"}</div>
          </div>
          <button class="safespace-modal-button">OK</button>
        `;
        
        // Add to DOM
        document.body.appendChild(overlay);
        overlay.appendChild(modal);
        
        // Close on button click
        const button = modal.querySelector('.safespace-modal-button');
        button.addEventListener('click', () => {
          document.body.removeChild(overlay);
          // You can add redirection logic here
          // window.location.href = '/dashboard';
        });
      }

      // Success - show message and redirect
      showSafeSpaceAlert(
        counselor?.name || "N/A",
        selectedDate || "N/A",
        selectedTime || "N/A",
        data.appointment_id || "Generated"
      );
      
      // Navigate to a confirmation page or dashboard
      navigate("/appointments", { 
        state: { 
          appointmentId: data.appointment_id,
          counselorName: counselor?.name,
          date: selectedDate,
          time: selectedTime
        } 
      });
    } catch (err) {
      setError(err.message || "An error occurred while booking the appointment");
      console.error("Appointment booking error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Handle "Back" button
  const handleBack = () => {
    navigate(-1); // Go back one page
  };

  return (
    <div className="appointment-form-container">
      {/* ---------- NAVBAR ---------- */}
      <Navbar2 />

      {/* ---------- MAIN CONTENT AREA ---------- */}
      <div className="appointment-content">
        {/* LEFT PANEL - Info about the appointment */}
        <div className="appointment-info">
          <button className="back-button" onClick={handleBack}>
            <span className="back-arrow">&#8592;</span>
          </button>

          <h2>{counselor?.name || "Dr. Counselor Name"}</h2>
          <p>
            {counselor?.experience
              ? `${counselor.experience} years experience`
              : "30 mins"}
          </p>
          {/* You can combine date & time into a single string, or show them separately */}
          <p>
            {selectedTime || "02:30pm"} - {add30Minutes(selectedTime || "02:30 PM")},{" "}</p>
          <p>
            {selectedDate || "Thursday, August 10th"}
          </p>
        </div>

        {/* RIGHT PANEL - Form to collect user details */}
        <div className="appointment-details">
          <h3>Enter Details</h3>
          {error && <div className="error-message">{error}</div>}
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
              <textarea
                placeholder="Please describe your reason for consultation"
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="confirm-button" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Confirm"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AppointmentForm;