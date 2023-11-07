// HealthPackageList.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const HealthPackageList = () => {
  const [healthPackages, setHealthPackages] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPackages = async () => {
        const response = await fetch("http://localhost:8000/admin/view-HealthPackage");
        const json = await response.json();
         
        if (response.ok) {
          setHealthPackages(json);
        }
      };
      fetchPackages()
  }, []);
  

  const deletePackage = async (packageId) => {
    try {
      const response = await fetch(`/admin/delete-HealthPackage?healthPackageId=${packageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Handle success, e.g., update the UI or show a success message
        // You may want to refresh the list of health packages after deletion
        // For simplicity, you can re-fetch the list here
        fetchPackages();
      } else {
        // Handle errors, e.g., show an error message
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const fetchPackages = async () => {
    const response = await fetch("http://localhost:8000/admin/view-HealthPackage");
    const json = await response.json();
     
    if (response.ok) {
      setHealthPackages(json);
    }
  };
  return (
    <div>
       <button onClick={() => navigate(-1)}>Go Back</button>
      <h2>Health Packages</h2>
      <table>
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
              <td>
              <Link
  to={{
    pathname: '/admin/edit-HealthPackage',
    search: `?id=${packag._id}`,
  }}
>
  Edit
</Link>
                <button onClick={() => deletePackage(packag._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HealthPackageList;
