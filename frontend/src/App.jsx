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
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      
      
        
      </div>
    </BrowserRouter>
  );
}

export default App;
