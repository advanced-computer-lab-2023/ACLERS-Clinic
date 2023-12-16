import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";
import DoctorNavbar from "../components/DoctorNavbar";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { Person, Event, Email, Phone, Description } from "@mui/icons-material"; // Import icons

const PatientInfo = () => {
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
  const doctorId = decodedToken.id;
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newHealthRecord, setNewHealthRecord] = useState("");

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

    fetch(
      `http://localhost:8000/Doctor-home/addHealthRecord?patientId=${patientId}`,
      requestOptions
    )
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

  const handleNavigateToAddPrescription = () => {
    // Navigate to the page for adding prescriptions
    navigate(`/doctor/add-prescription/${patientId}`);
  };
  useEffect(() => {
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
      })
      .catch((error) => {
        console.error("Error fetching patient information:", error);
      });
  }, [patientId, doctorId, token]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{ marginLeft: "270px", marginTop: "10px", marginBottom: "20px" }}
    >
      <DoctorNavbar />

      <Grid container spacing={3}>
        {/* Left Half: Patient Information and Emergency Contact Information */}
        <Grid item xs={12} md={6}>
          {/* Patient Information Card */}
          <Paper elevation={3} style={{ padding: "20px", minHeight: "250px" }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                textAlign: "center",
              }}
            >
              Patient Information
            </Typography>
            <Avatar
              alt={patient.patient.name}
              src="https://i.ibb.co/HXyFJZM/avatar.jpg"
              sx={{
                width: 250,
                height: 250,
                margin: "auto",
                borderRadius: 0,
                textAlign: "left",
              }}
            />
            <Typography variant="body1" paragraph>
              <Person /> Name: {patient.patient.name}
            </Typography>
            <Typography variant="body1" paragraph>
              {/* ////// */}
              <Person /> Gender: {patient.patient.gender}
            </Typography>
            <Typography variant="body1" paragraph>
              <Event /> Date of Birth: {patient.patient.dateOfBirth}
            </Typography>
            <Typography variant="body1" paragraph>
              <Email /> Email: {patient.patient.email}
            </Typography>
            <Typography variant="body1" paragraph>
              {/* //////// */}
              <Phone /> Username: {patient.patient.username}
            </Typography>
            <Typography variant="body1" paragraph>
              <Phone /> Mobile Number: {patient.patient.mobileNumber}
            </Typography>
            {/* Add more patient information fields as needed */}
          </Paper>

          {/* Emergency Contact Information Card */}
          <Paper
            elevation={3}
            style={{ padding: "20px", minHeight: "250px", marginTop: "20px" }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                textAlign: "center",
              }}
            >
              Emergency Contact
            </Typography>

            <Avatar
              alt={patient.patient.name}
              src="https://source.unsplash.com/random?person"
              sx={{
                width: 250,
                height: 250,
                margin: "auto",
                borderRadius: 0,
              }}
            />

            {/* Display emergency contact information here */}
            <Typography variant="body1" paragraph>
              <Person /> Full Name: {patient.patient.emergencyContact.fullName}
            </Typography>
            <Typography variant="body1" paragraph>
              <Phone /> Mobile Number:{" "}
              {patient.patient.emergencyContact.mobileNumber}
            </Typography>
            {/* Add more emergency contact information fields as needed */}
          </Paper>
        </Grid>

        {/* Right Half: Health Record */}
        <Grid item xs={12} md={6} paddingRight={"20px"}>
          <Paper elevation={3} style={{ padding: "20px", minHeight: "500px" }}>
            <Typography variant="h5" gutterBottom>
              Health Record
            </Typography>
            {/* Display health record information here */}
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
                <Typography variant="body1" paragraph>
                  <Description /> {patient.healthRecord}
                  <button
                    className="filter-button"
                    style={{ marginLeft: "10px" }}
                    onClick={handleEditHealthRecord}
                  >
                    Edit
                  </button>
                </Typography>
              </>
            )}
            <div>
              <Typography variant="h5" gutterBottom>
                Attachments:
              </Typography>

              <ul>
                {patient.attachments.map((attachment, attachmentIndex) => (
                  <li key={attachmentIndex}>
                    <img
                      src={`http://localhost:8000/uploads/${attachment.path.substring(
                        8
                      )}`}
                      style={{
                        maxWidth: "50%",
                        maxHeight: "50%",
                        objectFit: "contain",
                      }}
                      alt={attachment.filename}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <button
              className="filter-button"
              style={{ marginLeft: "10px" }}
              onClick={handleNavigateToAddPrescription}
            >
              Add Prescription
            </button>

            {/* You can customize the display of health record information */}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default PatientInfo;
