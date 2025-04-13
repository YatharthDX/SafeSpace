import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../css/login.css';
import brainFlowerIcon from '../assets/logo.png';
import leftScooterImage from '../assets/login_left_img.png';
import rightPlayingImage from '../assets/login_right_img.png';
import { motion } from 'framer-motion'; // 👈 Import Framer Motion

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};

const pageTransition = {
  duration: 0.6,
  ease: "easeInOut",
};

const Login = () => {
    const [showSplash, setShowSplash] = useState(false);
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
            
            if (!response.ok) {
                throw new Error(data.detail || 'Invalid email or password');
            }
            
            if (data.access_token) {
                localStorage.setItem("token", data.access_token);
                sessionStorage.setItem('isAuthenticated', 'true'); 

                // Show splash screen
                setShowSplash(true);
                // Optional delay before navigating for animation smoothness
                setTimeout(() => {
                    navigate('/home');
                }, 200); 
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

      
    return (
        <>
          {/* Splash screen
          {showSplash && (
            <motion.div
              initial={{ scale: 3, opacity: 1 }}
              animate={{ scale: 30, opacity: 0 }}
              transition={{ duration: 5, ease: "easeInOut" }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
              }}
            >
              <img src={brainFlowerIcon} alt="Logo Zoom" style={{ width: 100, height: 100 }} />
            </motion.div>
          )} */}
    
          {/* Login Page */}
          <motion.div
            className="login-container"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <div className="left-section">
              <div className="logo-text">
                <h1>SafeSpace</h1>
              </div>
    
              <div className="left-illustration">
                <img src={leftScooterImage} alt="Person on scooter" />
              </div>
            </div>
    
            <div className="right-section">
              <div className="brain-flower-icon">
                <img src={brainFlowerIcon} alt="Brain flower icon" />
              </div>
              <div className="right-illustration">
                <img src={rightPlayingImage} alt="Person playing with pet" />
              </div>
            </div>
    
            <div className="login-form-wrapper">
              <div className="login-form">
                <div className="form-header">
                  <p className="welcome-text">Welcome to SafeSpace</p>
                  <h1 className="sign-in-heading">Sign In</h1>
                </div>
    
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">Enter email address</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Email address (@iitk.ac.in)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
    
                  <div className="form-group">
                    <label htmlFor="password">Enter Password</label>
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
          </motion.div>
        </>
      );
    };
    
    export default Login;
    