import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../css/login.css';
import brainFlowerIcon from '../assets/logo.png'; // Brain flower logo in top right
import leftScooterImage from '../assets/login_left_img.png'; // Person on scooter
import rightPlayingImage from '../assets/login_right_img.png'; // Person playing with pet

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState('email'); // email, otp, resetPassword
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState(null);
  const [successAlert, setSuccessAlert] = useState(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const showTemporaryAlert = (message, type = 'info') => {
    setAlert({ message, type });
  };

  const showSuccessAlertModal = (title, message) => {
    setSuccessAlert({ title, message });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            requestType: "forgot"
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }
      
      showTemporaryAlert('OTP sent to your email');
      setCurrentStep('otp');
    } catch (err) {
      showTemporaryAlert(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            otp: otp,
            requestType: "forgot"
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }
      
      showTemporaryAlert('OTP verified successfully');
      setCurrentStep('resetPassword');
    } catch (err) {
      showTemporaryAlert(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      showTemporaryAlert('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      showTemporaryAlert('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email, 
          password: newPassword 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }
      
      showSuccessAlertModal('Password Reset Successful', 'Your password has been reset successfully. You can now log in with your new password.');
      
      // Will redirect to login page after clicking the success alert button
    } catch (err) {
      showTemporaryAlert(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getTitleText = () => {
    switch(currentStep) {
      case 'email': return 'Reset Password';
      case 'otp': return 'Verify OTP';
      case 'resetPassword': return 'Reset Password';
      default: return 'Reset Password';
    }
  };

  const getSubtitleText = () => {
    switch(currentStep) {
      case 'email': return 'Enter your email to receive a verification code';
      case 'otp': return 'Enter the OTP sent to your email';
      case 'resetPassword': return 'Create a new password for your account';
      default: return '';
    }
  };

  return (
    <div className="login-container">
      {/* Left section */}
      <div className="left-section">
        <div className="logo-text">
          <h1>SafeSpace</h1>
        </div>
        <div className="left-illustration">
          <img src={leftScooterImage} alt="Person on scooter" />
        </div>
      </div>
      
      {/* Right section */}
      <div className="right-section">
        <div className="brain-flower-icon">
          <img src={brainFlowerIcon} alt="Brain flower icon" />
        </div>
        <div className="right-illustration">
          <img src={rightPlayingImage} alt="Person playing" />
        </div>
      </div>
      
      {/* Form in the middle */}
      <div className="login-form-wrapper">
        <div className="login-form">
          <div className="form-header">
            <p className="welcome-text">{getSubtitleText()}</p>
            <h2 className="sign-in-heading">{getTitleText()}</h2>
          </div>
          
          {/* Email Form */}
          {currentStep === 'email' && (
            <form onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label htmlFor="email" style={{ textAlign: "left", display: "block" }}>Registered Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your registered email"
                />
              </div>
              
              <button type="submit" className="sign-in-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
              
              <div className="no-account">
                <span>Remember your password?</span>
                <a href="/">Sign In</a>
              </div>
            </form>
          )}
          
          {/* OTP Verification Form */}
          {currentStep === 'otp' && (
            <form onSubmit={handleOTPVerify}>
              <div className="form-group">
                <label htmlFor="otp">Verification Code</label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="Enter OTP"
                />
              </div>
              
              <button type="submit" className="sign-in-btn" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              
              <div className="no-account">
                <span>Didn't receive the code?</span>
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  handleEmailSubmit(e);
                }}>Resend OTP</a>
              </div>
              
              <div className="forgot-password">
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  setCurrentStep('email');
                }}>Back to email</a>
              </div>
            </form>
          )}
          
          {/* Reset Password Form */}
          {currentStep === 'resetPassword' && (
            <form onSubmit={handlePasswordReset}>
              <div className="form-group">
                <label htmlFor="new-password">New Password</label>
                <div className="password-field">
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                  />
                  <button 
                    type="button" 
                    className="toggle-password" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <div className="password-field">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                  />
                  <button 
                    type="button" 
                    className="toggle-password" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              <button type="submit" className="sign-in-btn" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
              
              <div className="forgot-password">
                <a href="/login">Back to login</a>
              </div>
            </form>
          )}
        </div>
      </div>
      
      {/* Temporary alert */}
      {alert && (
        <div className={`custom-alert ${alert.type === 'info' ? 'custom-alert-info' : ''}`}>
          <div className="custom-alert-content">
            <span>{alert.message}</span>
            <button className="custom-alert-close" onClick={() => setAlert(null)}>×</button>
          </div>
        </div>
      )}
      
      {/* Success alert modal */}
      {successAlert && (
        <div className="custom-alert-overlay">
          <div className="custom-success-alert">
            <div className="success-icon">✓</div>
            <h2>{successAlert.title}</h2>
            <p>{successAlert.message}</p>
            <button 
              className="close-alert-btn" 
              onClick={() => {
                setSuccessAlert(null);
                window.location.href = '/home';
              }}
            >
              Go to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;