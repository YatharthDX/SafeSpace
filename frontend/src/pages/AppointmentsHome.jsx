import React, { useEffect, useState } from "react";
import Navbar2 from "../components/Public/navbar2";
import CounselorCard from "../components/Appointments/CounsellorCard";
import "../css/AppointmentsHome.css";
import { useNavigate, useLocation } from "react-router-dom";

const Appointments = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [counselors, setCounselors] = useState([]);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                // const response = await fetch("http://127.0.0.1:8000/api/auth/getuserdetails");
                const response = await fetch(
                    "http://127.0.0.1:8000/api/auth/getuserdetails",
                    {
                      method: "GET",
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                      },
                    }
                  );
                const data = await response.json();
                console.log(data);
                setUserDetails(data);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
        fetchUserDetails();
    }, []);

    useEffect(() => {
        if (userDetails && userDetails.role === "counsellor") {
            navigate("/home");
        }
    }, [userDetails, navigate]);

    useEffect(() => {
        const fetchCounselors = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/appointments/counselors");
                const data = await response.json();

                const counselorsWithProfilePictures = await Promise.all(
                    data.map(async (counselor, index) => {
                        let profilePicture = "https://avatar.iran.liara.run/public"; // Default image

                        try {
                            const profileResponse = await fetch(`http://127.0.0.1:8000/api/auth/get-profile-picture/${counselor.name}`);
                            if (profileResponse.ok) {
                                const blob = await profileResponse.blob(); // Convert to binary data
                                profilePicture = URL.createObjectURL(blob); // Create image URL

                            }
                        } catch (error) {
                            console.error(`Error fetching profile for ${counselor.name}:`, error);
                        }

                        return {
                            id: index + 1,
                            name: counselor.name,
                            email: counselor.email,
                            description: counselor.description || "No specialization",
                            // experience: Math.floor(Math.random() * 10) + 5, // Dummy experience
                            profile_picture: profilePicture,
                        };
                    })
                );

                setCounselors(counselorsWithProfilePictures);
            } catch (error) {
                console.error("Error fetching counselors:", error);
            }
        };

        fetchCounselors();
    }, []);

    return (
        <>
            <Navbar2 />
            <div className="appointments-container">
                <h1 id="appointments-header">Select a Counsellor</h1>
                <div className="counselor-list">
                    {counselors.map((counselor) => (
                        <CounselorCard key={counselor.id} counselor={counselor} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Appointments;
