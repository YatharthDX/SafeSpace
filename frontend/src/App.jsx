import React from "react";
import { BrowserRouter } from "react-router-dom"; //  Wrap the app with BrowserRouter
import Navbar from "./components/public/navbar"; // Ensure correct path to Navbar
import "./App.css"; // Import global styles
// import Home from "./pages/Home.jsx"; // Import Home page

function App() {
  return (
    <BrowserRouter> {/* Required for React Router to work */}
      <div>
        <Navbar /> 
        {/* <Home/> */}
        <h1>SafeSpace</h1>
      </div>
    </BrowserRouter>
  );
}

export default App;