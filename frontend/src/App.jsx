import React from "react";
import { BrowserRouter } from "react-router-dom"; //  Wrap the app with BrowserRouter
import Navbar from "./components/Public/navbar"; // Ensure correct path to Navbar
import "./App.css"; // Import global styles
import Login from "./pages/Login"; // Ensure correct path to Login


function App() {
  return (
    <BrowserRouter> {/* Required for React Router to work */}
      <div>
        <Login /> {/* Navbar always visible on top */}
        <h1>SafeSpace</h1>
      </div>
    </BrowserRouter>
  );
}

export default App;
