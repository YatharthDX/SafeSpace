import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Login from "./pages/Login";
import "./App.css";
import Home from "./pages/Home.jsx";
import Appointments from "./pages/AppointmentsHome.jsx";
import Chat from "./pages/Chat.jsx";
import Profile from "./pages/Profile.jsx";
import AppointmentsSelect from "./pages/AppointmentsSelect.jsx";
import AppointmentForm from "./pages/AppointmentForm";
import Signup from "./pages/Signup";
import CreatePostPage from "./pages/CreatePost";
import AvailabilityCalendar from "./pages/CounselorAvailability";
import AppointmentRequests from "./pages/AppointmentRequests";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/Public/ProtectedRoute";
import ResetPassword from "./pages/ResetPassword";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointselect" element={<AppointmentsSelect />} />
          <Route path="/appointmentform" element={<AppointmentForm />} />
          <Route path="/counselor/dashboard" element={<AvailabilityCalendar />} />
          <Route path="/counselor/requests" element={<AppointmentRequests />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/createpost" element={<CreatePostPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div>
        <header>
          <link rel="icon" href="./assets/logo.png" type="image/png" />
          <title>SafeSpace</title>
        </header>
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
