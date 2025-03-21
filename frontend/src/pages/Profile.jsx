import React, { useState } from 'react';
import Navbar2 from '../components/Public/navbar2';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileTabs from '../components/Profile/ProfileTabs';
import PostsList from '../components/Profile/PostsList';
import AppointmentsList from '../components/Profile/AppointmentsList';
import '../css/profile.css';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('posts');
    const [hasRequestedRole, setHasRequestedRole] = useState(false);
    
    // Sample posts data - you can set this to [] to test the empty state
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: 'Playful Raccoon',
            time: '2 hours ago',
            title: 'My healthcare journey',
            content: 'Just had a great appointment with Dr. Smith. The new treatment plan looks promising!',
            tags: ['healthcare', 'wellness']
        },
        {
            id: 2,
            author: 'Playful Raccoon',
            time: '2 days ago',
            content: 'Does anyone have recommendations for good nutrition resources?',
            tags: ['nutrition', 'advice']
        }
    ]);
    
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

    const handleDeletePost = (postId) => {
        // Filter out the deleted post
        setPosts(posts.filter(post => post.id !== postId));
        // In a real application, you would also make an API call here
    };

    return (
        <div className="profile-page">
            <Navbar2 />

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
                        <PostsList 
                            posts={posts} 
                            onDeletePost={handleDeletePost} 
                        />
                    ) : (
                        <AppointmentsList appointments={pastAppointments} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;