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
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { format } from "date-fns";
import DoctorNavbar from "../components/DoctorNavbar";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CancelIcon from "@mui/icons-material/Cancel";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

import ReschedulePopup from "../components/ReschedulePopup"; // Adjust the path based on your project structure

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filterBy, setFilterBy] = useState("date"); // Default filter by date
  const [filterValue, setFilterValue] = useState("");
  const [dateFilter, setDateFilter] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState("");
  const [newSlot, setNewSlot] = useState({
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
  });
  const [followUps, setFollowUps] = useState([]);
  const [filteredFollowUps, setFilteredFollowUps] = useState([]);
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false);

  const handleRescheduleClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setOpenRescheduleDialog(true);
  };
  // Fetch doctor's appointments based on doctorId
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(`http://localhost:8000/Doctor-Home/view-appointments`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAppointments(data);
        setFilteredAppointments(data); // Initialize filteredAppointments with all appointments
      })
      .catch((error) => {
        console.error("Error fetching doctor appointments:", error);
        setAppointments([]); // Set appointments as an empty array in case of an error
        setFilteredAppointments([]);
      });
  }, [token]);
  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(`http://localhost:8000/Doctor-Home/view-followUps`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setFollowUps(data);
        setFilteredFollowUps(data); // Initialize filteredFollowUps with all follow-ups
      })
      .catch((error) => {
        console.error("Error fetching follow-up requests:", error);
        setFollowUps([]); // Set follow-ups as an empty array in case of an error
        setFilteredFollowUps([]);
      });
  }, [token]);

  const handleAcceptFollowUp = (followUpId) => {
    // Make a request to accept the follow-up on the backend
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(
      `http://localhost:8000/Doctor-Home/acceptFollowup?followUpId=${followUpId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Follow-up request accepted:", data);
        // Optionally, you can refresh the follow-ups after accepting
        // (Fetch the updated follow-ups from the server)
        setFilteredFollowUps((prevFollowUps) =>
        prevFollowUps.filter((followUp) => followUp._id !== followUpId)
      );
      })
      .catch((error) => {
        console.error("Error accepting follow-up request:", error);
      });
  };

  const handleDenyFollowUp = (followUpId) => {
    // Make a request to deny the follow-up on the backend
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(
      `http://localhost:8000/Doctor-Home/rejectFollowup?followUpId=${followUpId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Follow-up request denied:", data);
        // Optionally, you can refresh the follow-ups after denying
        // (Fetch the updated follow-ups from the server)
        setFilteredFollowUps((prevFollowUps) =>
        prevFollowUps.filter((followUp) => followUp._id !== followUpId)
      );
      })
      .catch((error) => {
        console.error("Error denying follow-up request:", error);
      });
  };
  const handleFilter = () => {
    if (filterBy === "date") {
      // Convert the date to string and set minutes and seconds to 0
      const adjustedDate = new Date(dateFilter);
      adjustedDate.setSeconds(0);
      adjustedDate.setMilliseconds(0);

      const formattedDate = format(
        adjustedDate,
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
      );

      // Make a request to fetch appointments with the filtered date
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      fetch(
        `http://localhost:8000/Doctor-Home/view-appointments?date=${formattedDate}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setFilteredAppointments(data);
        })
        .catch((error) => {
          console.error("Error fetching doctor appointments:", error);
          setFilteredAppointments([]);
        });
    } else if (filterBy === "status") {
      // Filter appointments by status
      const filtered = appointments.filter(
        (appointment) => appointment.status === statusFilter
      );
      setFilteredAppointments(filtered);
    }
  };

  const handleAddTimeSlot = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        doctorId: decodedtoken.id,
        date: format(newSlot.date, "yyyy-MM-dd"),
        startTime: format(newSlot.startTime, "HH:mm:ss"),
        endTime: format(newSlot.endTime, "HH:mm:ss"),
      }),
    };
    fetch(
      "http://localhost:8000/Doctor-Home/add-doctor-time-slot",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Time slot added:", data);
        // Optionally, you can refresh the appointments after adding a new time slot
        // (Fetch the updated appointments from the server)
      })
      .catch((error) => {
        console.error("Error adding time slot:", error);
      });
  };

  const handleCancelAppointment = (appointmentId) => {
    // Make a request to cancel the appointment on the backend
    const requestOptions = {
      method: "POST", // or "DELETE" depending on your backend implementation
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(
      `http://localhost:8000/Doctor-Home/cancelAppointment?AppointmentId=${appointmentId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Appointment canceled:", data);
        // Optionally, you can refresh the appointments after canceling
        // (Fetch the updated appointments from the server)
      })
      .catch((error) => {
        console.error("Error canceling appointment:", error);
      });
  };

  if (decodedtoken.role !== "doctor") {
    return (
      <div>
        <div>ACCESS DENIED, You are not authenticated, please log in</div>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  const defaultTheme = createTheme();

  return (
    <div
      style={{
        marginLeft: "240px",
        padding: "0px",
        marginBottom: "20px",
      }}
    >
      <DoctorNavbar />
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Box
          sx={{
            backgroundImage: 'url("https://source.unsplash.com/random?doctor")',
            backgroundSize: "cover",
            backgroundPosition: "center",
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
                  <h1>Doctor Appointments</h1>
                  <p style={{ fontSize: "0.4em", marginTop: "10px" }}>
                    El7a2ni simplifies appointment tracking by offering
                    easy-to-use filters for date and status, ensuring users can
                    efficiently view and manage their healthcare appointments
                    with convenience.
                  </p>
                </Typography>
                <Stack
                  sx={{ pt: 4 }}
                  direction="column"
                  spacing={2}
                  justifyContent="center"
                >
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <label>
                      <Select
                        value={filterBy}
                        onChange={(e) => setFilterBy(e.target.value)}
                        displayEmpty
                        variant="outlined"
                        size="small"
                      >
                        <MenuItem value="date">Date</MenuItem>
                        <MenuItem value="status">Status</MenuItem>
                      </Select>
                    </label>
                    {filterBy === "date" && (
                      <Datetime
                        value={dateFilter}
                        onChange={(date) => setDateFilter(date)}
                        dateFormat="YYYY-MM-DD"
                        timeFormat="HH:mm"
                        inputProps={{ placeholder: "Select Date and Time" }}
                      />
                    )}
                    {filterBy === "status" && (
                      <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        displayEmpty
                        variant="outlined"
                        size="small"
                      >
                        <MenuItem value="">Select Status</MenuItem>
                        <MenuItem value="UpComing">UpComing</MenuItem>
                        <MenuItem value="Done">Done</MenuItem>
                      </Select>
                    )}
                    <button
                      className="filter-button"
                      style={{ marginLeft: "10px" }}
                      onClick={handleFilter}
                    >
                      Filter
                    </button>
                  </Stack>
                </Stack>
              </Container>
            </div>
          </div>
        </Box>
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center", // Center the content vertically
            minHeight: "80%", // Ensure the content takes at least the full viewport height
          }}
        >
          <h2>Add Time Slot</h2>
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center", // Center the content vertically
            minHeight: "80%", // Ensure the content takes at least the full viewport height
          }}
        >
          <DatePicker
            selected={newSlot.date}
            onChange={(date) => setNewSlot({ ...newSlot, date })}
          />
          <DatePicker
            selected={newSlot.startTime}
            onChange={(time) => setNewSlot({ ...newSlot, startTime: time })}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
            timeFormat="HH:mm"
          />
          <DatePicker
            selected={newSlot.endTime}
            onChange={(time) => setNewSlot({ ...newSlot, endTime: time })}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
            timeFormat="HH:mm"
          />
          <button
            className="filter-button"
            style={{ marginLeft: "10px" }}
            onClick={handleAddTimeSlot}
          >
            Add Time Slot
          </button>
        </div>
        <Container sx={{ py: 8 }}>
          <Typography
            component="h1"
            variant="h4"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Follow-up Requests
          </Typography>
          <Grid container spacing={4}>
            {filteredFollowUps .filter((followUp) => followUp.status === 'Pending').map((followUp) => (
              <Grid item key={followUp.id} xs={12} sm={6} md={4}>
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
                      pt: "56.25%",
                    }}
                    image="https://source.unsplash.com/random?appointments"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {followUp.patient ? followUp.patient.name : "N/A"}
                    </Typography>
                    <Typography>Date: {followUp.date}</Typography>
                    <Typography>Start time: {followUp.startTime}</Typography>
                    <Typography>End time: {followUp.endTime}</Typography>
                    <Typography>Status: {followUp.status}</Typography>
                  </CardContent>
                  <CardActions
                    sx={{ justifyContent: "center", width: "100%" }}
                  >
                    <div
                      style={{
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        width: "100%",
                      }}
                    >
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: "#4CAF50", // Green
                          color: "white",
                          fontWeight: "bold",
                          padding: "8px 16px", // Add padding here
                          width: "100%",
                        }}
                        onClick={() =>
                          handleAcceptFollowUp(followUp._id)
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: "#D32F2F", // Red
                          color: "white",
                          fontWeight: "bold",
                          padding: "8px 16px", // Add padding here
                          width: "100%",
                        }}
                        onClick={() => handleDenyFollowUp(followUp._id)}
                      >
                        Deny
                      </Button>
                    </div>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Container sx={{ py: 8 }}>
           <Typography
            component="h1"
            variant="h4"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Appointments
          </Typography>
          <Grid container spacing={4}>
            {filteredAppointments.map((appointment) => (
              <Grid item key={appointment.id} xs={12} sm={6} md={4}>
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
                      pt: "56.25%",
                    }}
                    image="https://source.unsplash.com/random?appointments"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {appointment.patient ? appointment.patient.name : "N/A"}
                    </Typography>
                    <Typography>Date: {appointment.date}</Typography>
                    <Typography>Status: {appointment.status}</Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "center", width: "100%" }}>
                    {(appointment.status === "UpComing" ||
                      appointment.status === "Rescheduled") && (
                      <div
                        style={{
                          padding: "10px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          width: "100%",
                        }}
                      >
                        <Button
                          variant="contained"
                          style={{
                            backgroundColor: "#001F3F", // Dark Navy Blue
                            color: "white",
                            fontWeight: "bold",
                            padding: "8px 16px", // Add padding here
                            width: "100%",
                          }}
                          onClick={() => handleRescheduleClick(appointment._id)}
                          startIcon={<LibraryBooksIcon />}
                        >
                          Reschedule
                        </Button>
                        <Button
                          variant="contained"
                          style={{
                            backgroundColor: "#851414", // red
                            color: "white",
                            fontWeight: "bold",
                            padding: "8px 16px", // Add padding here
                            width: "100%",
                          }}
                          onClick={() =>
                            handleCancelAppointment(appointment._id)
                          }
                          startIcon={<CancelIcon />}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Dialog
          open={openRescheduleDialog}
          onClose={() => setOpenRescheduleDialog(false)}
        >
          <DialogTitle>Reschedule Appointment</DialogTitle>
          <DialogContent>
            <ReschedulePopup
              appointmentId={selectedAppointmentId}
              handleClose={() => setOpenRescheduleDialog(false)}
            />
          </DialogContent>
          <DialogActions>
            {/* Add any actions or buttons you need */}
            <Button onClick={() => setOpenRescheduleDialog(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </div>
  );
};

export default DoctorAppointments;
