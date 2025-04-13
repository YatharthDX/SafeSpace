// import React from 'react';
// import { FaUserCircle } from 'react-icons/fa';

// const ProfileHeader = ({ username, avatar }) => {
//     // Dynamic import of avatar images
//     const avatarImages = {
//         1: () => import('../../assets/1.png'),
//         2: () => import('../../assets/2.png'),
//         3: () => import('../../assets/3.png'),
//         4: () => import('../../assets/4.png'),
//         5: () => import('../../assets/5.png'),
//         6: () => import('../../assets/6.png'),
//         7: () => import('../../assets/7.png'),
//         8: () => import('../../assets/8.png'),
//         9: () => import('../../assets/9.png'),
//         10: () => import('../../assets/10.png')
//     };
    
//     const [avatarSrc, setAvatarSrc] = React.useState(null);


    

//     React.useEffect(() => {
//         const loadAvatar = async () => {
//             if (avatar && avatar !== 0 && avatarImages[avatar]) {
//                 try {
//                     const imageModule = await avatarImages[avatar]();
//                     setAvatarSrc(imageModule.default);
//                 } catch (error) {
//                     console.error(`Failed to load avatar image for ID ${avatar}:`, error);
//                     setAvatarSrc(null);
//                 }
//             }
//         };

//         loadAvatar();
//     }, [avatar]);
    
//     return (
//         <div className="profile-header">
//             <div className="profile-info">
//                 <div className="profile-picture">
//                     {avatarSrc ? (
//                         <img 
//                             src={avatarSrc} 
//                             alt={`${username}'s avatar`} 
//                             className="profile-avatar" 
//                         />
//                     ) : (
//                         <FaUserCircle className="profile-icon" />
//                     )}
//                 </div>
//                 <h1 className="profile-name">{username}</h1>
//             </div>
//         </div>
//     );
// };

// export default ProfileHeader;


import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';

const ProfileHeader = ({ username, avatar }) => {
    const avatarImages = {
        1: () => import('../../assets/1.png'),
        2: () => import('../../assets/2.png'),
        3: () => import('../../assets/3.png'),
        4: () => import('../../assets/4.png'),
        5: () => import('../../assets/5.png'),
        6: () => import('../../assets/6.png'),
        7: () => import('../../assets/7.png'),
        8: () => import('../../assets/8.png'),
        9: () => import('../../assets/9.png'),
        10: () => import('../../assets/10.png')
    };
    
    const [avatarSrc, setAvatarSrc] = React.useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [avatarOptions, setAvatarOptions] = useState({});

    // Load initial avatar
    React.useEffect(() => {
        const loadAvatar = async () => {
            if (avatar && avatar !== 0 && avatarImages[avatar]) {
                try {
                    const imageModule = await avatarImages[avatar]();
                    setAvatarSrc(imageModule.default);
                } catch (error) {
                    console.error(`Failed to load avatar image for ID ${avatar}:`, error);
                    setAvatarSrc(null);
                }
            }
        };

        loadAvatar();
    }, [avatar]);

    // Load all avatar options for popup
    React.useEffect(() => {
        const loadAllAvatars = async () => {
            const loadedAvatars = {};
            for (const [id, importFn] of Object.entries(avatarImages)) {
                try {
                    const module = await importFn();
                    loadedAvatars[id] = module.default;
                } catch (error) {
                    console.error(`Failed to load avatar ${id}:`, error);
                }
            }
            setAvatarOptions(loadedAvatars);
        };
        loadAllAvatars();
    }, []);

    const handleAvatarChange = async (newAvatarId) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/auth/change-avatar', {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`, // Add the auth token
                },
                body: JSON.stringify({ avatar: newAvatarId }),
            });

            if (response.ok) {
                const imageModule = await avatarImages[newAvatarId]();
                setAvatarSrc(imageModule.default);
                setShowPopup(false);
            } else {
                console.error('Failed to change avatar');
            }
        } catch (error) {
            console.error('Error changing avatar:', error);
        }
    };

    return (
        <div className="profile-header">
            <div className="profile-info">
                <div className="profile-picture" onClick={() => setShowPopup(!showPopup)}>
                    {avatarSrc ? (
                        <img 
                            src={avatarSrc} 
                            alt={`${username}'s avatar`} 
                            className="profile-avatar" 
                        />
                    ) : (
                        <FaUserCircle className="profile-icon" />
                    )}
                </div>
                <h1 className="profile-name">{username}</h1>
            </div>

            {showPopup && (
                <div className="avatar-popup">
                    <div className="avatar-grid">
                        {Object.entries(avatarOptions).map(([id, src]) => (
                            <img
                                key={id}
                                src={src}
                                alt={`Avatar ${id}`}
                                className="avatar-option"
                                onClick={() => handleAvatarChange(id)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileHeader;