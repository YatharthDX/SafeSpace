import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom"; //  Wrap the app with BrowserRouter
import Login from "./pages/Login"; // Ensure correct path to Navbar
// import Navbar from "./components/Public/navbar";
import "./App.css"; // Import global styles
import Home from "./pages/Home.jsx"; // Import Home page
import Appointments from "./pages/AppointmentsHome.jsx"; // Import the Appointments page
import Chat from "./pages/Chat.jsx";
import Profile from "./pages/Profile.jsx";
import AppointmentsSelect from "./pages/AppointmentsSelect.jsx";
import AppointmentForm from "./pages/AppointmentForm";
import Signup from "./pages/Signup";
import CreatePostPage from "./pages/CreatePost";
import AvailabilityCalendar from "./pages/CounselorAvailability";
import AppointmentRequests from "./pages/AppointmentRequests";

function App() {
  return (
    <BrowserRouter>
      {" "}
      {/* Required for React Router to work */}
      <div>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/appointselect" element={<AppointmentsSelect />} />
          <Route path="/appointmentform" element={<AppointmentForm />} />
          <Route path="/counselor/dashboard" element={<AvailabilityCalendar />} />
          <Route path="/counselor/requests" element={<AppointmentRequests />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/createpost" element={<CreatePostPage/>} />
        </Routes>
      
      
        
      </div>
    </BrowserRouter>
  );
}

export default App;
