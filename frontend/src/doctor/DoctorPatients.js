import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import jwt from "jsonwebtoken-promisified";



const DoctorPatients = () => {
  const navigate=useNavigate();
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  console.log("decoded Token:", decodedtoken);
  const id = decodedtoken.id;
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [appointmentStatus, setAppointmentStatus] = useState(""); // Default: no filter
  const [searchName, setSearchName] = useState(""); // Add state for search

  // Fetch the list of patients initially
  
  useEffect(() => {
    // Replace with your API call to fetch patients registered with the doctor
    //console.log(doctorId);
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(
      `http://localhost:8000/Doctor-Home/view-patients?doctorId=${id}`,requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        setPatients(data);
        console.log(data, "data");
        console.log(patients, "patients");
        setFilteredPatients(data);
        console.log(filteredPatients, "filtered 1"); // Initialize filteredPatients with all patients
      })
      .catch((error) => {
        console.error("Error fetching patients:", error);
      });
  }, []);

  // Function to filter patients based on appointment status
  const handleFilter = () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    if (appointmentStatus) {
      // Filter patients by appointment status
      fetch(
        `http://localhost:8000/Doctor-Home/view-patients?doctorId=${id}&status=${appointmentStatus}`,requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("API response:", data); // Log the API response
          if (Array.isArray(data)) {
            // Check if the response data is an array before setting it as filteredPatients
            setFilteredPatients(data);
          } else {
            console.error("API response is not an array:", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching and filtering patients:", error);
        });
    } else {
      // If no status is selected, show all patients
      setFilteredPatients(patients);
    }
  };

  const handleSearch = () => {
    // Convert the search name to lowercase for a case-insensitive search
    const searchNameLower = searchName.toLowerCase();

    // Filter the patients based on the search criteria
    const filteredPatientsByName = patients.filter((patient) => {
      if (
        patient.patient &&
        patient.patient.name.toLowerCase().includes(searchNameLower)
      ) {
        return true;
      }
      return false;
    });

    // Update the state with the filtered results
    setFilteredPatients(filteredPatientsByName);
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
                    Name:{" "}
                    <Link
                      to={`/doctor/view-patient/${item.patient._id}`}
                    >
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
