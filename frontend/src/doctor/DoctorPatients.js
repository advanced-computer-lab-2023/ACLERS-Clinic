import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
const DoctorPatients = () => {
 const { doctorId } = useParams();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [appointmentStatus, setAppointmentStatus] = useState(''); // Default: no filter

  // Fetch the list of patients initially
  useEffect(() => {
    // Replace with your API call to fetch patients registered with the doctor
    fetch(`http://localhost:8000/Doctor-Home/view-patients?doctorId=${doctorId}`)
      .then((response) => response.json())
      .then((data) => {
        setPatients(data);
        setFilteredPatients(data); // Initialize filteredPatients with all patients
      })
      .catch((error) => {
        console.error('Error fetching patients:', error);
      });
  }, []);

  // Function to filter patients based on appointment status
  const handleFilter = () => {
    if (appointmentStatus) {
      // Filter patients by appointment status
      
       fetch(`http://localhost:8000/Doctor-Home/view-patients?doctorId=${doctorId}&status=${appointmentStatus}`).then((response)=>response.json())
       .then((data)=>{
        setFilteredPatients(data);
       })
     
      }
      
    else {
      // If no status is selected, show all patients
      setFilteredPatients(patients);
    }
  };

  return (
    <div>
      <h1>Doctor's Patients</h1>
      <div>
        <label>
          Filter by Appointment Status:
          <select
            onChange={(e) => setAppointmentStatus(e.target.value)}
            value={appointmentStatus}
          >
            <option value="">All</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </label>
        <button onClick={handleFilter}>Filter</button>
      </div>
      <ul>
        {filteredPatients.map((patient) => (
          <li key={patient.id}>
            {/* Display patient information here */}
            {patient.name} - {patient.appointmentStatus}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorPatients;
