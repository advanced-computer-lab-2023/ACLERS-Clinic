import React from "react";
import { Link, useParams } from "react-router-dom";

function DoctorDashboard() {
  const { id } = useParams();

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to={`/doctor/view-my-info/${id}`}>View My Info</Link>
          </li>
          <li>
            <Link to={`/doctor/view-my-appointments/${id}`}>
              View My Appointments
            </Link>
          </li>
          <li>
            <Link to={`/doctor/view-my-patients/${id}`}>View Patients</Link>
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

export default DoctorDashboard;
