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
import { Button, Paper } from "@mui/material";
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
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell style={{ textAlign: "center", fontSize: "1.0em" }}>
                    {appointment.doctor.name}
                  </TableCell>
                  <TableCell style={{ textAlign: "center", fontSize: "1.0em" }}>
                    {appointment.date}
                  </TableCell>
                  <TableCell style={{ textAlign: "center", fontSize: "1.0em" }}>
                    {appointment.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    </div>
  );
};

export default PatientAppointments;
