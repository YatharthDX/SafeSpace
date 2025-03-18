import React from "react";
import Navbar from "../components/Public/navbar";
import CounselorCard from "../components/Appointments/CounsellorCard";

const counselors = [
  {
    id: 1,
    name: "Dr. John Doe",
    specialization: "Psychologist",
    experience: 10,
    image: "https://avatar.iran.liara.run/public",
  },
  {
    id: 2,
    name: "Dr. Sarah Smith",
    specialization: "Therapist",
    experience: 8,
    image: "https://avatar.iran.liara.run/public",
  },
  {
    id: 3,
    name: "Dr. Mark Johnson",
    specialization: "Counselor",
    experience: 12,
    image: "https://avatar.iran.liara.run/public",
  },
];

const Appointments = () => {
  return (
    <>
      <Navbar />
      <div>
        <h1 id="appointments-header">Select a Counselor</h1>
        <div className="counselor-list">
          {counselors.map((counselor, index) => (
            <CounselorCard key={index} counselor={counselor} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Appointments;
