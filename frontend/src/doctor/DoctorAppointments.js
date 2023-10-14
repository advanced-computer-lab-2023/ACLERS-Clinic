import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DoctorAppointments = () => {
  const navigate=useNavigate();
  const { doctorId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filterBy, setFilterBy] = useState("date"); // Default filter by date
  const [filterValue, setFilterValue] = useState("");

  // Fetch doctor's appointments based on doctorId
  useEffect(() => {
    // Replace with your API call to fetch doctor's appointments
    fetch(
      `http://localhost:8000/Doctor-Home/view-appointments?doctorId=${doctorId}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setAppointments(data);
        setFilteredAppointments(data); // Initialize filteredAppointments with all appointments
      })
      .catch((error) => {
        console.error("Error fetching doctor appointments:", error);
        setAppointments([]); // Set appointments as an empty array in case of an error
        setFilteredAppointments([]);
      });
  }, [doctorId]);

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
          {filteredAppointments && filteredAppointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.patient}</td>
              <td>{appointment.date}</td>
              <td>{appointment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorAppointments;
