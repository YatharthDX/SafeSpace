import React from "react";
import { BrowserRouter } from "react-router-dom"; //  Wrap the app with BrowserRouter
import Navbar from "./components/Public/navbar.jsx"; // Ensure correct path to Navbar
import "./App.css"; // Import global styles
import Home from "./pages/Home.jsx"; // Ensure correct path to Home

function App() {
  return (
    <BrowserRouter> {/* Required for React Router to work */}
      <div>
        <Home /> 
        {/* <Home/> */}
        {/* <h1>SafeSpace</h1> */}
      </div>
    </BrowserRouter>
  );
}

export default App;