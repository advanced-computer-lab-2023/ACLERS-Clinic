import React from "react";
import { Link, useParams } from "react-router-dom";

function PatientDashboard() {
  const { id } = useParams();
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to={`/patient/familymembers/${id}`}>Family Members</Link>
          </li>
          <li>
            <Link to={`/patient/appointments/${id}`}>View My Appointments</Link>
          </li>
          <li>
            <Link to={`/patient/viewdoctors/${id}`}>View Doctors</Link>
          </li>
          <li>
            <Link to={`/patient/view-perscriptions/${id}`}>
              View perscriptions
            </Link>
          </li>
          <li>
            <Link to={`/patient/medicalhistory/${id}`}>Medical History</Link>
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
