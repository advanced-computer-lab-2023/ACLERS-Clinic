// PatientInfo.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PatientInfo = () => {
  const { patientId ,doctorId} = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    // Replace with your API call to fetch patient information by patientId
    fetch(`http://localhost:8000/Doctor-Home/view-patient?patientId=${patientId}&doctorId=${doctorId}`)
      .then((response) => response.json())
      .then((data) => {
        setPatient(data);
        console.log(data)
      })
      .catch((error) => {
        console.error('Error fetching patient information:', error);
      });
  }, [patientId]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
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
    </div>
  );
};

export default PatientInfo;
