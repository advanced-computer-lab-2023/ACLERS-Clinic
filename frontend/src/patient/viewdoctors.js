import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import PatientNavbar from "../components/PatientNavbar";
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

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

function DoctorSearch() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  console.log("decoded Token:", decodedtoken);
  const id = decodedtoken.id;
  const [name, setName] = useState("");
  const [speciality, setSpeciality] = useState("");

  const [doctors, setDoctors] = useState(null);
  const [filterSpeciality, setFilterSpeciality] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterTime, setFilterTime] = useState("");

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const fetchDoctors = async () => {
      fetch(
        `http://localhost:8000/Patient-home/view-doctors?patientID=${id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          setDoctors(data);
        })
        .catch((error) => {
          console.error("Error fetching doctor data:", error);
          setDoctors(null);
        });
    };
    fetchDoctors();
  }, []);

  const handleSearch = () => {
    // Prepare the query parameters
    const queryParams = new URLSearchParams();
    if (name) queryParams.append("name", name);
    if (speciality) queryParams.append("speciality", speciality);
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    // Combine the base URL with the query parameters
    const url = `http://localhost:8000/Patient-home/search?${queryParams.toString()}`;

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setDoctors(data);
      })
      .catch((error) => {
        console.error("Error searching for doctors:", error);
      });
  };

  const handleRowClick = (doctorId, sessionPrice) => {
    navigate(`/patient/viewdoctors/selecteddoctor/${doctorId}/${sessionPrice}`);
  };

  const handleFilterDoctors = () => {
    // Construct the query string for filters
    const query = `speciality=${filterSpeciality}&date=${filterDate}&time=${filterTime}`;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(
      `http://localhost:8000/Patient-home/view-doctors?${query}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        setDoctors(data);
      })
      .catch((error) => {
        console.error("Error fetching doctor data:", error);
        setDoctors(null);
      });
  };
  if (decodedtoken.role !== "patient") {
    return (
      <div>
        <div>ACCESS DENIED, You are not authenticated, please log in</div>
        <Link to="/login">Login</Link>
      </div>
    );
  }
  return (
    <div>
      <PatientNavbar />

      <div style={{ marginLeft: "240px", padding: "0px" }}>
        <ThemeProvider theme={defaultTheme}>
          <CssBaseline />

          <main>
            {/* Hero unit */}
            <Box
              sx={{
                bgcolor: "background.paper",
                pt: 8,
                pb: 6,
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
                  Doctors
                </Typography>
                <Typography
                  variant="h5"
                  align="center"
                  color="text.secondary"
                  paragraph
                >
                  Welcome to El7a2ni Virtual Clinic, your gateway to
                  personalized healthcare. Easily find the right doctor by name
                  or specialty, and filter by free appointments for added
                  convenience.
                </Typography>
                <Stack
                  sx={{ pt: 4 }}
                  direction="column"
                  spacing={2}
                  justifyContent="center"
                >
                  {/* First set of elements */}
                  <Stack direction="row" spacing={2}>
                    <div style={{ marginRight: "10px" }}>
                      <TextField
                        id="doctorName"
                        label="Doctor Name"
                        variant="outlined"
                        size="small"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div style={{ marginRight: "10px" }}>
                      <Select
                        id="filterSpeciality"
                        value={speciality}
                        onChange={(e) => setSpeciality(e.target.value)}
                        displayEmpty
                        variant="outlined"
                        size="small"
                      >
                        <MenuItem value="" disabled>
                          Select Specialty
                        </MenuItem>
                        <MenuItem value="heart">Heart</MenuItem>
                        <MenuItem value="radiology">Radiology</MenuItem>
                        <MenuItem value="neurology">Neurology</MenuItem>
                      </Select>
                    </div>
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSearch}
                      >
                        Search
                      </Button>
                    </div>
                  </Stack>
                  <Divider sx={{ mt: 12, mb: 12 }} />
                  {/* Second set of elements */}
                  <Stack direction="row" spacing={2}>
                    <div style={{ marginRight: "10px" }}>
                      <TextField
                        id="filterSpeciality"
                        label="Specialty"
                        variant="outlined"
                        size="small"
                        value={filterSpeciality}
                        onChange={(e) => setFilterSpeciality(e.target.value)}
                      />
                    </div>
                    <div style={{ marginRight: "10px" }}>
                      <TextField
                        id="filterDate"
                        label="Date"
                        type="date"
                        variant="outlined"
                        size="small"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </div>
                    <div style={{ marginRight: "10px" }}>
                      <TextField
                        id="filterTime"
                        label="Time"
                        type="time"
                        variant="outlined"
                        size="small"
                        value={filterTime}
                        onChange={(e) => setFilterTime(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </div>
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFilterDoctors}
                      >
                        Filter
                      </Button>
                    </div>
                  </Stack>
                </Stack>
              </Container>
            </Box>
            <Container sx={{ py: 8 }} maxWidth="md">
              {/* End hero unit */}
              <Grid container spacing={4}>
                {doctors && Array.isArray(doctors) && doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <Grid item key={doctor._id} xs={12} sm={6} md={4}>
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
                          image="https://source.unsplash.com/random?wallpapers"
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h5" component="h2">
                            {doctor.username} ({doctor.speciality})
                          </Typography>
                          <Typography>
                            Session Price: {doctor.sessionPrice}
                          </Typography>
                          <Typography>
                            Affiliation: {doctor.affiliation}
                          </Typography>
                          <Typography>
                            Education: {doctor.educationalBackground}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            size="small"
                            onClick={() =>
                              handleRowClick(doctor._id, doctor.sessionPrice)
                            }
                          >
                            View Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <p>No doctors available.</p>
                )}
              </Grid>
            </Container>
          </main>
        </ThemeProvider>
      </div>
    </div>
  );
}

export default DoctorSearch;
