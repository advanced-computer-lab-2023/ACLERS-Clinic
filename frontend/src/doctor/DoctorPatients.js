import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DoctorNavbar from "../components/DoctorNavbar";

const DoctorPatients = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  console.log("decoded Token:", decodedtoken);
  const id = decodedtoken.id;
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [appointmentStatus, setAppointmentStatus] = useState(""); // Default: no filter
  const [searchName, setSearchName] = useState(""); // Add state for search

  // Fetch the list of patients initially
  const defaultTheme = createTheme();

  useEffect(() => {
    // Replace with your API call to fetch patients registered with the doctor
    //console.log(doctorId);
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(
      `http://localhost:8000/Doctor-Home/view-patients?doctorId=${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        setPatients(data);
        console.log(data, "data");
        console.log(patients, "patients");
        setFilteredPatients(data);
        console.log(filteredPatients, "filtered 1"); // Initialize filteredPatients with all patients
      })
      .catch((error) => {
        console.error("Error fetching patients:", error);
      });
  }, []);

  // Function to filter patients based on appointment status
  const handleFilter = () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    if (appointmentStatus) {
      // Filter patients by appointment status
      fetch(
        `http://localhost:8000/Doctor-Home/view-patients?doctorId=${id}&status=${appointmentStatus}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("API response:", data); // Log the API response
          if (Array.isArray(data)) {
            // Check if the response data is an array before setting it as filteredPatients
            setFilteredPatients(data);
          } else {
            console.error("API response is not an array:", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching and filtering patients:", error);
        });
    } else {
      // If no status is selected, show all patients
      setFilteredPatients(patients);
    }
  };

  const handleSearch = () => {
    // Convert the search name to lowercase for a case-insensitive search
    const searchNameLower = searchName.toLowerCase();

    // Filter the patients based on the search criteria
    const filteredPatientsByName = patients.filter((patient) => {
      if (
        patient.patient &&
        patient.patient.name.toLowerCase().includes(searchNameLower)
      ) {
        return true;
      }
      return false;
    });

    // Update the state with the filtered results
    setFilteredPatients(filteredPatientsByName);
  };

  if (decodedtoken.role !== "doctor") {
    return (
      <div>
        <div>ACCESS DENIED, You are not authenticated, please log in</div>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  return (
    <div>
      <DoctorNavbar />
      <div
        style={{
          marginLeft: "240px",
          padding: "0px",
          marginBottom: "20px",
        }}
      >
        <ThemeProvider theme={defaultTheme}>
          <CssBaseline />
          <Box
            sx={{
              backgroundImage:
                'url("https://source.unsplash.com/random?doctor")',
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
                    Patients
                  </Typography>
                  <Typography
                    variant="h5"
                    align="center"
                    color="text.secondary"
                    paragraph
                  >
                    El7a2ni streamlines patient oversight, providing doctors
                    with a user-friendly platform to view and manage patient
                    details, facilitating quick searches and efficient filtering
                    based on appointment status.
                  </Typography>
                  <Stack
                    sx={{ pt: 4 }}
                    direction="column"
                    spacing={2}
                    justifyContent="center"
                  >
                    {/* First set of elements */}
                    <Stack direction="row" spacing={2} justifyContent="center">
                      <div style={{ marginRight: "10px" }}>
                        <TextField
                          id="searchName"
                          label="Search by Name"
                          variant="outlined"
                          size="small"
                          value={searchName}
                          onChange={(e) => setSearchName(e.target.value)}
                        />
                      </div>
                      <div>
                        <button
                          className="filter-button"
                          style={{ marginLeft: "10px" }}
                          onClick={handleSearch}
                        >
                          Search
                        </button>
                      </div>
                    </Stack>
                    <Divider sx={{ mt: 12, mb: 12 }} />
                    {/* Second set of elements */}
                    <Stack direction="row" spacing={2} justifyContent="center">
                      <div style={{ marginRight: "10px" }}>
                        <label>
                          <Select
                            value={appointmentStatus}
                            onChange={(e) =>
                              setAppointmentStatus(e.target.value)
                            }
                            displayEmpty
                            variant="outlined"
                            size="small"
                          >
                            <MenuItem value="">Select Status</MenuItem>
                            <MenuItem value="UpComing">UpComing</MenuItem>
                            <MenuItem value="Done">Done</MenuItem>
                          </Select>
                        </label>
                      </div>
                      <div>
                        <button
                          className="filter-button"
                          style={{ marginLeft: "10px" }}
                          onClick={handleFilter}
                        >
                          Filter
                        </button>
                      </div>
                    </Stack>
                  </Stack>
                </Container>
              </div>
            </div>
          </Box>

          <Container sx={{ py: 8 }}>
            {/* End hero unit */}
            <Grid container spacing={4}>
              {filteredPatients.map((item) => {
                if (item.patient) {
                  return (
                    <Grid item key={item.patient._id} xs={12} sm={6} md={4}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <CardMedia
                          component="div"
                          sx={{
                            // 16:9
                            pt: "56.25%",
                          }}
                          image="https://source.unsplash.com/random?patients"
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {item.patient.name}
                          </Typography>
                          <Typography>Email: {item.patient.email}</Typography>
                          <Typography>
                            Mobile Number: {item.patient.mobileNumber}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            size="small"
                            component={Link}
                            to={`/doctor/patients/${item.patient._id}`}
                          >
                            View Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                } else {
                }
              })}
            </Grid>
          </Container>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default DoctorPatients;
