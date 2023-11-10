import React from "react";
import { Link, useLocation } from "react-router-dom";

function PatientDashboard() {
  const location = useLocation();
  const id = location.state?.id;
  if (!id) {
    // Handle the case where id is not available
    return <div>No user ID found</div>;
  }

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
            <Link to={`/patient/view-perscriptions`}>View perscriptions</Link>
          </li>
          <li>
            <Link to={`/patient/medicalhistory`}>Medical History</Link>
          </li>
          <li>
            <Link to={`/`}>Logout</Link>
          </li>
        </ul>
      </nav>
      {/* Add content for each section here */}
    </div>
  );
}

export default PatientDashboard;
