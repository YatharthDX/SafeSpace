import React from "react";
import "../../css/counselorCard.css"; // Import CSS file

const CounselorCard = ({ counselor }) => {
  return (
    <div className="counselor-card-container">
      <div className="counselor-card">
        <img src={counselor.image} alt={counselor.name} className="counselor-image" />
        <h2 className="counselor-name">{counselor.name}</h2>
        <p className="counselor-info">
          {counselor.specialization} | {counselor.experience} years experience
        </p>
        <button className="book-btn" onClick={() => alert(`Booking appointment with ${counselor.name}`)}>
          Book an Appointment
        </button>
      </div>
    </div>
  );
};

export default CounselorCard;
