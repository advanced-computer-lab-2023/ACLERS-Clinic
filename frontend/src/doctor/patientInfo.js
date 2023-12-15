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
    <div style={{ marginLeft: "270px", marginTop: "10px" }}>
      <button onClick={() => navigate(-1)}>Go Back</button>

      <DoctorNavbar />

      <Grid container spacing={3}>
        {/* Patient Information Card */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: "20px", height: "100%" }}>
            <Typography variant="h5" gutterBottom>
              Patient Information
            </Typography>
            <Avatar
              alt={patient.patient.name}
              src="https://i.ibb.co/HXyFJZM/avatar.jpg"
              sx={{ width: 150, height: 150, margin: "auto", borderRadius: 0 }}
            />
            <Typography variant="body1" paragraph>
              <Person /> Name: {patient.patient.name}
            </Typography>
            <Typography variant="body1" paragraph>
              <Event /> Date of Birth: {patient.patient.dateOfBirth}
            </Typography>
            <Typography variant="body1" paragraph>
              <Email /> Email: {patient.patient.email}
            </Typography>
            <Typography variant="body1" paragraph>
              <Phone /> Mobile Number: {patient.patient.mobileNumber}
            </Typography>
            {/* Add more patient information fields as needed */}
          </Paper>
        </Grid>

        {/* Emergency Contact Information Card */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: "20px", height: "100%" }}>
            <Typography variant="h5" gutterBottom>
              Emergency Contact
            </Typography>
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

        {/* Health Record Card */}
        <Grid item xs={12} md={12}>
          <Paper elevation={3} style={{ padding: "20px", height: "100%" }}>
            <Typography variant="h5" gutterBottom>
              Health Record
            </Typography>
            {/* Display health record information here */}
            <Typography variant="body1" paragraph>
              <Description /> {patient.healthRecord}
            </Typography>
            {/* You can customize the display of health record information */}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default PatientInfo;
