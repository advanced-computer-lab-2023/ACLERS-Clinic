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
import MenuItem from "@mui/material/MenuItem"; // Import MenuItem
import "./signup.css";

const theme = createTheme({
  palette: {
    background: {
      default: "#000000",
    },
  },
});

const defaultTheme = createTheme();

export default function SignUp() {
  const [userType, setUserType] = useState(""); // State to hold the selected user type

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      username: data.get("username"),
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
      dateOfBirth: data.get("dateOfBirth"),
      userType: userType, // Include the selected user type in the data
    });

    if (userType === "doctor") {
      console.log({
        // Doctor-specific data
        hourlyRate: data.get("hourlyRate"),
        affiliation: data.get("affiliation"),
        educationalBackground: data.get("educationalBackground"),
      });
    } else if (userType === "patient") {
      console.log({
        // Patient-specific data
        gender: data.get("gender"),
        mobileNumber: data.get("mobileNumber"),
        emergencyContactName: data.get("emergencyContactName"),
        emergencyContactMobile: data.get("emergencyContactMobile"),
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <box>
        <img
          src="https://i.ibb.co/HPDqVyW/el7a2nilogoblack.png" // Replace with your image URL
          alt="Top Image"
          style={{
            position: "absolute",
            top: "15%", // Center vertically
            left: "50%", // Center horizontally
            transform: "translate(-50%, -50%)", // Center the image
            width: "50%",
            height: "auto",
          }}
        />
      </box>
      <Box
        sx={{
          height: "100vh", // Set the height to cover the full viewport height
          display: "flex",
          alignItems: "center", // Center vertically
          justifyContent: "center", // Center horizontally
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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            {/* User Type Selection */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  required
                  fullWidth
                  id="userType"
                  label="User Type"
                  name="userType"
                  value={userType}
                  onChange={handleUserTypeChange}
                >
                  <MenuItem value="doctor">Doctor</MenuItem>
                  <MenuItem value="patient">Patient</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            {/* Common Fields */}
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
              {/* Doctor Fields */}
              {userType === "doctor" && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="hourlyRate"
                      label="Hourly Rate"
                      type="number"
                      id="hourlyRate"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="affiliation"
                      label="Affiliation (Hospital)"
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
                </>
              )}
              {/* Patient Fields */}
              {userType === "patient" && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="gender"
                      label="Gender"
                      id="gender"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="mobileNumber"
                      label="Mobile Number"
                      id="mobileNumber"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="emergencyContactName"
                      label="Emergency Contact Name"
                      id="emergencyContactName"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="emergencyContactMobile"
                      label="Emergency Contact Mobile"
                      id="emergencyContactMobile"
                    />
                  </Grid>
                </>
              )}
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
