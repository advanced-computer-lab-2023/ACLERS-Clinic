import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  // Define a state variable to track whether the Navbar is open or closed
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  // Function to toggle the Navbar's visibility
  const toggleNavbar = () => {
    console.log("Toggle Navbar Clicked");
    console.log("Before Toggle:", isNavbarOpen);
    setIsNavbarOpen(!isNavbarOpen);
    console.log("After Toggle:", isNavbarOpen);
  };

  return (
    <nav className={`navbar ${isNavbarOpen ? "open" : ""}`}>
      <div className="navbar-logo">
        <img src="logo.png" alt="Logo" />
      </div>
      <div className="navbar-profile">
        <img src="profile-icon.png" alt="Profile" />
        <p>User Name</p>
      </div>
      <ul className="navbar-menu">
        <li>
          <Link to="/family-members">Family Members</Link>
        </li>
        <li>
          <Link to="/health-packages">Health Packages</Link>
        </li>
        <li>
          <Link to="/doctors">Doctors</Link>
        </li>
        <li>
          <Link to="/prescription">Prescription</Link>
        </li>
      </ul>
      <button className="navbar-toggle" onClick={toggleNavbar}>
        Toggle me
      </button>
    </nav>
  );
};

export default Navbar;
