import React from "react";
import Navbar from "../components/Public/navbar";
import CounselorCard from "../components/Appointments/CounsellorCard";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useState } from "react";
import "../css/AppointmentsHome.css";

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
  {
    id: 4,
    name: "Dr. Emily Davis",
    specialization: "Clinical Psychologist",
    experience: 15,
    image: "https://avatar.iran.liara.run/public",
  },
  {
    id: 5,
    name: "Dr. Robert Brown",
    specialization: "Mental Health Therapist",
    experience: 9,
    image: "https://avatar.iran.liara.run/public",
  },
  {
    id: 6,
    name: "Dr. Olivia Wilson",
    specialization: "Marriage Counselor",
    experience: 11,
    image: "https://avatar.iran.liara.run/public",
  },
  {
    id: 7,
    name: "Dr. William Taylor",
    specialization: "Child Psychologist",
    experience: 13,
    image: "https://avatar.iran.liara.run/public",
  },
  {
    id: 8,
    name: "Dr. Sophia Martinez",
    specialization: "Behavioral Therapist",
    experience: 7,
    image: "https://avatar.iran.liara.run/public",
  },
  {
    id: 9,
    name: "Dr. James Anderson",
    specialization: "Substance Abuse Counselor",
    experience: 14,
    image: "https://avatar.iran.liara.run/public",
  },
  {
    id: 10,
    name: "Dr. Charlotte Thomas",
    specialization: "Cognitive Behavioral Therapist",
    experience: 10,
    image: "https://avatar.iran.liara.run/public",
  },
];

const role = "counselor";

const Appointments = () => {
  if (role === "counselor") {
    const [dispState, setDispState] = useState("calendar");
    return (
      <>
        <Navbar />
        <Sidebar>
          <Menu>
            <MenuItem onClick={() => setDispState("calendar")}>
              {" "}
              Calendar{" "}
            </MenuItem>
            <MenuItem onClick={() => setDispState("appointments")}>
              {" "}
              Appointments{" "}
            </MenuItem>
          </Menu>
        </Sidebar>
        {dispState === "calendar" && (
          <>
            
          </>
        )}
        {dispState === "appointments" && <h1>Appointments</h1>}
      </>
    );
  } else if (role === "user") {
    return (
      <>
        <Navbar />
        <div>
          <h1 id="appointments-header">Select a Counselor</h1>
          <div
            className="counselor-list"
            style={{
              maxHeight: "700px", // Adjust height as needed
              overflowY: "auto",
              // border: "1px solid #ccc", // Optional: adds a border for better visibility
              padding: "10px",
            }}
          >
            {counselors.map((counselor, index) => (
              <CounselorCard key={index} counselor={counselor} />
            ))}
          </div>
        </div>
      </>
    );
  }
};

export default Appointments;