import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import jwt from "jsonwebtoken-promisified";
import { Link, useNavigate } from "react-router-dom";
import PatientNavbar from "../components/PatientNavbar";
import {
  Email,
  Money,
  Business,
  School,
  LocationCity,
} from "@mui/icons-material"; // Import icons

function SelectedDoctor() {
  const navigate = useNavigate();
  const { doctorId, sessionPrice } = useParams();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState({});
  const [bookingFor, setBookingFor] = useState({});
  const [familyMembers, setFamilyMembers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);

  const id = decodedtoken.id;

  useEffect(() => {
    // Fetch the details of the selected doctor using the doctorId from the route parameters
    const token = localStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    // Fetch slots for the selected doctor
    fetch(
      `http://localhost:8000/Patient-home/view-appointments?doctorId=${doctorId}`,
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setSlots(data.slots);
      })
      .catch((error) => {
        console.error("Error fetching slots:", error);
        setSlots([]);
      });

    // Fetch details of the selected doctor
    fetch(
      `http://localhost:8000/Patient-home/view-doctor?doctorId=${doctorId}`,
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setSelectedDoctor(data);
      })
      .catch((error) => {
        console.error("Error fetching doctor data:", error);
        setSelectedDoctor(null);
      });

    // Fetch family members
    const fetchFamilyMembers = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/Patient-Home/view-fam-member?patientId=${id}`,
          requestOptions
        );
        const data = await response.json();

        // Extract family members
        const familyMembersData = data.familyMembers.map((member) => ({
          id: member._id,
          name: member.name,
        }));

        setFamilyMembers(familyMembersData);
      } catch (error) {
        console.error("Error fetching family members:", error);
        setFamilyMembers([]);
      }
    };

    fetchFamilyMembers();
  }, [id, doctorId]);

  const handleBookAppointment = (slotId, selectedValue) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const holderprice = parseInt(sessionPrice);
    console.log("PARSED PRICEEEEEE: ", holderprice);
    const body = {
      paymentMethod: paymentMethods[slotId],
      sessionPrice: holderprice,
    };

    const params = {
      doctorId: doctorId,
      slotId: slotId,
    };

    const requestOptions2 = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    };

    console.log("REQUEST OPTIONS: ", requestOptions2);

    if (selectedValue === "myself") {
      // Add the user ID to the params for booking for oneself
      params.id = id;

      // Make a POST request to book the appointment for oneself
      fetch(
        "http://localhost:8000/Patient-Home/book-appointment?" +
          new URLSearchParams(params).toString(),
        requestOptions2
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Appointment booked for yourself:", data);
          setDialogContent("Your appointment has been booked successfully.");
         
          console.log(paymentMethods[slotId]);
          if (paymentMethods[slotId] === "creditCard") {
            console.log("inn");
            if (data.url) {
              window.location.href = data.url;
            }
          }
          setOpenDialog(true); // Open the dialog

          // Close the dialog after 3000 milliseconds (3 seconds)
          setTimeout(() => {
            setOpenDialog(false);
          }, 3000);
        })
        .catch((error) => {
          console.error("Error booking appointment for family member:", error);
          setDialogContent(
             "Couldn't book your appointment. Please try again later."
          );
          setOpenDialog(true); // Open the dialog

          // Close the dialog after 3000 milliseconds (3 seconds)
          setTimeout(() => {
            setOpenDialog(false);
          }, 3000);
        });
    } else {
      params.familyMemId = selectedValue;
      fetch(
        "http://localhost:8000/Patient-Home/book-appointment-fam?" +
          new URLSearchParams(params).toString(),
        requestOptions2
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Appointment booked for family member:", data);
          setDialogContent("Your family member appointment has been booked successfully.");
         
          if (paymentMethods[slotId] === "creditCard") {
            if (data.url) {
              window.location.href = data.url;
            }
          }
          setOpenDialog(true); // Open the dialog

          // Close the dialog after 3000 milliseconds (3 seconds)
          setTimeout(() => {
            setOpenDialog(false);
          }, 3000);
        })
        .catch((error) => {
          console.error("Error booking appointment for family member:", error);
          setDialogContent(
            "Couldn't book your appointment. Please try again later."
         );
         setOpenDialog(true); // Open the dialog

         // Close the dialog after 3000 milliseconds (3 seconds)
         setTimeout(() => {
           setOpenDialog(false);
         }, 3000);
        });
    }
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
    <div style={{ marginLeft: "340px", padding: "20px" }}>
      <PatientNavbar />

      <div>
        {selectedDoctor ? (
          <Paper elevation={3} style={{ padding: "20px", width: "100%" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Typography variant="h4" gutterBottom>
                  {"Doctor " + selectedDoctor.username}
                </Typography>
                <Avatar
                  alt={selectedDoctor.username}
                  src={
                    "https://i.ibb.co/HXyFJZM/avatar.jpg" ||
                    "default-avatar.jpg"
                  }
                  sx={{
                    width: 250,
                    height: 250,
                    margin: "auto",
                    borderRadius: 0,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6} style={{ paddingLeft: 40 }}>
                <Typography
                  variant="body1"
                  paragraph
                  style={{ paddingTop: 48 }}
                >
                  <Email /> Email: {selectedDoctor.email}
                </Typography>
                <Typography variant="body1" paragraph style={{ paddingTop: 6 }}>
                  <Money /> Hourly Rate: {selectedDoctor.hourlyRate}
                </Typography>
                <Typography variant="body1" paragraph style={{ paddingTop: 6 }}>
                  <Business /> Affiliation: {selectedDoctor.affiliation}
                </Typography>
                <Typography variant="body1" paragraph style={{ paddingTop: 6 }}>
                  <School /> Educational Background:{" "}
                  {selectedDoctor.educationalBackground}
                </Typography>
                <Typography variant="body1" paragraph style={{ paddingTop: 6 }}>
                  <LocationCity /> Speciality: {selectedDoctor.speciality}
                </Typography>
                <Typography variant="body1" paragraph style={{ paddingTop: 6 }}>
                  <Money /> Session Price: {sessionPrice}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <p>Loading...</p>
        )}

        {slots.length > 0 ? (
          <div>
            <h2>Appointment Slots:</h2>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell>Booking For</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {slots.map((slot) => (
                    <TableRow key={slot._id}>
                      <TableCell>{slot.date}</TableCell>
                      <TableCell>{slot.startTime}</TableCell>
                      <TableCell>{slot.endTime}</TableCell>
                      <TableCell>
                        <Select
                          value={paymentMethods[slot._id] || "wallet"}
                          onChange={(e) => {
                            setPaymentMethods({
                              ...paymentMethods,
                              [slot._id]: e.target.value,
                            });
                          }}
                          size="small"
                          style={{ width: "150px" }}
                        >
                          <MenuItem value="wallet">💵 Wallet 💵</MenuItem>
                          <MenuItem value="creditCard">
                            💳 Credit Card 💳
                          </MenuItem>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={
                            bookingFor[slot._id]
                              ? bookingFor[slot._id][0]
                              : "myself"
                          }
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setBookingFor({ [slot._id]: [selectedValue] });
                            console.log("You selected:", selectedValue);
                          }}
                          size="small"
                          style={{ width: "150px" }}
                        >
                          <MenuItem value="myself">Myself</MenuItem>
                          {familyMembers.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleBookAppointment(
                              slot._id,
                              bookingFor[slot._id][0]
                            )
                          }
                        >
                          Book
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Dialog open={openDialog} >
        <DialogTitle>Appointment Booking Status</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogContent}</DialogContentText>
        </DialogContent>
        
      </Dialog>
          </div>
        ) : (
          <p>No appointment slots available.</p>
        )}
      </div>
    </div>
  );
}

export default SelectedDoctor;
