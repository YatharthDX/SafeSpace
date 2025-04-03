import React from "react";
import { FaClock, FaUser, FaFileAlt } from "react-icons/fa";

const AppointmentsList = ({ appointments = [] }) => {
  // Function to determine status class
  const getStatusClass = (status) => {
    switch (status) {
      case "accepted":
        return "status-accepted";
      case "rejected":
        return "status-rejected";
      case "pending":
      default:
        return "status-pending";
    }
  };

  return (
    <section className="appointments-section">
      <header className="appointments-header">
        <h2>Appointments' Status</h2>
        <span className="appointment-count">
          {appointments.length}{" "}
          {appointments.length === 1 ? "appointment" : "appointments"}
        </span>
      </header>

      <ul className="appointments-list">
        {appointments.map(({ id, time, doctor, date, status }, index) => (
          <li key={id} className="appointment-item">
            <div className="appointment-index">{index + 1}</div>
            <div className="appointment-info">
              <div className="info-table">
                <div className="info-row">
                  <div className="info-label">Date</div>
                  <div className="info-divider">:</div>
                  <div className="info-value highlighted">{date}</div>
                </div>
                <div className="info-row">
                  <div className="info-label">Time</div>
                  <div className="info-divider">:</div>
                  <div className="info-value highlighted">{time}</div>
                </div>
                <div className="info-row">
                  <div className="info-label">Counsellor Email</div>
                  <div className="info-divider">:</div>
                  <div className="info-value">
                    <FaUser className="icon" /> {doctor}
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-label">Status</div>
                  <div className="info-divider">:</div>
                  <div className={`info-value ${getStatusClass(status)}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </div>
                </div>
              </div>
              {/* <button className="view-documents-btn">
                <FaFileAlt className="icon" /> View Documents
              </button> */}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AppointmentsList;
