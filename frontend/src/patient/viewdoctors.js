import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function DoctorSearch() {
  const [name, setName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patientId, setPatientId] = useState("");
  const [doctors, setDoctors] = useState(null);
  const [filterSpeciality, setFilterSpeciality] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterTime, setFilterTime] = useState("");

  const handleSearch = () => {
    // Prepare the query parameters
    const queryParams = new URLSearchParams();
    if (name) queryParams.append("name", name);
    if (speciality) queryParams.append("speciality", speciality);

    // Combine the base URL with the query parameters
    const url = `http://localhost:8000/Patient-home/search?${queryParams.toString()}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data);
      })
      .catch((error) => {
        console.error("Error searching for doctors:", error);
      });
  };

  const handleSelectDoctor = (doctorId) => {
    fetch(`http://localhost:8000/Patient-home/view-doctor?doctorId=${doctorId}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedDoctor(data);
      })
      .catch((error) => {
        console.error("Error fetching doctor data:", error);
        setSelectedDoctor(null);
      });
  };

  const handleFetchDoctors = () => {
    // Construct the query string
    const query = `patientId=${patientId}`;

    fetch(`http://localhost:8000/Patient-home/view-doctors?${query}`)
      .then((response) => response.json())
      .then((data) => {
        setDoctors(data);
      })
      .catch((error) => {
        console.error("Error fetching doctor data:", error);
        setDoctors(null);
      });
  };

  const handleFilterDoctors = () => {
    // Construct the query string for filters
    const query = `speciality=${filterSpeciality}&date=${filterDate}&time=${filterTime}`;

    fetch(`http://localhost:8000/Patient-home/view-doctors?${query}`)
      .then((response) => response.json())
      .then((data) => {
        setDoctors(data);
      })
      .catch((error) => {
        console.error("Error fetching doctor data:", error);
        setDoctors(null);
      });
  };

  return (
    <div>
      <h1>Doctor Search</h1>
      <label htmlFor="doctorName">Doctor Name:</label>
      <input
        type="text"
        id="doctorName"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label htmlFor="doctorSpeciality">Specialty:</label>
      <input
        type="text"
        id="doctorSpeciality"
        value={speciality}
        onChange={(e) => setSpeciality(e.target.value)}
      />

      <button onClick={handleSearch}>Search</button>

      <div>
        <h2>Search Results:</h2>
        <ul>
          {searchResults.map((doctor) => (
            <li key={doctor._id}>
              Name: {doctor.name}, Specialty: {doctor.speciality}
              <button onClick={() => handleSelectDoctor(doctor._id)}>
                Select Doctor
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedDoctor && (
        <div>
          <h2>Selected Doctor:</h2>
          <p>ID: {selectedDoctor._id}</p>
          <p>Name: {selectedDoctor.username}</p>
          <p>Email: {selectedDoctor.email}</p>
          <p>Hourly Rate: {selectedDoctor.hourlyRate}</p>
          <p>Affiliation: {selectedDoctor.affiliation}</p>
          <p>Educational Background: {selectedDoctor.educationalBackground}</p>
        </div>
      )}

      <div>
        <label htmlFor="patientId">Enter Patient ID:</label>
        <input
          type="text"
          id="patientId"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
        <button onClick={handleFetchDoctors}>Fetch Doctors</button>
      </div>

      {doctors ? (
        <div>
          <h2>Available Doctors:</h2>
          {doctors.map((doctor) => (
            <div key={doctor._id}>
              <p>ID: {doctor._id}</p>
              <p>Name: {doctor.username}</p>
              <p>Specialty: {doctor.speciality}</p>
              <p>Session Price: {doctor.sessionPrice}</p>
              <p>Affiliation: {doctor.affiliation}</p>
              <p>Educational Background: {doctor.educationalBackground}</p>
            </div>
          ))}
        </div>
      ) : (
        <p></p>
      )}

      <div>
        <h2>Filter Doctors:</h2>
        <TextField
          id="filterSpeciality"
          label="Specialty"
          type="text"
          value={filterSpeciality}
          onChange={(e) => setFilterSpeciality(e.target.value)}
        />
        <TextField
          id="filterDate"
          label="Date"
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id="filterTime"
          label="Time"
          type="time"
          value={filterTime}
          onChange={(e) => setFilterTime(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button variant="contained" onClick={handleFilterDoctors}>
          Filter
        </Button>
      </div>

      {doctors ? (
        <div>
          <h2>Filtered Doctors:</h2>
          {doctors.map((doctor) => (
            <div key={doctor._id}>
              <p>ID: {doctor._id}</p>
              <p>Name: {doctor.username}</p>
              <p>Specialty: {doctor.speciality}</p>
              <p>Affiliation: {doctor.affiliation}</p>
              <p>Educational Background: {doctor.educationalBackground}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default DoctorSearch;
