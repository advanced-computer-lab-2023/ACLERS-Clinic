// PatientInfo.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";

const PatientInfo = () => {
  const { patientId, doctorId } = useParams();
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newHealthRecord, setNewHealthRecord] = useState("");
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  console.log("decoded Token:", decodedtoken);
  const id = decodedtoken.id;

  const handleEditHealthRecord = () => {
    setIsEditing(true);
  };

  const getPatient = ()=>{
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(
      `http://localhost:8000/Doctor-Home/view-patient?patientId=${patientId}&doctorId=${doctorId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        setPatient(data);
        setNewHealthRecord(data.healthRecord)
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching patient information:", error);
      });
  }
  useEffect(() => {
    getPatient();
  }, [patientId]);
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
     getPatient();
        
      })
      .catch((error) => {
        console.error("Error updating health record:", error);
        // Handle error, show an error message to the user
      });
  };
  if (!patient) {
    return <div>Loading...</div>;
  }
  if (!token) {
    // Handle the case where id is not available
    return <div>ACCESS DENIED, You are not authenticated, please log in</div>;
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
    </div>
  );
};

export default PatientInfo;
