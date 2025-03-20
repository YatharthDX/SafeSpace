import React from 'react';
import { FaClock, FaUser } from 'react-icons/fa';

const AppointmentsList = ({ appointments }) => {
    return (
        <div className="appointments-section">
            {appointments.map((appointment) => (
                <div key={appointment.id} className="appointment-item">
                    <div className="appointment-index">{appointment.id}</div>
                    <div className="appointment-details">
                        <div className="appointment-info">
                            <div className="time-slot">
                                <FaClock className="icon" />
                                {appointment.time}
                            </div>
                            <div className="doctor-name">
                                <FaUser className="icon" />
                                {appointment.doctor}
                            </div>
                        </div>
                        <div className="appointment-actions">
                            <a href="#" className="view-documents">View Documents</a>
                        </div>
                    </div>
                    <div className="appointment-date">
                        {appointment.date}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AppointmentsList; 