// EditHealthPackage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import jwt from "jsonwebtoken-promisified";
const EditHealthPackage = () => {
  //const { id } = useParams(); // Get the ID from the URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const navigate = useNavigate()
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
  console.log("decoded Token:", decodedToken);
  const [healthPackage, setHealthPackage] = useState({
    type: '',
    Price: 0,
    doctorDiscount: 0,
    medicineDiscount: 0,
    subscriptionDiscount: 0,
  });

  useEffect(() => {
    // Fetch the health package data based on the ID from the URL
    const fetchPackage = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(`http://localhost:8000/admin/view-HealthPackage?id=${id}`,requestOptions);
      const json = await response.json();
      
      if (response.ok) {
        setHealthPackage(json);
      }
    };
    fetchPackage();
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHealthPackage({
      ...healthPackage,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    // Send a PUT request to update the health package data
    const response = await fetch(`http://localhost:8000/admin/update-HealthPackage?healthPackageId=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(healthPackage),
    });

    if (response.ok) {
     //window.location.href('/admin/view-HealthPackages')
     alert("updated successfully")
     window.location.href = '/admin/view-HealthPackages';
    } else {
      // Handle errors, e.g., show an error message
    }
  };
  if (!token ) {
    // Handle the case where id is not available
    return <div>ACCESS DENIED, You are not authenticated, please log in</div>;
  }
  if(decodedToken.role !=="admin"){
    return <div>ACCESS DENIED, You are not authorized</div>;
  }
  return (
    <div>
       <button onClick={() => navigate(-1)}>Go Back</button>
      <h2>Edit Health Package</h2>
      <form onSubmit={handleSubmit}>
        {/* Include input fields for editing health package attributes */}
        <div>
          <label htmlFor="type">Type:</label>
          <input
            type="text"
            id="type"
            name="type"
            value={healthPackage.type}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="Price">Price:</label>
          <input
            type="number"
            id="Price"
            name="Price"
            value={healthPackage.Price}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="doctorDiscount">Doctor Discount (%):</label>
          <input
            type="number"
            id="doctorDiscount"
            name="doctorDiscount"
            value={healthPackage.doctorDiscount}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="medicineDiscount">Medicine Discount (%):</label>
          <input
            type="number"
            id="medicineDiscount"
            name="medicineDiscount"
            value={healthPackage.medicineDiscount}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="subscriptionDiscount">Subscription Discount (%):</label>
          <input
            type="number"
            id="subscriptionDiscount"
            name="subscriptionDiscount"
            value={healthPackage.subscriptionDiscount}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <button type="submit">Update</button>
        </div>
      </form>
    </div>
  );
};

export default EditHealthPackage;
