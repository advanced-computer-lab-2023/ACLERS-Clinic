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
const defaultTheme = createTheme();

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactMobile, setEmergencyContactMobile] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get("username");
    const name = data.get("name");
    const email = data.get("email");
    const password = data.get("password");
    const dateOfBirth = data.get("dateOfBirth");
    const gender = data.get("gender");
    const mobileNumber = data.get("mobileNumber");
    const emergencyContactName = data.get("emergencyContactName");
    const emergencyContactMobile = data.get("emergencyContactMobile");
    const emergencyContact = {
      fullName: emergencyContactName,
      mobileNumber: emergencyContactMobile,
    };
    const newuser = {
      username,
      name,
      email,
      password,
      dateOfBirth,
      gender,
      mobileNumber,
      emergencyContact,
    };

    console.log({
      newuser,
    });

    fetch("/auth/register-patient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newuser),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        window.location.href = "/login";
      })
      .catch((err) => {
        console.log(err);
      });
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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
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
                  type="tel"
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
                  type="tel"
                  required
                  fullWidth
                  name="emergencyContactMobile"
                  label="Emergency Contact Mobile"
                  id="emergencyContactMobile"
                />
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
