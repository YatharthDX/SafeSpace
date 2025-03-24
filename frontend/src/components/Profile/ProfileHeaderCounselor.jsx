import React, { useEffect, useState } from "react";
import { FaUserCircle } from 'react-icons/fa';

const ProfileHeader = ({ username, hasRequestedRole, onRoleRequest }) => {
    const [profilePicture, setProfilePicture] = useState();

    useEffect(() => {
        const fetchProfilePicture = async () => {
            try {
                const profileResponse = await fetch(`http://127.0.0.1:8000/api/auth/get-profile-picture/${username}`);
                if (profileResponse.ok) {
                    const blob = await profileResponse.blob();
                    setProfilePicture(URL.createObjectURL(blob));
                }
            } catch (error) {
                console.error(`Error fetching profile for ${username}:`, error);
            }
        };

        fetchProfilePicture();
    }, [username]);
    
    return (
        <div className="profile-header">
            <div className="profile-info">
            <div className="profile-picture">
                    {profilePicture ? (
                        <img src={profilePicture} alt={`${username}'s profile`} className="profile-icon" />
                    ) : (
                        <FaUserCircle className="profile-icon" />
                    )}
                </div>
                <h1 className="profile-name">{username}</h1>
            </div>
        </div>
    );
};

export default ProfileHeader; 