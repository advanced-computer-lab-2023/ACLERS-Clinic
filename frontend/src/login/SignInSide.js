import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import jwt from "jsonwebtoken-promisified";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="localhost:3000">
        El7a2ni
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignInSide() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const loginData = {
      email: data.get("email"),
      password: data.get("password"),
    };
    try {
      // Send a POST request to your API
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      if (response.ok) {
        // Login successful
        setLoginSuccess(true);
        const data = await response.json();
        const token = data.token;
        localStorage.setItem("token", token);
        console.log("Login successful");
        console.log("Token:", token);

        const decodedToken = jwt.decode(token);
        console.log("decoded Token:", decodedToken);
        console.log("hello");

        if (decodedToken.role === "patient") {
          // Redirect to patient home page
          navigate("/patient/dashboard", {
            state: { id: decodedToken.id },
          });
        } else if (decodedToken.role === "doctor") {
          // Redirect to doctor home page
          navigate("/doctor/dashboard", { state: { id: decodedToken.id } });
        } else if (decodedToken.role === "admin") {
          // Redirect to doctor home page
          navigate("/admin/doctors", { state: { id: decodedToken.id } });
        } else if (decodedToken.role === "applicant") {
          navigate("/applicant/contract", { state: { id: decodedToken.id } });
        }
      } else {
        // Login failed
        console.error("Login failed");
        setLoginSuccess(false);
        setErrorMessage("Invalid email or password. Please try again.");
        setOpenDialog(true);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random?hospital)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src="https://i.ibb.co/vP2dX46/el7a2nilogo.png"
              alt="Your Image"
              style={{
                width: "50%",
              }}
            />
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>

            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />

              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/signuppage" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                  <br></br>
                  <Link href="/ForgotPassword" variant="body2">
                    {"Forgot Password ?"}
                  </Link>
                </Grid>
                <Grid item></Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Login Failed</DialogTitle>
            <DialogContent>
              <DialogContentText>{errorMessage}</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>OK</Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
