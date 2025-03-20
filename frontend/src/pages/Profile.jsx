import React, { useState } from 'react';
import Navbar from '../components/Public/navbar';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileTabs from '../components/Profile/ProfileTabs';
import PostsList from '../components/Profile/PostsList';
import AppointmentsList from '../components/Profile/AppointmentsList';
import '../css/profile.css';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('appointments');
    const [hasRequestedRole, setHasRequestedRole] = useState(false);
    const [posts, setPosts] = useState([]);
    const [pastAppointments] = useState([
        {
            id: 1,
            time: '09:00am - 09:30am',
            doctor: 'Dr.Steve John',
            date: '10th August, Thursday'
        },
        {
            id: 2,
            time: '10:00am - 10:30am',
            doctor: 'Dr.Steve John',
            date: '28th July, Friday'
        }
    ]);

    const handleRoleRequest = () => {
        //add api request here
        alert('Role request sent!');
        setHasRequestedRole(true);
    };

    return (
        <div className="profile-page">
            <Navbar />

            <div className="profile-container">
                <ProfileHeader 
                    username="Playful Raccoon"
                    hasRequestedRole={hasRequestedRole}
                    onRoleRequest={handleRoleRequest}
                />

                <ProfileTabs 
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                <div className="profile-content">
                    {activeTab === 'posts' ? (
                        <PostsList posts={posts} />
                    ) : (
                        <AppointmentsList appointments={pastAppointments} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
