// HealthPackageList.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './viewHealthPackages.css'; // Import your CSS file

const HealthPackageList = () => {
  const [healthPackages, setHealthPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("http://localhost:8000/Patient-Home/viewSubscribedHealthPackage");
        if (response.ok) {
          const json = await response.json();
          setHealthPackages(json);
        }
      } catch (error) {
        console.error("Error fetching health packages:", error);    
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="health-package-container">
      <button onClick={() => navigate(-1)}>Go Back</button>
      <h2 className="center-text bold-text">Health Packages</h2>
      <table className="health-package-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Price</th>
            <th>Doctor Discount</th>
            <th>Medicine Discount</th>
            <th>Subscription Discount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {healthPackages.map((packag) => (
            <tr key={packag._id}>
              <td>{packag.type}</td>
              <td>${packag.Price}</td>
              <td>{packag.doctorDiscount}%</td>
              <td>{packag.medicineDiscount}%</td>
              <td>{packag.subscriptionDiscount}%</td>
              {/* Add any additional actions here */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HealthPackageList;
