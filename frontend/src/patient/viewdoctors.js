import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";

function DoctorSearch() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  console.log("decoded Token:", decodedtoken);
  const id = decodedtoken.id;
  const [name, setName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patientId, setPatientId] = useState("");
  const [doctors, setDoctors] = useState(null);
  const [filterSpeciality, setFilterSpeciality] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterTime, setFilterTime] = useState("");

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const fetchDoctors = async () => {
      fetch(
        `http://localhost:8000/Patient-home/view-doctors?patientID=${id}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          setDoctors(data);
        })
        .catch((error) => {
          console.error("Error fetching doctor data:", error);
          setDoctors(null);
        });
    };
    fetchDoctors();
  }, []);

  const handleSearch = () => {
    // Prepare the query parameters
    const queryParams = new URLSearchParams();
    if (name) queryParams.append("name", name);
    if (speciality) queryParams.append("speciality", speciality);
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    // Combine the base URL with the query parameters
    const url = `http://localhost:8000/Patient-home/search?${queryParams.toString()}`;

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setDoctors(data);
      })
      .catch((error) => {
        console.error("Error searching for doctors:", error);
      });
  };

  const handleRowClick = (doctorId, sessionPrice) => {
    navigate(`/patient/viewdoctors/selecteddoctor/${doctorId}/${sessionPrice}`);
  };

  const handleFilterDoctors = () => {
    // Construct the query string for filters
    const query = `speciality=${filterSpeciality}&date=${filterDate}&time=${filterTime}`;
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch(
      `http://localhost:8000/Patient-home/view-doctors?${query}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        setDoctors(data);
      })
      .catch((error) => {
        console.error("Error fetching doctor data:", error);
        setDoctors(null);
      });
  };
  if (!token) {
    // Handle the case where id is not available
    return <div>ACCESS DENIED, You are not authenticated, please log in</div>;
  }
  return (
    <div>
      <button onClick={() => navigate(-1)}>Go Back</button>

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

      {doctors ? (
        <div>
          <h2>Available Doctors:</h2>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Specialty</TableCell>
                  <TableCell>Session Price</TableCell>
                  <TableCell>Affiliation</TableCell>
                  <TableCell>Educational Background</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {doctors.map((doctor) => (
                  <TableRow
                    key={doctor._id}
                    hover
                    onClick={() =>
                      handleRowClick(doctor._id, doctor.sessionPrice)
                    }
                  >
                    <TableCell>{doctor._id}</TableCell>
                    <TableCell>{doctor.username}</TableCell>
                    <TableCell>{doctor.speciality}</TableCell>
                    <TableCell>{doctor.sessionPrice}</TableCell>
                    <TableCell>{doctor.affiliation}</TableCell>
                    <TableCell>{doctor.educationalBackground}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <p>No doctors available.</p>
      )}
    </div>
  );
}

export default DoctorSearch;
