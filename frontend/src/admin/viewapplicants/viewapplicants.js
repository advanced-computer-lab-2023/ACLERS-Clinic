// ViewApplicants.js

import ApplicantDetails from "../../components/applicantdetails.js";
import { useNavigate, useParams } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { Person, Event, Email, Phone, Description } from "@mui/icons-material";
import AdminNavbar from "../../components/AdminNavbar.js";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";

const ViewApplicants = () => {
  const [applicants, setApplicants] = useState(null);
  const [contractDetails, setContractDetails] = useState({});
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
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
      })
      .catch((error) => {
        console.error("Error rejecting doctor:", error);
      });
  };

  if (!token) {
    return <div>ACCESS DENIED, You are not authenticated, please log in</div>;
  }

  if (decodedToken.role !== "admin") {
    return <div>ACCESS DENIED, You are not authorized</div>;
  }

  return (
    <div
      className="applicantviewer"
      style={{ marginLeft: "270px", marginTop: "10px", marginBottom: "20px" }}
    >
      <Box
        sx={{
          backgroundImage: 'url("https://source.unsplash.com/random?doctor")',
          backgroundSize: "cover", // Adjust as needed
          backgroundPosition: "center", // Adjust as needed
          bgcolor: "background.paper",

          pt: 8,
          pb: 6,
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center", // Center the content vertically
            minHeight: "80%", // Ensure the content takes at least the full viewport height
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)", // Adjust the alpha value for transparency
              padding: "20px", // Adjust as needed
              maxWidth: "1000px", // Set the maximum width as needed
              width: "100%",
              borderRadius: "8px", // Optional: Add border-radius for rounded corners
            }}
          >
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
              >
                Applicants
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                paragraph
              >
                El7a2ni streamlines applicant oversight, providing you with a
                user-friendly platform to view and manage patient, facilitating
                quick inspections and account management.
              </Typography>
              <Stack
                sx={{ pt: 4 }}
                direction="column"
                spacing={2}
                justifyContent="center"
              ></Stack>
            </Container>
          </div>
        </div>
      </Box>
      <AdminNavbar />
      <div
        style={{
          marginLeft: "40px",
          marginRight: "20px",
          marginTop: "20px",
          marginBottom: "40px",
        }}
      >
        {applicants &&
          applicants.map((applicant) => (
            <div key={applicant._id}>
              <ApplicantDetails applicant={applicant} />
              <Divider sx={{ mt: 8, mb: 8 }} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ViewApplicants;
