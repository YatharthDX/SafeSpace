import React from 'react';

const ProfileTabs = ({ activeTab, onTabChange, userRole }) => {
    return (
        <div className="profile-nav">
            <button 
                className={`nav-tab ${activeTab === 'posts' ? 'active' : ''}`}
                onClick={() => onTabChange('posts')}
            >
                My posts
            </button>
            {userRole !== 'counsellor' && (
                <button 
                    className={`nav-tab ${activeTab === 'appointments' ? 'active' : ''}`}
                    onClick={() => onTabChange('appointments')}
                >
                    Appointments status
                </button>
            )}
            <button 
                className={`nav-tab ${activeTab === 'others' ? 'active' : ''}`}
                onClick={() => onTabChange('others')}
            >
                Others
            </button>

        </div>
    );
};

export default ProfileTabs; 