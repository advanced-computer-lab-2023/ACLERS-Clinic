import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";
import { format } from "date-fns";
import { parse } from "date-fns";
import { set } from "date-fns";

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filterBy, setFilterBy] = useState("date"); // Default filter by date
  const [filterValue, setFilterValue] = useState("");

  const [newSlot, setNewSlot] = useState({
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
  });

  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  console.log("decoded Token:", decodedtoken);
  const doctorId = decodedtoken.id;

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
  }, [doctorId, token]);

  // Function to handle filtering appointments
  const handleFilter = () => {
    if (filterBy === "date") {
      // Filter appointments by date
      const filtered = appointments.filter((appointment) =>
        appointment.date.includes(filterValue)
      );
      setFilteredAppointments(filtered);
    } else if (filterBy === "status") {
      // Filter appointments by status
      const filtered = appointments.filter(
        (appointment) => appointment.status === filterValue
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
        doctorId,
        date: format(newSlot.date, "yyyy-MM-dd"),
        startTime: format(newSlot.startTime, "HH:mm:ss"),
        endTime: format(newSlot.endTime, "HH:mm:ss"),
      }),
    };
    console.log("request body:", requestOptions.body);
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
      <button onClick={() => navigate(-1)}>Go Back</button>

      <h1>Doctor Appointments</h1>

      <div>
        <label>
          Filter by:
          <select onChange={(e) => setFilterBy(e.target.value)}>
            <option value="date">Date</option>
            <option value="status">Status</option>
          </select>
        </label>
        <input
          type="text"
          placeholder={`Filter by ${filterBy}`}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
        <button onClick={handleFilter}>Filter</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments &&
            filteredAppointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.patient.name}</td>
                <td>{appointment.date}</td>
                <td>{appointment.status}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <div>
        <h2>Add Time Slot</h2>
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
        <button onClick={handleAddTimeSlot}>Add Time Slot</button>
      </div>
    </div>
  );
};

export default DoctorAppointments;
