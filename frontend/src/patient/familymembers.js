import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";
import PatientNavbar from "../components/PatientNavbar";
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
} from "@mui/material";

function AddFamilyMember() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  const id = decodedtoken.id;

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
        setLinkFormData({
          email: "",
          mobileNumber: "",
          relation: "wife",
        });
      })
      .catch((error) => {
        console.error("Error linking family member:", error);
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
    <div style={{ marginLeft: "240px", padding: "20px" }}>
      <Container>
        <PatientNavbar />
        <Container
          disableGutters
          maxWidth="sm"
          component="main"
          sx={{ pt: 0, pb: 6 }}
        >
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
            Manage your family's health with ease by adding and linking family
            members to your patient profile. Use our intuitive forms to add new
            family members, link existing ones, and seamlessly view a detailed
            list of your connected family members. Experience personalized and
            comprehensive healthcare coordination at your fingertips.
          </Typography>
        </Container>
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
      </Container>
    </div>
  );
}

export default AddFamilyMember;
