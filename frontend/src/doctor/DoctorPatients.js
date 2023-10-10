import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const DoctorPatients = () => {
 const { doctorId } = useParams();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [appointmentStatus, setAppointmentStatus] = useState(''); // Default: no filter
  const [searchName, setSearchName] = useState(''); // Add state for search


  // Fetch the list of patients initially
  useEffect(() => {
    // Replace with your API call to fetch patients registered with the doctor
    console.log(doctorId)
    fetch(`http://localhost:8000/Doctor-Home/view-patients?doctorId=${doctorId}`)
      .then((response) => response.json())
      .then((data) => {
        setPatients(data);
        console.log(data)
        console.log(patients)
        setFilteredPatients(data);
        console.log(filteredPatients) // Initialize filteredPatients with all patients
      })
      .catch((error) => {
        console.error('Error fetching patients:', error);
      });
  }, []);

  // Function to filter patients based on appointment status
  // Function to filter patients based on appointment status
// Function to filter patients based on appointment status
const handleFilter = () => {
    if (appointmentStatus) {
      // Filter patients by appointment status
      fetch(`http://localhost:8000/Doctor-Home/view-patients?doctorId=${doctorId}&status=${appointmentStatus}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('API response:', data); // Log the API response
          if (Array.isArray(data)) {
            // Check if the response data is an array before setting it as filteredPatients
            setFilteredPatients(data);
          } else {
            console.error('API response is not an array:', data);
          }
        })
        .catch((error) => {
          console.error('Error fetching and filtering patients:', error);
        });
    } else {
      // If no status is selected, show all patients
      setFilteredPatients(patients);
    }
  };

  const handleSearch = () => {
    
    const filteredPatientsByName = filteredPatients.filter((patient) =>
    {
    if(patient.patient){

      patient.patient.name.toLowerCase().includes(searchName.toLowerCase())
    }
 } );
    setFilteredPatients(filteredPatientsByName);
    
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
            <option value="UpComing">UpComing</option>
            <option value="Done">Done</option>
          </select>
        </label>
        <button onClick={handleFilter}>Filter</button>
      </div>
      {/* Add the search bar */}
      <div>
        <label>
          Search by Name:
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </label>
        <button onClick={handleSearch}>Search</button>
      </div>
      <ul>
        {filteredPatients.map((item) => {
          if (item.patient) {
            return (
              <li key={item.patient._id}>
                <div>
                  <h3>Patient Information</h3>
                  <p>
                    Name:{' '}
                    <Link to={`/doctor/view-patient/${item.patient._id}/${doctorId}`}>
                      {item.patient.name}
                    </Link>
                  </p>
                  <p>Email: {item.patient.email}</p>
                  <p>Mobile Number: {item.patient.mobileNumber}</p>
                </div>
              </li>
            );
          } else {
            return (
              <li key={item._id}>
                <p>Patient data not available</p>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default DoctorPatients;
