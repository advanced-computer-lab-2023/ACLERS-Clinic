import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useParams } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { format } from "date-fns";
import PatientNavbar from "../components/PatientNavbar";

function PrescriptionDataText() {
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  console.log("decoded Token:", decodedtoken);
  const id = decodedtoken.id;

  const navigate = useNavigate();
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [status, setStatus] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const handleChange = (e) => {
    setPatientId(e.target.value);
  };
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    const handleFetchPrescriptions = () => {
      // Construct the query string with filters
      let query = `patientId=${id}`;
      if (date) {
        const adjustedDate = new Date(date);
        adjustedDate.setSeconds(0);
        adjustedDate.setMilliseconds(0);

        const formattedDate = format(
          adjustedDate,
          "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
        );
        console.log("formattedDate:", formattedDate);
        query += `&date=${formattedDate}`;
      }
      if (doctorId) query += `&doctorId=${doctorId}`;
      if (status) query += `&status=${status}`;

      fetch(
        `http://localhost:8000/Patient-home/view-perscriptions?${query}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((data) => {
          const prescriptions = data.perscriptions;
          setPrescriptions(prescriptions);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setPrescriptions([]);
        });
    };
    handleFetchPrescriptions();
  }, []);
  const handleFetchPrescriptions = () => {
    // Construct the query string with filters
    let query = `patientId=${id}`;
    if (date) query += `&date=${date}`;
    if (doctorId) query += `&doctorId=${doctorId}`;
    if (status) query += `&status=${status}`;
    // var filtered =prescriptions.filter((perscription)=>perscription.date.includes(date))
    // console.log(filtered[0].date)
    fetch(
      `http://localhost:8000/Patient-home/view-perscriptions?${query}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        const prescriptions = data.perscriptions;
        setPrescriptions(prescriptions);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setPrescriptions([]);
      });
  };
  const handleSelectPrescription = (prescId) => {
    fetch(
      `http://localhost:8000/Patient-home/view-perscription?prescId=${prescId}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        setSelectedPrescription(data.perscription);
      })
      .catch((error) => {
        console.error("Error fetching prescription data:", error);
        setSelectedPrescription(null);
      });
  };
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

      <div>
        <TextField
          select
          id="status"
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="">Select Status</MenuItem>
          <MenuItem value="filled">Filled</MenuItem>
          <MenuItem value="unfilled">Unfilled</MenuItem>
        </TextField>
      </div>

      <button onClick={handleFetchPrescriptions}>Filter</button>

      {prescriptions.map((prescription) => (
        <div key={prescription._id}>
          <p>ID: {prescription._id}</p>
          <p>Description: {prescription.description}</p>
          <button onClick={() => handleSelectPrescription(prescription._id)}>
            Select Prescription
          </button>
          {selectedPrescription &&
            selectedPrescription._id === prescription._id && (
              <div>
                <p>Status: {selectedPrescription.status}</p>
                <p>Date: {selectedPrescription.date}</p>
                <p>Doctor: {selectedPrescription.doctor}</p>
                <p>Patient: {selectedPrescription.patient}</p>
              </div>
            )}
        </div>
      ))}
    </div>
  );
}

export default PrescriptionDataText;
