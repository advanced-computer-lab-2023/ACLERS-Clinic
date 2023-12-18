import React, { useState } from "react";
import { Button, TextField, Grid, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DoctorSignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    dateOfBirth: "",
    hourlyRate: "",
    affiliation: "",
    educationalBackground: "",
    speciality: "",
    idDocument: null,
    medicalLicense: null,
    medicalDegree: null,
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        data.append(key, value);
      }
    });

    try {
      const response = await fetch("/auth/register-doctor", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Doctor registration successful:", result);
        // Redirect to a success page or handle accordingly
        navigate("/");
      } else {
        console.error("Doctor registration failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during doctor registration:", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">
        Doctor Sign Up
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              onChange={handleInputChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              onChange={handleInputChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              onChange={handleInputChange}
              required
              type="email"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              onChange={handleInputChange}
              required
              type="password"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="dateOfBirth"
              onChange={handleInputChange}
              required
              type="date"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Hourly Rate"
              name="hourlyRate"
              onChange={handleInputChange}
              required
              type="number"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Affiliation"
              name="affiliation"
              onChange={handleInputChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Educational Background"
              name="educationalBackground"
              onChange={handleInputChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Speciality"
              name="speciality"
              onChange={handleInputChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              name="idDocument"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={handleFileChange}
            />
            <label htmlFor="idDocument">Upload Your Medical ID</label>
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              name="medicalLicense"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={handleFileChange}
            />
            <label htmlFor="medicalLicense">Upload Medical License</label>
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              name="medicalDegree"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={handleFileChange}
            />
            <label htmlFor="medicalDegree">Upload Medical Degree</label>
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" color="primary">
          Sign Up
        </Button>
      </form>
    </Container>
  );
};

export default DoctorSignUp;
