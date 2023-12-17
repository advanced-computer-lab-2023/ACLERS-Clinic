// ApplicantDetails.js

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";
import DoctorNavbar from "../components/DoctorNavbar";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { Person, Event, Email, Phone, Description } from "@mui/icons-material"; // Import icons
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import Button from "@mui/material/Button";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";

const getRandomImageURL = () =>
  `https://source.unsplash.com/random?doctor=${Math.random()}`;

const ApplicantDetails = ({ applicant }) => {
  const {
    affiliation,
    dateOfBirth,
    educationalBackground,
    email,
    hourlyRate,
    idDocument,
    medicalDegree,
    medicalLicense,
    name,
    speciality,
    status,
    username,
    __v,
    _id,
  } = applicant;
  const [applicants, setApplicants] = useState(null);
  const [contractDetails, setContractDetails] = useState({});
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, []);
  const fetchApplicants = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(
      "http://localhost:8000/admin/view-applicants",
      requestOptions
    );
    const json = await response.json();
    console.log(json);
    if (response.ok) {
      setApplicants(json);
    }
  };

  const handleAccept = (applicantId) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        description: contractDetails[applicantId],
      }),
    };

    fetch(`/admin/approve-doctor?applicantId=${applicantId}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("Doctor approved:", data);
        // Refresh the list of applicants after approving
        alert("Contract is sent");
        fetchApplicants();
        setAcceptDialogOpen(true);
      })
      .catch((error) => {
        console.error("Error approving doctor:", error);
      });
  };

  const handleReject = (applicantId) => {
    fetch(`/admin/reject-doctor?applicantId=${applicantId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Doctor rejected:", data);
        // Refresh the list of applicants after rejecting
        fetchApplicants();
        setRejectDialogOpen(true);
      })
      .catch((error) => {
        console.error("Error rejecting doctor:", error);
      });
  };
  return (
    <div className="applicant-details" style={{ marginBottom: "30 px" }}>
      <Grid container spacing={3} style={{ marginBottom: "30 px" }}>
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
              Applicant Information
            </Typography>
            <Avatar
              alt={name}
              src={getRandomImageURL()}
              sx={{
                width: 250,
                height: 250,
                margin: "auto",
                borderRadius: 0,
              }}
            />
            <Typography variant="body1" paragraph>
              <Person /> Name: {name}
            </Typography>
            <Typography variant="body1" paragraph>
              <Event /> Date of Birth: {dateOfBirth}
            </Typography>
            <Typography variant="body1" paragraph>
              <Email /> Email: {email}
            </Typography>
            <Typography variant="body1" paragraph>
              <Phone /> Username: {username}
            </Typography>
            <Typography variant="body1" paragraph>
              <WorkIcon /> Affiliation: {affiliation}
            </Typography>
            <Typography variant="body1" paragraph>
              <WorkIcon /> Speciality: {speciality}
            </Typography>
            <Typography variant="body1" paragraph>
              <AttachMoneyIcon /> Hourly Rate: {hourlyRate}
            </Typography>
            <Typography variant="body1" paragraph>
              <SchoolIcon /> Educational Background: {educationalBackground}
            </Typography>
            <Typography variant="body1" paragraph>
              <CheckCircleIcon /> Status: {status}
            </Typography>
            {/* Add more patient information fields as needed */}
          </Paper>
        </Grid>

        {/* Right Half: Health Record */}
        <Grid item xs={12} md={6} paddingRight={"20px"}>
          <Paper elevation={3} style={{ padding: "20px", minHeight: "500px" }}>
            <Typography variant="h5" gutterBottom>
              Attachments:
            </Typography>
            {/* Display health record information here */}
            <div>
              <img
                src={`http://localhost:8000/uploads/${idDocument.substring(8)}`}
                style={{
                  maxWidth: "50%",
                  maxHeight: "50%",
                  objectFit: "contain",
                }}
                alt={idDocument}
              />
              <p>ID Document</p>
              <img
                src={`http://localhost:8000/uploads/${medicalDegree.substring(
                  8
                )}`}
                style={{
                  maxWidth: "50%",
                  maxHeight: "50%",
                  objectFit: "contain",
                }}
                alt={medicalDegree}
              />
              <p>Medical Degree</p>

              <img
                src={`http://localhost:8000/uploads/${medicalLicense.substring(
                  8
                )}`}
                style={{
                  maxWidth: "50%",
                  maxHeight: "50%",
                  objectFit: "contain",
                }}
                alt={medicalLicense}
              />
              <p>Medical License</p>
            </div>
            <div>
              <textarea
                placeholder="Enter employment contract details"
                value={contractDetails[applicant._id] || ""}
                onChange={(e) =>
                  setContractDetails({
                    ...contractDetails,
                    [applicant._id]: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Button
                className="filter-button"
                style={{
                  backgroundColor: "#114B5F",
                  color: "white",
                  fontWeight: "bold",
                  padding: "8px 16px",
                }}
                onClick={() => handleAccept(applicant._id)}
                startIcon={<EditIcon />}
              >
                Accept
              </Button>
              <Button
                className="filter-button"
                style={{
                  marginLeft: "10px",
                  backgroundColor: "#851414",
                  color: "white",
                  fontWeight: "bold",
                  padding: "8px 16px",
                }}
                onClick={() => handleReject(applicant._id)}
                startIcon={<CancelIcon />}
              >
                Reject
              </Button>
            </div>

            {/* You can customize the display of health record information */}
          </Paper>
        </Grid>
      </Grid>
      {/* Accept Dialog */}
      <Dialog
        open={acceptDialogOpen}
        onClose={() => setAcceptDialogOpen(false)}
        aria-describedby="accept-dialog-description"
      >
        <DialogContent>
          <Typography variant="h6" color="primary">
            Contract has been sent to applicant!
          </Typography>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        aria-describedby="reject-dialog-description"
      >
        <DialogContent>
          <Typography variant="h6" color="error">
            Applicant rejected.
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicantDetails;
