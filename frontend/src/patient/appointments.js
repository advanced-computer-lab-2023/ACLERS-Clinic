import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import "./PatientAppointments.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import jwt, { decode } from "jsonwebtoken-promisified";
import { format } from "date-fns";
import PatientNavbar from "../components/PatientNavbar";
import { Button, Paper ,Popover, Typography} from "@mui/material";
import { Cancel as CancelIcon, Event as EventIcon } from "@mui/icons-material";
import ReplayIcon from '@mui/icons-material/Replay';
import VideoCallIcon from '@mui/icons-material/VideoCall'; // Import Material-UI icons

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const PatientAppointments = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  console.log("decoded Token:", decodedtoken);
  const id = decodedtoken.id;
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filterBy, setFilterBy] = useState("date");
  const [filterValue, setFilterValue] = useState(null);
  const [date, setDate] = useState("");
  const [showDateInput, setShowDateInput] = useState(false);
  const [reschedulePopover, setReschedulePopover] = useState(null);
  const [rescheduleSlots, setRescheduleSlots] = useState([]);
  const [followUpPopover, setFollowUpPopover] = useState(null);
  const [followUpSlots, setFollowUpSlots] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState(null);
  const [followUpConfirmed, setFollowUpConfirmed] = useState(false);

  useEffect(() => {
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
           
          } else {
            console.error("Error: Family members response is not an array", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching family members:", error);
        });
    };
  

    handleViewFamilyMembers();
  }, [token]);
  useEffect(() => {
    const fetchFamilyMemberAppointments = async () => {
      if (!selectedFamilyMember) return;

      try {
        console.log(selectedFamilyMember)
        const response = await fetch(
          `http://localhost:8000/Patient-Home/view-famMem-appointments?famMemId=${selectedFamilyMember._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch family member appointments");
        }

        const data = await response.json();
console.log(data)
        setAppointments(data);
        setFilteredAppointments(data);
      } catch (error) {
        console.error("Error fetching family member appointments:", error);
      }
    };

    fetchFamilyMemberAppointments();
  }, [selectedFamilyMember, token]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch(
      `http://localhost:8000/Patient-Home/appointments?patientId=${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAppointments(data);
        setFilteredAppointments(data);
      })
      .catch((error) => {
        console.error("Error fetching patient appointments:", error);
      });
  }, [id]);

  const handleFilter = () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    if (filterBy === "date") {
      const adjustedDate = new Date(date);
      adjustedDate.setSeconds(0);
      adjustedDate.setMilliseconds(0);

      const formattedDate = format(
        adjustedDate,
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
      );

      const url = `http://localhost:8000/Patient-Home/appointments?patientId=${id}&date=${formattedDate}`;
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setFilteredAppointments(data);
        })
        .catch((error) => {
          console.error("Error fetching filtered appointments:", error);
        });
    } else if (filterBy === "status") {
      const url = `http://localhost:8000/Patient-Home/appointments?patientId=${id}&status=${filterValue}`;
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setFilteredAppointments(data);
        })
        .catch((error) => {
          console.error("Error fetching filtered appointments:", error);
        });
    }
  };
  const handleFollowUpClick = async (appointment) => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
   
    try {
      const response = await fetch(
        `http://localhost:8000/Patient-Home/view-appointments?doctorId=${appointment.doctor._id}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to fetch available slots for follow-up");
      }

      const data = await response.json();
      console.log(data);
      setFollowUpSlots(data.slots);

      // Open the follow-up popover
      setFollowUpPopover(appointment._id);
    } catch (error) {
      console.error("Error fetching available slots for follow-up:", error);
    }
   
   };

  const handleFollowUpConfirm = async (appointmentId, slotId) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
if(selectedFamilyMember){
  try {
    const response = await fetch(
      `http://localhost:8000/Patient-Home/request-followUp-fam?appointmentId=${appointmentId}&freeSlotId=${slotId}&famMemId=${selectedFamilyMember._id}`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error("Failed to request follow-up");
    }

    const data = await response.json();
    console.log("Follow-up requested:", data);
    setFollowUpConfirmed(true);
    // Close the follow-up popover
    setFilteredAppointments((prevAppointments) =>
      prevAppointments.map((app) =>
        app._id === appointmentId ? { ...app, status: 'Pending',date:data.date,startTime:data.startTime,endTime:data.endTime } : app
      )
    );
    setFollowUpPopover(null);
  } catch (error) {
    console.error("Error requesting follow-up:", error);
  }
}else{
    try {
      const response = await fetch(
        `http://localhost:8000/Patient-Home/request-followUp?appointmentId=${appointmentId}&freeSlotId=${slotId}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to request follow-up");
      }

      const data = await response.json();
      console.log("Follow-up requested:", data);
      setFollowUpConfirmed(true);
      // Close the follow-up popover
      setFilteredAppointments((prevAppointments) =>
        prevAppointments.map((app) =>
          app._id === appointmentId ? { ...app, status: data.status,date:data.date,startTime:data.startTime,endTime:data.endTime } : app
        )
      );
      setFollowUpPopover(null);
    } catch (error) {
      console.error("Error requesting follow-up:", error);
    }
  }
  };
  const handleRescheduleClick = async (appointment) => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `http://localhost:8000/Patient-Home/view-appointments?doctorId=${appointment.doctor._id}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to fetch available slots");
      }

      const data = await response.json();
      console.log(data);
      setRescheduleSlots(data.slots);

      // Open the popover
      setReschedulePopover(appointment._id);
    } catch (error) {
      console.error("Error fetching available slots:", error);
    }
  };

  const handleRescheduleConfirm = async (appointmentId, slotId) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
if(selectedFamilyMember){
  try {
    const response = await fetch(
      `http://localhost:8000/Patient-Home/reschedule-appointment-fam?appointmentId=${appointmentId}&freeSlotId=${slotId}&famMemId=${selectedFamilyMember._id}`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error("Failed to reschedule appointment");
    }

    const data = await response.json();
    console.log("Appointment rescheduled:", data);

    // Update the local state to reflect the changes
    setFilteredAppointments((prevAppointments) =>
      prevAppointments.map((app) =>
        app._id === appointmentId ? { ...app, status: 'Rescheduled',date:data.appointment.date,startTime:data.appointment.startTime,endTime:data.appointment.endTime } : app
      )
    );

    // Close the popover
    setReschedulePopover(null);
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
  }
}else{
    try {
      const response = await fetch(
        `http://localhost:8000/Patient-Home/reschedule-appointment?appointmentId=${appointmentId}&freeSlotId=${slotId}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to reschedule appointment");
      }

      const data = await response.json();
      console.log("Appointment rescheduled:", data);

      // Update the local state to reflect the changes
      setFilteredAppointments((prevAppointments) =>
        prevAppointments.map((app) =>
          app._id === appointmentId ? { ...app, status: 'Rescheduled',date:data.appointment.date,startTime:data.appointment.startTime,endTime:data.appointment.endTime } : app
        )
      );

      // Close the popover
      setReschedulePopover(null);
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
    }
  }
  };
  const handleCancelAppointment = (appointmentId) => {
    console.log(appointmentId)
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    
    };
  if(selectedFamilyMember){
    fetch(`http://localhost:8000/Patient-Home/cancel-appointment-fam?appointmentId=${appointmentId}&famMemId=${selectedFamilyMember._id}`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      // Assuming the backend returns some data indicating the success or failure of the cancellation
      console.log("Appointment canceled:", data);

      // Update the local state or refetch the appointments to reflect the changes
      // For example, you can refetch the appointments from the server
      setFilteredAppointments((prevAppointments) =>
        prevAppointments.map((app) =>
          app._id === appointmentId ? { ...app, status: 'Canceled' } : app
        )
      );
    })
    .catch((error) => {
      console.error("Error canceling appointment:", error);
    });
  }else{
    fetch(`http://localhost:8000/Patient-Home/cancel-appointment?appointmentId=${appointmentId}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        // Assuming the backend returns some data indicating the success or failure of the cancellation
        console.log("Appointment canceled:", data);
  
        // Update the local state or refetch the appointments to reflect the changes
        // For example, you can refetch the appointments from the server
        setFilteredAppointments((prevAppointments) =>
          prevAppointments.map((app) =>
            app._id === appointmentId ? { ...app, status: 'Canceled' } : app
          )
        );
      })
      .catch((error) => {
        console.error("Error canceling appointment:", error);
      });
    }
  };
  const handlePayment = (
    patientId,
    doctorId,
    slotId,
    paymentMethod,
    sessionPrice
  ) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        patientId,
        doctorId,
        slotId,
        paymentMethod,
        sessionPrice,
      }),
    };

    fetch("http://localhost:8000/Patient-Home/pay", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("Payment successful:", data);
      })
      .catch((error) => {
        console.error("Error making payment:", error);
      });
  };
  const handleVideoCall = (appointment) => {
    // Add logic to redirect to the Google Meet link
    const googleMeetLink = "https://meet.google.com/"; // Replace with your actual Google Meet link
    window.location.href = googleMeetLink;
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
      {/* Image with title and description */}
      <div
        style={{
          position: "relative",
          marginBottom: "10px",
        }}
      >
        <img
          src="https://backpainsa.com/wp-content/uploads/2015/02/bigstock-Medical-physician-doctor-hands-84721406.jpg"
          alt="Background"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "black",
            padding: "20px",
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: "10px",
          }}
        >
          <h1 style={{ fontSize: "2.5em", margin: "0", marginBottom: "10px" }}>
            Appointments
          </h1>
          <p style={{ fontSize: "1.3em", marginTop: "10px" }}>
            El7a2ni simplifies appointment tracking by offering easy-to-use
            filters for date and status, ensuring users can efficiently view and
            manage their healthcare appointments with convenience.
          </p>
          {/* Filtering Interface */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <div className="filter-section">
              <label className="filter-label">
                Filter by:
                <select
                  className="filter-select"
                  onChange={(e) => {
                    setFilterBy(e.target.value);
                    setShowDateInput(false);
                  }}
                >
                  <option value="date">Date</option>
                  <option value="status">Status</option>
                </select>
              </label>
              {filterBy === "date" && (
                <div>
                  <Datetime
                    id="date"
                    label="Date"
                    value={date}
                    onChange={(date) => setDate(date)}
                    dateFormat="YYYY-MM-DD"
                    timeFormat="HH:mm"
                    inputProps={{ placeholder: "Select Date and Time" }}
                  />
                </div>
              )}
              {filterBy === "status" && (
                <select
                  className="filter-select"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                >
                  <option value="">Select status</option>
                  <option value="UpComing">UpComing</option>
                  <option value="Done">Done</option>
                </select>
              )}
              <button
                className="filter-button"
                style={{ marginLeft: "10px" }}
                onClick={handleFilter}
              >
                Filter
              </button>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "10px" }}>
        <label>
          Select Family Member:
          <select
            value={selectedFamilyMember ? selectedFamilyMember.id : ""}
            onChange={(e) => {
              const selectedFamMemId = e.target.value;
              const selectedFamMem = familyMembers.find(
                (famMem) => famMem._id === selectedFamMemId
              );
              console.log(selectedFamMem);
              setSelectedFamilyMember(selectedFamMem);
            }}
          >
            <option value="">Select a family member</option>
            {familyMembers.map((famMem) => (
              <option key={famMem.id} value={famMem._id}>
                {famMem.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      </div>

      {/* Table displaying appointment results */}
      <div style={{ marginLeft: "48px" }}>
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#f5f5f5", // Light gray background color
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    fontSize: "1.7em",
                    color: "#114B5F",
                    textAlign: "center",
                  }}
                >
                  Doctor
                </TableCell>
                <TableCell
                  style={{
                    fontSize: "1.7em",
                    color: "#114B5F",
                    textAlign: "center",
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  style={{
                    fontSize: "1.7em",
                    color: "#114B5F",
                    textAlign: "center",
                  }}
                >
                  Start Time
                </TableCell>
                <TableCell
                  style={{
                    fontSize: "1.7em",
                    color: "#114B5F",
                    textAlign: "center",
                  }}
                >
                  End Time
                </TableCell>
                <TableCell
                  style={{
                    fontSize: "1.7em",
                    color: "#114B5F",
                    textAlign: "center",
                  }}
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.length === 0 ? (
              // Render a single row with empty cells
              <TableRow>
                <TableCell colSpan={6} style={{ textAlign: "center", fontSize: "1.0em" }}>
                  No appointments found
                </TableCell>
              </TableRow>
            ) :( filteredAppointments.map((appointment) => (
                <TableRow key={appointment._id}>
                  <TableCell style={{ textAlign: "center", fontSize: "1.0em" }}>
  {appointment.status === "UpComing" || appointment.status === "Rescheduled" ? (
    <VideoCallIcon
      style={{ cursor: "pointer", marginRight: "5px" }}
      onClick={() => handleVideoCall(appointment)}
    />
  ) : null}
  {appointment.doctor.name}
</TableCell>
                  <TableCell style={{ textAlign: "center", fontSize: "1.0em" }}>
                    {appointment.date}
                  </TableCell>
                  <TableCell style={{ textAlign: "center", fontSize: "1.0em" }}>
                  {appointment.startTime}
                  </TableCell>
                   <TableCell style={{ textAlign: "center", fontSize: "1.0em" }}>
                   {appointment.endTime}
                  </TableCell>
                  <TableCell style={{ textAlign: "center", fontSize: "1.0em" }}>
                    
                    {appointment.status}
                  </TableCell>
                   <TableCell style={{ textAlign: "center", fontSize: "1.0em" }}>
                    {(appointment.status === 'UpComing' || appointment.status === "Rescheduled") && (
                      <div className="action-buttons">
                      <Button
                        className="cancel-button"
                        variant="contained"
                        color="error"
                        startIcon={<CancelIcon />} // Use Cancel icon
                        onClick={() => handleCancelAppointment(appointment._id)}
                      >
                        
                      </Button>
                      <Button
                        className="reschedule-button"
                        variant="contained"
                        color="primary"
                        startIcon={<EventIcon />} // Use Calendar icon
                        onClick={() => handleRescheduleClick(appointment)}
                      >
                       
                      </Button>
                    </div>
                    )}
                    {appointment.status==="Done" && !followUpConfirmed &&  (
                      <div className="action-buttons">
                      <Button
                        className="followUp-button"
                        variant="contained"
                        color="success"
                        startIcon={<ReplayIcon />} // Use Cancel icon
                        onClick={() => handleFollowUpClick(appointment)}
                      >
                        
                      </Button>
                      </div>
                    )

                    }
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </Paper>
      </div>
      <Popover
        open={reschedulePopover !== null}
        anchorEl={reschedulePopover}
        onClose={() => setReschedulePopover(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Paper style={{ padding: "20px", maxWidth: "300px" }}>
          <Typography variant="h6">Available Slots</Typography>
          <div>
            {rescheduleSlots.map((slot) => (
              <div key={slot._id}>
                <Button
                  onClick={() => handleRescheduleConfirm(reschedulePopover, slot._id)}
                >
                  {slot.date}-{slot.startTime} - {slot.endTime}
                </Button>
              </div>
            ))}
          </div>
        </Paper>
      </Popover>
      <Popover
        open={followUpPopover !== null}
        anchorEl={followUpPopover}
        onClose={() => setFollowUpPopover(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Paper style={{ padding: "20px", maxWidth: "300px" }}>
          <Typography variant="h6">Available Slots for Follow-Up</Typography>
          <div>
            {followUpSlots.map((slot) => (
              <div key={slot._id}>
                <Button
                  onClick={() => handleFollowUpConfirm(followUpPopover, slot._id)}
                >
                  {slot.date}-{slot.startTime} - {slot.endTime}
                </Button>
              </div>
            ))}
          </div>
        </Paper>
      </Popover>
    </div>
  );
};

export default PatientAppointments;
