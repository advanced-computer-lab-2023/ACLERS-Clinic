import React from "react";
import { Link, useNavigate } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";

function AdminDashboard() {
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  console.log("decoded Token:", decodedtoken);
  const id = decodedtoken.id;

  const navigate = useNavigate();

  if (decodedtoken.role !== "admin") {
    return (
      <div>
        <div>ACCESS DENIED, You are not authenticated, please log in</div>
        <Link to="/login">Login</Link>
      </div>
    );
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
            <Link to="/admin/viewdoctors">View Doctors</Link>
          </li>
          <li>
            <Link to="/admin/viewpatients">View Patients</Link>
          </li>
          <li>
            <Link to="/admin/adminadd">Add Admin</Link>
          </li>
          <li>
            <Link to="/admin/view-applicants">View Applicants</Link>
          </li>
          <li>
            <Link to="/admin/add-health-package">Add Health Package</Link>
          </li>
          <li>
            <Link to="/admin/view-HealthPackages">View Health Packages</Link>
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

export default AdminDashboard;
