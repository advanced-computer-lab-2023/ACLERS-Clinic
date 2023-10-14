import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function AppointmentFilter() {
  const [patientId, setPatientId] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const handleFilterAppointments = () => {
    // Construct the query string with filters
    const queryParams = new URLSearchParams();
    if (patientId) queryParams.append("patientId", patientId);
    if (status) queryParams.append("status", status);
    if (date) queryParams.append("date", date);

    // Combine the base URL with the query parameters
    const url = `http://localhost:8000/Patient-home/appointments?${queryParams.toString()}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setFilteredAppointments(data);
      })
      .catch((error) => {
        console.error("Error filtering appointments:", error);
      });
  };

  return (
    <div>
      <h1>Appointment Filter</h1>

      <div>
        <TextField
          id="patientId"
          label="Patient ID"
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
      </div>

      <div>
        <Select
          id="status"
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="">Select Status</MenuItem>
          <MenuItem value="UpComing">UpComing</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
        </Select>
      </div>

      <div>
        <TextField
          id="date"
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>

      <Button variant="contained" onClick={handleFilterAppointments}>
        Filter
      </Button>

      {filteredAppointments ? (
        <div>
          <h2>Filtered Appointments:</h2>
          {filteredAppointments.map((appointment) => (
            <div key={appointment._id}>
              <p>ID: {appointment._id}</p>
              <p>Patient: {appointment.patient}</p>
              <p>Doctor: {appointment.doctor}</p>
              <p>Status: {appointment.status}</p>
              <p>Date: {appointment.date}</p>
              {/* Include additional appointment details here */}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default AppointmentFilter;
