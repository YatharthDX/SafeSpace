import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';
import brainFlowerIcon from '../assets/logo.png';
import leftScooterImage from '../assets/login_left_img.png';
import rightPlayingImage from '../assets/login_right_img.png';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
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
            // First, send OTP to the user's email
            const otpResponse = await fetch('http://localhost:8000/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: email,
                    requestType: 'signup'
                }),
                credentials: 'include',
            });

            if (!otpResponse.ok) {
                const otpErrorData = await otpResponse.json();
                throw new Error(otpErrorData.message || 'Failed to send OTP');
            }
            
            // If OTP was sent successfully, show the OTP verification modal
            setShowOtpModal(true);
            setError('');
        } catch (err) {
            console.error('Error sending OTP:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: email,
                    requestType: 'signup'
                }),
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to resend OTP');
            }
            
            alert('OTP has been resent to your email');
            setError('');
        } catch (err) {
            console.error('Error resending OTP:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);

        try {
            // First verify the OTP
            const verifyResponse = await fetch('http://localhost:8000/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: email,
                    otp: otp,
                    requestType: 'signup'
                }),
                credentials: 'include',
            });

            if (!verifyResponse.ok) {
                const verifyData = await verifyResponse.json();
                throw new Error(verifyData.message || 'Invalid OTP');
            }

            // If OTP is valid, proceed with registration
            const registerResponse = await fetch('http://localhost:8000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: email, 
                    password: password, 
                    name: username
                }),
                credentials: 'include',
            });

            if (!registerResponse.ok) {
                const registerData = await registerResponse.json();
                throw new Error(registerData.message || 'Failed to create account');
            }

            // If registration is successful, redirect to login
            alert('Account created successfully! Please log in.');
            navigate('/');
        } catch (err) {
            console.error('Error during verification/registration:', err);
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
            
            {/* Center signup form */}
            <div className="login-form-wrapper">
                <div className="login-form">
                    {!showOtpModal ? (
                        <>
                            <div className="form-header">
                                <p className="welcome-text">Welcome to SafeSpace</p>
                                <h1 className="sign-in-heading">Sign up</h1>
                            </div>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="email" style={{ textAlign: "left", display: "block" }}>Enter email address</label>
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
                                    <label htmlFor="username" style={{ textAlign: "left", display: "block" }}>Enter Username</label>
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
                                    <label htmlFor="password" style={{ textAlign: "left", display: "block" }}>Password</label>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <br />
                                    <br />
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (password && e.target.value !== password) {
                                                setError('Passwords do not match');
                                            } else {
                                                setError('');
                                            }
                                        }}
                                        required
                                    />
                                </div>
                                
                                {error && <div className="error-message">{error}</div>}
                                
                                <button type="submit" className="sign-in-btn" disabled={loading}>
                                    {loading ? 'Sending OTP...' : 'Sign Up'}
                                </button>
                                
                                <div className="no-account">
                                    <span>Already have an account?</span>
                                    <a href="/login">Sign in</a>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="otp-verification">
                            <div className="form-header">
                                <h1 className="sign-in-heading">Verify OTP</h1>
                                <p>We've sent a verification code to your email address.</p>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="otp-input" style={{ textAlign: "left", display: "block" }}>Enter OTP</label>
                                <input
                                    id="otp-input"
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => {
                                        // Only allow numbers
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        // Limit to 6 digits
                                        if (value.length <= 6) {
                                            setOtp(value);
                                        }
                                    }}
                                    maxLength="6"
                                    required
                                />
                            </div>
                            
                            {error && <div className="error-message">{error}</div>}
                            
                            <button 
                                onClick={verifyOtp} 
                                className="sign-in-btn" 
                                disabled={loading}
                            >
                                {loading ? 'Verifying...' : 'Verify & Register'}
                            </button>
                            
                            <div className="no-account">
                                <span>Didn't receive OTP?</span>
                                <button 
                                    onClick={resendOtp} 
                                    className="resend-otp-btn"
                                    disabled={loading}
                                    style={{ 
                                        background: 'none', 
                                        border: 'none', 
                                        color: '#0066cc', 
                                        textDecoration: 'underline', 
                                        cursor: 'pointer' 
                                    }}
                                >
                                    Resend OTP
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Signup;