import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/login.css'; // Reusing the same CSS file since layout is similar
import safespaceLogoText from '../assets/logo.png'; // Logo text
import brainFlowerIcon from '../assets/logo.png'; // Brain flower logo in top right
import leftScooterImage from '../assets/login_left_img.png'; // Person on scooter
import rightPlayingImage from '../assets/login_right_img.png'; // Person playing with pet

const Signup = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Basic validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, username, password }),
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create account');
            }

            // On successful signup, redirect to login
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Left section with logo text and scooter illustration */}
            <div className="left-section">
                <div className="logo-text">
                    <img src={safespaceLogoText} alt="SafeSpace Logo" />
                </div>
                <div className="left-illustration">
                    <img src={leftScooterImage} alt="Person on scooter" />
                </div>
            </div>
            
            {/* Right section with brain flower icon and playing illustration */}
            <div className="right-section">
                <div className="brain-flower-icon">
                    <img src={brainFlowerIcon} alt="Brain flower icon" />
                </div>
                <div className="right-illustration">
                    <img src={rightPlayingImage} alt="Person playing with pet" />
                </div>
            </div>
            
            {/* Center signup form */}
            <div className="login-form-wrapper">
                <div className="login-form">
                    <div className="form-header">
                        <p className="welcome-text">Welcome to SafeSpace</p>
                        <h1 className="sign-in-heading">Sign up</h1>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Enter email address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="username">Create Password</label>
                            <input
                                id="username"
                                type="text"
                                placeholder="User name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password">Confirm Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        
                        {error && <div className="error-message">{error}</div>}
                        
                        <button type="submit" className="sign-in-btn" disabled={loading}>
                            {loading ? 'Signing up...' : 'Sign Up'}
                        </button>
                        
                        <div className="no-account">
                            <span>Already have an account?</span>
                            <a href="/login">Sign in</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;