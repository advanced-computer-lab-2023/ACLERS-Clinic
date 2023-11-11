import React from "react";
import { Link, useNavigate } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";

function PatientDashboard() {
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
  console.log("decoded Token:", decodedToken);

  const navigate = useNavigate();

  if (!token) {
    // Handle the case where id is not available
    return <div>ACCESS DENIED, You are not authenticated, please log in</div>;
  }
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Successfully logged out
        localStorage.removeItem("token");
        navigate("/"); // Redirect to the login or home page
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to={`/patient/familymembers`}>Family Members</Link>
          </li>
          <li>
            <Link to={`/patient/appointments`}>View My Appointments</Link>
          </li>
          <li>
            <Link to={`/patient/viewdoctors`}>View Doctors</Link>
          </li>
          <li>
            <Link to={`/patient/view-perscriptions`}>View Perscriptions</Link>
          </li>
          <li>
            <Link to={`/patient/medicalhistory`}>Medical History</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>
      {/* Add content for each section here */}
    </div>
  );
}

export default PatientDashboard;
