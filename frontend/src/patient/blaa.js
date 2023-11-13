import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./HealthPackageList.css"; // Import the CSS file

const HealthPackageList = () => {
  const [healthPackages, setHealthPackages] = useState([]);
  const [subscriptionType, setSubscriptionType] = useState(""); // Added subscriptionType state
  const [familyMembers, setFamilyMembers] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch health packages data
    fetch(`http://localhost:8000/Patient-Home/view-healthPackages?patientId=${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setHealthPackages(data);
      })
      .catch((error) => {
        console.error("Error fetching health packages:", error);
      });

  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:8000/Patient-Home/view-fam-member?patientId=${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.familyMembers && Array.isArray(data.familyMembers)) {
          // Update the state variable to show family members
          setFamilyMembers(data.familyMembers);
        } else {
          console.error("Error: Family members response is not an array", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching family members:", error);
      });
  }, [id]);

  const handleSubscribe = (healthPackageId) => {
    navigate(`/patient/Handlesubscription/${id}/${healthPackageId}`);
  };

  return (
    <div className="health-package-list-container">
      <div className="top-left">
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
      <h2>Health Package Options and subscription</h2>
      <div className="table-container">
        <table className="health-package-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Price</th>
              <th>Doctor Discount</th>
              <th>Medicine Discount</th>
              <th>Subscription Discount</th>
              <th>Subscribe</th>
            </tr>
          </thead>
          <tbody>
            {healthPackages.map((healthPackage, index) => (
              <tr key={index}>
                <td>{healthPackage.type}</td>
                <td>${healthPackage.price}</td>
                <td>{healthPackage.doctorDiscount}%</td>
                <td>{healthPackage.medicineDiscount}%</td>
                <td>{healthPackage.subscriptionDiscount}%</td>
                <td>
                  <div className="subscription-dropdown">
                    <select
                      value={subscriptionType}
                      onChange={(e) => setSubscriptionType(e.target.value)}
                    >
                      <option value="Myself">Myself</option>
                      {familyMembers.map((familyMember) => (
                        <option key={familyMember._id} value={familyMember.relationToPatient}>
                          {familyMember.name} - {familyMember.relationToPatient}
                        </option>
                      ))}
                    </select>
                    <button onClick={() => handleSubscribe(healthPackage._id)}>
                      Subscribe
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HealthPackageList;
