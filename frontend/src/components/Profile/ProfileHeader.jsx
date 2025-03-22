import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const ProfileHeader = ({ username, hasRequestedRole, onRoleRequest }) => {
    
    return (
        <div className="profile-header">
            <div className="profile-info">
                <div className="profile-picture">
                    <FaUserCircle className="profile-icon" />
                </div>
                <h1 className="profile-name">{username}</h1>
            </div>
            {hasRequestedRole ? (
                <div className="role-status">Requested</div>
            ) : (
                <button className="request-role-btn" onClick={onRoleRequest}>
                    <span>+</span> Request counsellor role
                </button>
            )}
        </div>
    );
};

export default ProfileHeader; 