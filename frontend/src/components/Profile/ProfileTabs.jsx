import React from 'react';

const ProfileTabs = ({ activeTab, onTabChange }) => {
    return (
        <div className="profile-nav">
            <button 
                className={`nav-tab ${activeTab === 'posts' ? 'active' : ''}`}
                onClick={() => onTabChange('posts')}
            >
                Posts
            </button>
            <button 
                className={`nav-tab ${activeTab === 'appointments' ? 'active' : ''}`}
                onClick={() => onTabChange('appointments')}
            >
                Past Appointments
            </button>
        </div>
    );
};

export default ProfileTabs; 