import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./HealthPackageList.css"; // Import the CSS file
import DatePicker from "react-datepicker";
import { Link, useLocation } from "react-router-dom";
import "./PatientAppointments.css";
import "react-datepicker/dist/react-datepicker.css";
import jwt from "jsonwebtoken-promisified";

const HealthPackageList = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  console.log("decoded Token:", decodedtoken);
  const id = decodedtoken.id;
  const navigate = useNavigate();
  const [healthPackages, setHealthPackages] = useState([]);
  const [subscriptionType, setSubscriptionType] = useState(""); // Added subscriptionType state
  const [familyMembers, setFamilyMembers] = useState([]);
  const [paymentOption, setPaymentOption] = useState("");

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    // Fetch health packages data
    fetch(
      `http://localhost:8000/Patient-Home/view-healthPackages?patientId=${id}`,
      requestOptions
    )
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
    // Replace with your API call to fetch patient's appointments
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(
      `http://localhost:8000/Patient-Home/view-fam-member?patientId=${id}`,
      requestOptions
    )
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
    console.log(subscriptionType);
    // Check the subscription type
    if (subscriptionType === "Myself") {
      console.log(id);
      console.log(healthPackageId);
      console.log(paymentOption);
      // If subscription type is "Myself", make a POST request with patientId and healthPackageId in the query
      fetch(
        `http://localhost:8000/Patient-Home/subscribe-healthPackage?id=${id}&healthPackageId=${healthPackageId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentMethod: paymentOption,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (paymentOption == "creditCard"){
          window.location.href = data.url;
        }
        })
        .catch((error) => {
          console.error("Error subscribing:", error);
        });
    } else {
      const selectedFamilyMember = familyMembers.find(
        (member) => member.relationToPatient === subscriptionType
      );
      const familyMemberId = selectedFamilyMember._id;
      console.log(id);
      console.log(healthPackageId);
      console.log(paymentOption);
      console.log(familyMemberId);
      // If subscription type is not "Myself", assume it's a family member
      // Here, you need to replace "familyMemberId" with the actual ID of the selected family member

      // Make a POST request with patientId, familyMemberId, and healthPackageId in the query
      fetch(
        `http://localhost:8000/Patient-Home/subscribe-healthpack-famMem?id=${id}&familyMemberId=${familyMemberId}&healthPackageId=${healthPackageId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentMethod: paymentOption,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          window.location.href = data.url;
        })
        .catch((error) => {
          console.error("Error subscribing:", error);
        });
    }
  };
  if (decodedtoken.role !== "patient") {
    return (
      <div>
        <div>ACCESS DENIED, You are not authenticated, please log in</div>
        <Link to="/login">Login</Link>
      </div>
    );
  }
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
              <th>Payment Option</th>
              <th>Subscribe</th>
            </tr>
          </thead>
          <tbody>
            {healthPackages.map((healthPackage, index) => (
              <tr key={index}>
                <td>{healthPackage.type}</td>
                <td>${healthPackage.Price}</td>
                <td>{healthPackage.doctorDiscount}%</td>
                <td>{healthPackage.medicineDiscount}%</td>
                <td>{healthPackage.subscriptionDiscount}%</td>
                <td>
                  <div className="payment-dropdown">
                    <select
                      value={paymentOption}
                      onChange={(e) => setPaymentOption(e.target.value)}
                    >
                      <option value="creditCard">Credit Card</option>
                      <option value="wallet">Wallet</option>
                    </select>
                  </div>
                </td>
                <td>
                  <div className="subscription-dropdown">
                    <select
                      value={subscriptionType}
                      onChange={(e) => setSubscriptionType(e.target.value)}
                    >
                      <option value="Myself">Myself</option>
                      {familyMembers.map((familyMember) => (
                        <option
                          key={familyMember._id}
                          value={familyMember.relationToPatient}
                        >
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
