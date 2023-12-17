import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";
import PatientNavbar from "../components/PatientNavbar";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

import {
  Container,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";

function AddFamilyMember() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  const id = decodedtoken.id;
  const [openDialog, setOpenDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    nationalId: "",
    age: "",
    gender: "Male",
    relationToPatient: "wife",
  });

  const [linkFormData, setLinkFormData] = useState({
    email: "",
    mobileNumber: "",
    relation: "wife",
  });

  const [familyMembers, setFamilyMembers] = useState([]);
  const [showFamilyMembers, setShowFamilyMembers] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLinkChange = (e) => {
    const { name, value } = e.target;
    setLinkFormData({
      ...linkFormData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formData,
      }),
    };

    fetch(
      `http://localhost:8000/Patient-home/add-family-member?patientId=${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Family member added:", data);
        setSuccessMessage("Family member added successfully");
setOpenDialog(true);
        setFormData({
          name: "",
          nationalId: "",
          age: "",
          gender: "Male",
          relationToPatient: "wife",
        });
      })
      .catch((error) => {
        console.error("Error adding family member:", error);
        setErrorMessage("Error adding family member. Please try again.");
setOpenDialog(true);
      });
  };

  const handleLinkSubmit = (e) => {
    e.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...linkFormData,
      }),
    };

    fetch(
      `http://localhost:8000/Patient-home/link-fam-member?patientId=${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Family member linked:", data);
        setSuccessMessage("Family member linked successfully");
setOpenDialog(true);
        setLinkFormData({
          email: "",
          mobileNumber: "",
          relation: "wife",
        });
      })
      .catch((error) => {
        console.error("Error linking family member:", error);
        setErrorMessage("Could not find a family member with this email or phone number");
setOpenDialog(true);
      });
  };

  const handleViewFamilyMembers = () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(
      `http://localhost:8000/Patient-home/view-fam-member?patientId=${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.familyMembers && Array.isArray(data.familyMembers)) {
          setFamilyMembers(data.familyMembers);
          setShowFamilyMembers(true);
        } else {
          console.error("Error: Family members response is not an array", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching family members:", error);
      });
  };

  if (!token) {
    return <div>ACCESS DENIED, You are not authenticated, please log in</div>;
  }

  if (decodedtoken.role !== "patient") {
    return (
      <div>
        <div>ACCESS DENIED, You are not authenticated, please log in</div>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  return (
    <div style={{ marginLeft: "240px" }}>
      <PatientNavbar />
      <div
        style={{
          position: "relative",
          marginBottom: "10px",
        }}
      >
        <Box
          sx={{
            backgroundImage: 'url("https://source.unsplash.com/random?family")',
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
                  Family Members
                </Typography>
                <Typography
                  variant="h5"
                  align="center"
                  color="text.secondary"
                  component="p"
                >
                  Manage your family's health with ease by adding and linking
                  family members to your patient profile. Use our intuitive
                  forms to add new family members, link existing ones, and
                  seamlessly view a detailed list of your connected family
                  members. Experience personalized and comprehensive healthcare
                  coordination at your fingertips.
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
      </div>
      <div style={{ marginLeft: "48px" }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: "20px" }}>
              <Typography variant="h4" gutterBottom>
                Add Family Member
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Name"
                      fullWidth
                      required
                      value={formData.name}
                      onChange={handleChange}
                      name="name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="National ID"
                      fullWidth
                      required
                      value={formData.nationalId}
                      onChange={handleChange}
                      name="nationalId"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Age"
                      fullWidth
                      required
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      name="age"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={formData.gender}
                        onChange={handleChange}
                        name="gender"
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Relation to Patient</InputLabel>
                      <Select
                        value={formData.relationToPatient}
                        onChange={handleChange}
                        name="relationToPatient"
                      >
                        <MenuItem value="wife">Wife</MenuItem>
                        <MenuItem value="husband">Husband</MenuItem>
                        <MenuItem value="children">Children</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "10px" }}
                >
                  Add Family Member
                </Button>
              </form>
            </Paper>
          </Grid>
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
  <DialogTitle>{successMessage ? "Success" : "Error"}</DialogTitle>
  <DialogContent>
    <DialogContentText>
      {successMessage || errorMessage}
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDialog(false)}>OK</Button>
  </DialogActions>
</Dialog>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} style={{ padding: "20px" }}>
              <Typography variant="h4" gutterBottom>
                Link Family Member
              </Typography>

              <form onSubmit={handleLinkSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email"
                      fullWidth
                      type="email"
                      value={linkFormData.email}
                      onChange={handleLinkChange}
                      name="email"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone Number"
                      fullWidth
                      type="tel"
                      value={linkFormData.mobileNumber}
                      onChange={handleLinkChange}
                      name="mobileNumber"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Relation to Patient</InputLabel>
                      <Select
                        value={linkFormData.relation}
                        onChange={handleLinkChange}
                        name="relation"
                      >
                        <MenuItem value="wife">Wife</MenuItem>
                        <MenuItem value="husband">Husband</MenuItem>
                        <MenuItem value="children">Children</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "10px" }}
                >
                  Link Family Member
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>

        <div style={{ marginTop: "50px", textAlign: "center" }}>
          <Button onClick={handleViewFamilyMembers} variant="outlined">
            View Family Members
          </Button>
        </div>

        {showFamilyMembers && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                Family Members:
              </Typography>
            </Grid>
            {familyMembers.map((familyMember) => (
              <Grid item xs={12} md={6} lg={4} key={familyMember._id}>
                <Card elevation={3}>
                  <CardMedia
                    component="img"
                    height="340"
                    image="https://i.ibb.co/HXyFJZM/avatar.jpg"
                    alt={familyMember.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{familyMember.name}</Typography>
                    <Typography>ID: {familyMember.nationalId}</Typography>
                    <Typography>Age: {familyMember.age}</Typography>
                    <Typography>
                      Relation: {familyMember.relationToPatient}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    </div>
  );
}

export default AddFamilyMember;
