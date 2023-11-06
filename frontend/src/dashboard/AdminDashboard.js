import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AdminDashboard extends Component {
  render() {
    return (
      <div>
        <nav>
          <ul>
            <li><Link to="/admin/viewdoctors">View Doctors</Link></li>
            <li><Link to="/admin/viewpatients">View Patients</Link></li>
            <li><Link to="/admin/adminadd">Add Admin</Link></li>
            <li><Link to="/admin/view-applicants">View Applicants</Link></li>
            <li><Link to="/admin/add-health-package">Add Health Package</Link></li>
            <li><Link to="/admin/view-HealthPackages">View Health Packages</Link></li>
          </ul>
        </nav>
        {/* Add content for each section here */}
      </div>
    );
  }
}

export default AdminDashboard;
