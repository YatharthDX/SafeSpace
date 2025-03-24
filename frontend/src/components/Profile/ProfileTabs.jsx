import React from 'react';

const ProfileTabs = ({ activeTab, onTabChange }) => {
    return (
        <div className="profile-nav">
            <button 
                className={`nav-tab ${activeTab === 'posts' ? 'active' : ''}`}
                onClick={() => onTabChange('posts')}
            >
                My posts
            </button>
            <button 
                className={`nav-tab ${activeTab === 'appointments' ? 'active' : ''}`}
                onClick={() => onTabChange('appointments')}
            >
                 Appointments status
            </button>
        </div>
    );
};

export default ProfileTabs; 