import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PatientAppointments.css";

const PatientAppointments = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filterBy, setFilterBy] = useState("date"); // Default filter by date
  const [filterValue, setFilterValue] = useState("");

  // Fetch patient's appointments based on patientId
  useEffect(() => {
    // Replace with your API call to fetch patient's appointments
    fetch(`http://localhost:8000/Patient-Home/appointments?patientId=${id}`)
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

      <h1 className="page-title">Patient Appointments</h1>
      <div className="appointments-container">
        <div className="filter-section">
          <label className="filter-label">
            Filter by:
            <select
              className="filter-select"
              onChange={(e) => setFilterBy(e.target.value)}
            >
              <option value="date">Date</option>
              <option value="status">Status</option>
            </select>
          </label>
          <input
            type="text"
            className="filter-input"
            placeholder={`Filter by ${filterBy}`}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
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
              <th className="custom-th">Payment</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="custom-td">{appointment.doctor}</td>
                <td className="custom-td">{appointment.date}</td>
                <td className="custom-td">{appointment.status}</td>
                <td className="custom-td">
                  <button className="wallet-payment">💵 Wallet 💵</button>
                  <button className="credit-card-payment">
                    💳 Credit Card 💳
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientAppointments;
