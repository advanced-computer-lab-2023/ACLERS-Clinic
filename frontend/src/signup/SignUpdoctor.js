import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./signup.css";

const theme = createTheme({
  palette: {
    background: {
      default: "#FFFFFF",
    },
  },
});

export default function DoctorSignUp() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [educationalBackground, setEducationalBackground] = useState("");
  const [speciality, setspeciality] = useState("");
  const [idDocument, setIdDocument] = useState(null);
  const [medicalLicense, setMedicalLicense] = useState(null);
  const [medicalDegree, setMedicalDegree] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // Add the file data to the form data
    data.append("idDocument", idDocument);
    data.append("medicalLicense", medicalLicense);
    data.append("medicalDegree", medicalDegree);
 
    const newDoctor = {
      username,
      name,
      email,
      password,
      dateOfBirth,
      hourlyRate,
      affiliation,
      educationalBackground,
      speciality,
    };

    console.log({ data });

    fetch("/auth/register-doctor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // Redirect to a different page after successful registration
        // window.location.href = "/login";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleIdDocumentChange = (event) => {
    setIdDocument(event.target.files[0]);
  };

  const handleMedicalLicenseChange = (event) => {
    setMedicalLicense(event.target.files[0]);
  };

  const handleMedicalDegreeChange = (event) => {
    setMedicalDegree(event.target.files[0]);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            marginTop: 75,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "50%", // Make the form width 90% of the container
            backgroundColor: "rgba(255, 255, 255, 0.8)", // Add a semi-transparent white background to the form
            padding: "20px",
            borderRadius: "8px", // Add rounded corners to the form
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Doctor Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="username"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="email"
                  name="email"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  id="dateOfBirth"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="hourlyRate"
                  label="Hourly Rate"
                  id="hourlyRate"
                  type="number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="affiliation"
                  label="Affiliation"
                  id="affiliation"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="educationalBackground"
                  label="Educational Background"
                  id="educationalBackground"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="speciality"
                  label="Speciality"
                  id="speciality"
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  type="file"
                  name="idDocument"
                  accept=".pdf, .jpg, .jpeg, .png"
                  onChange={handleIdDocumentChange}
                />
                <label htmlFor="idDocument">Upload Your Medical ID</label>
              </Grid>
              <Grid item xs={12}>
                <input
                  type="file"
                  name="medicalLicense"
                  accept=".pdf, .jpg, .jpeg, .png"
                  onChange={handleMedicalLicenseChange}
                />
                <label htmlFor="medicalLicense">Upload Medical License</label>
              </Grid>
              <Grid item xs={12}>
                <input
                  type="file"
                  name="medicalDegree"
                  accept=".pdf, .jpg, .jpeg, .png"
                  onChange={handleMedicalDegreeChange}
                />
                <label htmlFor="medicalDegree">Upload Medical Degree</label>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
