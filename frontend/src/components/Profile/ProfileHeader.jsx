import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const ProfileHeader = ({ username }) => {
    
    return (
        <div className="profile-header">
            <div className="profile-info">
                <div className="profile-picture">
                    <FaUserCircle className="profile-icon" />
                </div>
                <h1 className="profile-name">{username}</h1>
            </div>
        </div>
    );
};

export default ProfileHeader; 