import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/counselorCard.css";

const CounselorCard = ({ counselor }) => {
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate("/appointselect", {
      state: { counselor },
    });
  };

  return (
    <div className="counselor-card">
      {/* <img src={counselor.profile_picture} alt={counselor.name} className="counselor-image" /> */}
      <img
        src={counselor.profile_picture}
        alt={counselor.name}
        className="counselor-image"
        onError={(e) => {
          console.error("Image failed to load:", counselor.profile_picture);  // Debugging error
          e.target.src = "https://avatar.iran.liara.run/public";  // Fallback
        }}
      />
      <div className="counselor-info">
        <h3 className="counselor-name">{counselor.name}</h3>
        <p className="counselor-specialization">{counselor.description }</p>
        {/* <p className="counselor-experience">{counselor.experience} years experience</p> */}
      </div>
      <div className="counselor-actions">
        <button onClick={handleBooking} className="book-button">
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default CounselorCard;