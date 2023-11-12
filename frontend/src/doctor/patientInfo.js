// PatientInfo.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import jwt from "jsonwebtoken-promisified";

const PatientInfo = () => {
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
  console.log("Decoded Token:", decodedToken);
  const doctorId = decodedToken.id;

  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    // Replace with your API call to fetch patient information by patientId
    fetch(`http://localhost:8000/Doctor-Home/view-patient?patientId=${patientId}&doctorId=${doctorId}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setPatient(data);
        console.log(data);
      })
      .catch((error) => {
        console.error('Error fetching patient information:', error);
      });
  }, [patientId, doctorId, token]);

  const handleNavigateToFreeSlots = () => {
    // Navigate to the page that renders free slots
    navigate(`view-freeSlots`);
  };

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={() => navigate(-1)}>Go Back</button>

      <h1>Patient Information</h1>
      <p>Name: {patient.patient.name}</p>
      <p>Date of Birth: {patient.patient.dateOfBirth}</p>
      <p>Email: {patient.patient.email}</p>
      <p>Gender: {patient.patient.gender}</p>
      <p>Mobile Number: {patient.patient.mobileNumber}</p>
      <p>Username: {patient.patient.username}</p>
      <h3>Emergency Contact</h3>
      <p>Full Name: {patient.patient.emergencyContact.fullName}</p>
      <p>Mobile Number: {patient.patient.emergencyContact.mobileNumber}</p>
      <h3>Health Record</h3>
      <p>{patient.healthRecord}</p>

      <button onClick={handleNavigateToFreeSlots}>FollowUp</button>
    </div>
  );
};


export default PatientInfo;
