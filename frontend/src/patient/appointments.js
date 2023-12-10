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

const PatientAppointments = () => {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  console.log("decoded Token:", decodedtoken);
  const id = decodedtoken.id;

  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filterBy, setFilterBy] = useState("date"); // Default filter by date
  const [filterValue, setFilterValue] = useState(null); // Initialize with null
  const [date, setDate] = useState("");

  const [showDateInput, setShowDateInput] = useState(false);

  // Fetch patient's appointments based on patientId
  useEffect(() => {
    // Replace with your API call to fetch patient's appointments
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
        setFilteredAppointments(data); // Initialize filteredAppointments with all appointments
      })
      .catch((error) => {
        console.error("Error fetching patient appointments:", error);
      });
  }, [id]);

  // Function to handle filtering appointments
  const handleFilter = () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    if (filterBy === "date") {
      // Filter appointments by user-entered date
      const adjustedDate = new Date(date);
      adjustedDate.setSeconds(0);
      adjustedDate.setMilliseconds(0);

      const formattedDate = format(
        adjustedDate,
        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
      );
      console.log("formattedDate:", formattedDate);

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
      // Filter appointments by status
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
        // You may want to update the state or perform other actions upon successful payment
      })
      .catch((error) => {
        console.error("Error making payment:", error);
      });
  };
  if (!token) {
    // Handle the case where id is not available
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
    <div>
      <PatientNavbar />

      <div style={{ marginLeft: "240px", padding: "20px" }}>
        <h1 className="page-title">Patient Appointments</h1>
        <div className="appointments-container">
          <div className="filter-section">
            <label className="filter-label">
              Filter by:
              <select
                className="filter-select"
                onChange={(e) => {
                  setFilterBy(e.target.value);
                  setShowDateInput(false); // Hide the date input when changing the filter
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
            <button className="filter-button" onClick={handleFilter}>
              Filter
            </button>
          </div>
        </div>
        <div className="table-container">
          <table className="table custom-table custom-table-header">
            <thead>
              <tr className="custom-th-row">
                <th className="custom-th">Doctor</th>
                <th className="custom-th">Date</th>
                <th className="custom-th">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="custom-td">{appointment.doctor.name}</td>
                  <td className="custom-td">{appointment.date}</td>
                  <td className="custom-td">{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;
