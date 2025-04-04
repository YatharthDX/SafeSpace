import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../css/login.css';
import brainFlowerIcon from '../assets/logo.png'; // Brain flower logo in top right
import leftScooterImage from '../assets/login_left_img.png'; // Person on scooter
import rightPlayingImage from '../assets/login_right_img.png'; // Person playing with pet

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.detail || 'Invalid email or password');
            }
            if (data.access_token) {
                localStorage.setItem("token", data.access_token);
            }

            sessionStorage.setItem('isAuthenticated', 'true'); // Store session state
            navigate('/home');
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
                <h1>SafeSpace</h1>
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
            
            {/* Center login form */}
            <div className="login-form-wrapper">
                <div className="login-form">
                    <div className="form-header">
                        <p className="welcome-text">Welcome to SafeSpace</p>
                        <h1 className="sign-in-heading">Sign In</h1>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email" style={{ textAlign: "left", display: "block" }} >Enter email address</label>
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
                            <label htmlFor="password" style={{ textAlign: "left", display: "block" }}>Enter Password</label>
                            <div className="password-field">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button 
                                    type="button" 
                                    className="toggle-password" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        
                        <div className="forgot-password">
                            <a href="/forgot-password">Forgot Password</a>
                        </div>
                        
                        {error && <div className="error-message">{error}</div>}
                        
                        <button type="submit" className="sign-in-btn" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                        
                        <div className="no-account">
                            <span>No Account ?</span>
                            <a href="/signup">Sign up</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;