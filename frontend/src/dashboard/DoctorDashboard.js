import React from "react";
import { Link } from "react-router-dom";

function DoctorDashboard() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/doctor/view-my-info/:doctorId">View My Info</Link>
          </li>
          <li>
            <Link to="/doctor/view-my-appointments/:doctorId">
              View My Appointments
            </Link>
          </li>
          <li>
            <Link to="/doctor/view-my-patients/:doctorId">View Patients</Link>
          </li>
        </ul>
      </nav>
      {/* Add content for each section here */}
    </div>
  );
}

export default DoctorDashboard;
