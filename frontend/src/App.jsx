import React from "react";
import { BrowserRouter,Route,Routes } from "react-router-dom"; //  Wrap the app with BrowserRouter
import Navbar from "./components/Public/navbar"; // Ensure correct path to Navbar
import "./App.css"; // Import global styles
// import Home from "./pages/Home.jsx"; // Import Home page
import Appointments from "./pages/Appointments.jsx"; // Import the Appointments page
import Chat from "./pages/Chat.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
  return (
    <BrowserRouter> {/* Required for React Router to work */}
      <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
        {/* <Home/> */}
        <h1>SafeSpace</h1>
      </div>
    </BrowserRouter>
  );
}

export default App;