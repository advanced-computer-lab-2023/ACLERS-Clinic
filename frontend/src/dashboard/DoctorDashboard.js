import React from "react";
import { Link } from "react-router-dom";

function DoctorDashboard() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/doctor/view-my-info/6527a04c1e841bdc9bcf43e0">
              View My Info
            </Link>
          </li>
          <li>
            <Link to="/doctor/view-my-appointments/6527a04c1e841bdc9bcf43e0">
              View My Appointments
            </Link>
          </li>
          <li>
            <Link to="/doctor/view-my-patients/6527a04c1e841bdc9bcf43e0">
              View Patients
            </Link>
          </li>
        </ul>
      </nav>
      {/* Add content for each section here */}
    </div>
  );
}

export default DoctorDashboard;
