import React, { useState } from "react";
import "./adminadd.css";
import { Link, useNavigate } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";
import { TextField, Button, Grid, Typography } from "@mui/material";
import AdminNavbar from "../../components/AdminNavbar";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";

function AdminAdd() {
  // Define state variables to store the username and password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  console.log("decoded Token:", decodedtoken);
  const id = decodedtoken.id;
  // Function to handle the form submission when the "Add Admin" button is clicked
  const handleAddAdmin = (event) => {
    event.preventDefault();

    console.log("Username:", username);
    console.log("Password:", password);

    const admin = { username, password };

    fetch("http://localhost:8000/admin/add-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(admin),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setDialogOpen(true);

        // Close the dialog after 3 seconds
        setTimeout(() => {
          setDialogOpen(false);
        }, 5000);
      })
      .catch((err) => {
        console.log(err);
      });

    setUsername("");
    setPassword("");
  };
  if (!token) {
    // Handle the case where id is not available
    return <div>ACCESS DENIED, You are not authenticated, please log in</div>;
  }

  if (decodedtoken.role !== "admin") {
    return (
      <div>
        <div>ACCESS DENIED, You are not authenticated, please log in</div>
        <Link to="/login">Login</Link>
      </div>
    );
  }
  return (
    <div
      className="body"
      style={{
        display: "flex",
        marginLeft: "290px",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AdminNavbar />
      <div
        style={{
          width: "50%",
          marginRight: "20px",
        }}
      >
        <img
          src={require("./admin.png")}
          alt="Background"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
      <div
        style={{
          padding: "20px",
          width: "50%",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "20px",
            width: "80%",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h5" style={{ marginBottom: "20px" }}>
            Add Admin
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Username"
                fullWidth
                variant="outlined"
                size="small"
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                fullWidth
                variant="outlined"
                size="small"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Button
                type="submit"
                variant="contained"
                style={{
                  backgroundColor: "#2D5968", // Blue
                  color: "white",
                  fontWeight: "bold",
                  padding: "8px 16px", // Add padding here
                }}
                onClick={handleAddAdmin}
              >
                Add Admin
              </Button>
            </Grid>
          </Grid>
        </div>
        <Dialog
          open={dialogOpen}
          TransitionComponent={Slide}
          keepMounted
          onClose={() => setDialogOpen(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            <Typography variant="h6" color="primary">
              Admin added successfully!
            </Typography>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default AdminAdd;
