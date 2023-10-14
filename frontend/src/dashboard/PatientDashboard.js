import React from "react";
import { Link } from "react-router-dom";

function PatientDashboard() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/patient/familymembers">Family Members</Link>
          </li>
          <li>
            <Link to="/patient/appointments">View My Appointments</Link>
          </li>
          <li>
            <Link to="/patient/viewdoctors">View Doctors</Link>
          </li>
          <li>
            <Link to="/patient/view-perscriptions">View perscriptions</Link>
          </li>
        </ul>
      </nav>
      {/* Add content for each section here */}
    </div>
  );
}

export default PatientDashboard;
