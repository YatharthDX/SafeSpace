import React from "react";

const CounselorCard = (counselor) => {
  return (
    <div className="CounselorCard bg-white p-4 rounded-lg shadow-lg text-center">
      <img
        src={counselor.image}
        alt={counselor.name}
        className="w-16 h-16 rounded-full mx-auto object-cover"
      />
      <h2 className="mt-2 text-lg font-semibold">{counselor.name}</h2>
      <p className="text-gray-600 text-sm">
        {counselor.specialization} | {counselor.experience} years experience
      </p>
      <button
        className="mt-4 w-full bg-yellow-400 text-white py-2 rounded-lg hover:bg-yellow-500 transition"
        onClick={showTimings}
      >
        Book an Appointment
      </button>
    </div>
  );
};

export default CounselorCard;
