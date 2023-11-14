// PatientInfo.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import jwt from "jsonwebtoken-promisified";

const PatientInfo = () => {
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
  console.log("Decoded Token:", decodedToken);
  const doctorId = decodedToken.id;
  const [isEditing, setIsEditing] = useState(false);
  const [newHealthRecord, setNewHealthRecord] = useState("");
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();
  const handleSaveHealthRecord = () => {
    // Call the API to update the health record
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        healthRecord: newHealthRecord,

      }),
    };

    fetch(`http://localhost:8000/Doctor-home/addHealthRecord?patientId=${patientId}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        // Handle success, maybe update the UI or show a notification
        console.log("Health record updated successfully:", data);
        setIsEditing(false);
   

      })
      .catch((error) => {
        console.error("Error updating health record:", error);
        // Handle error, show an error message to the user
      });
  };
  const handleEditHealthRecord = () => {
    setIsEditing(true);
  };
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
    navigate(`view-freeSlots/${patientId}`);
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
      {isEditing ? (
        <>
          <textarea
            value={newHealthRecord}

            onChange={(e) => setNewHealthRecord(e.target.value)}
          />
          <button onClick={handleSaveHealthRecord}>Save</button>
        </>
      ) : (
        <>
          <p>Description: {patient.healthRecord}</p>
          <button onClick={handleEditHealthRecord}>Edit</button>
        </>
      )}
      <div>
                    Attachments:
                    <ul>
                      {patient.attachments.map((attachment, attachmentIndex) => (
                        <li key={attachmentIndex}>
                          <img src={`http://localhost:8000/uploads/${attachment.path.substring(8)}`} style={{ maxWidth: "50%", maxHeight: "50%", objectFit: "contain" }} alt={attachment.filename} />

                        </li>
                      ))}
                      </ul>
            </div>
      <button onClick={handleNavigateToFreeSlots}>FollowUp</button>
    </div>
  );
};


export default PatientInfo;