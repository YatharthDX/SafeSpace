import React from 'react';
import { FaClock, FaUser, FaFileAlt } from 'react-icons/fa';

const AppointmentsList = ({ appointments = [] }) => {
  if (appointments.length === 0) {
    return (
      <div className="empty-state">
        No appointments found. Your past appointments will appear here.
      </div>
    );
  }

  return (
    <section className="appointments-section">
      <header className="appointments-header">
        <h2>Past Appointments</h2>
        <span className="appointment-count">
          {appointments.length} {appointments.length === 1 ? 'appointment' : 'appointments'}
        </span>
      </header>

      <ul className="appointments-list">
        {appointments.map(({ id, time, doctor, date }) => (
          <li key={id} className="appointment-item">
            <div className="appointment-index">{id}</div>
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
                  <div className="info-label">Doctor</div>
                  <div className="info-divider">:</div>
                  <div className="info-value">
                    <FaUser className="icon" /> {doctor}
                  </div>
                </div>
              </div>
              <button className="view-documents-btn">
                <FaFileAlt className="icon" /> View Documents
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AppointmentsList;
