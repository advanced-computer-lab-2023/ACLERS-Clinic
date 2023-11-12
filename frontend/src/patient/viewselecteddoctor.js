import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import jwt from "jsonwebtoken-promisified";
import Button from "@mui/material/Button";

function SelectedDoctor() {
  const { doctorId, sessionPrice } = useParams();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState({});
  const [bookingFor, setBookingFor] = useState({});
  const [familyMembers, setFamilyMembers] = useState([]);

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

    const body = {
      paymentMethod: paymentMethods[slotId],
      sessionPrice: sessionPrice,
    };

    const params = {
      doctorId: doctorId,
      slotId: slotId,
    };

    if (selectedValue === "myself") {
      // Add the user ID to the params for booking for oneself
      params.id = id;

      // Make a POST request to book the appointment for oneself
      fetch(
        "http://localhost:8000/Patient-Home/book-appointment?" +
          new URLSearchParams(params).toString(),
        {
          ...requestOptions,
          method: "POST",
          body: JSON.stringify(body),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Appointment booked for myself:", data);
        })
        .catch((error) => {
          console.error("Error booking appointment for myself:", error);
        });
    } else {
      // Add the family member ID to the params for booking for a family member
      params.familyMemId = selectedValue;

      // Make a POST request to book the appointment for a family member
      fetch(
        "http://localhost:8000/Patient-Home/book-appointment-fam?" +
          new URLSearchParams(params).toString(),
        {
          ...requestOptions,
          method: "POST",
          body: JSON.stringify(body),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Appointment booked for family member:", data);
        })
        .catch((error) => {
          console.error("Error booking appointment for family member:", error);
        });
    }
  };

  return (
    <div>
      <h1>Your Selected Doctor</h1>

      {selectedDoctor ? (
        <div>
          <p>ID: {selectedDoctor._id}</p>
          <p>Name: {selectedDoctor.username}</p>
          <p>Email: {selectedDoctor.email}</p>
          <p>Hourly Rate: {selectedDoctor.hourlyRate}</p>
          <p>Affiliation: {selectedDoctor.affiliation}</p>
          <p>Educational Background: {selectedDoctor.educationalBackground}</p>
          <p>Speciality: {selectedDoctor.speciality}</p>
          <p>Session Price: {sessionPrice}</p>

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
            </div>
          ) : (
            <p>No appointment slots available.</p>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default SelectedDoctor;
