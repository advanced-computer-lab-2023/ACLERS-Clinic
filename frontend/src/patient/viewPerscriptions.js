import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate, useParams } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";

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
  useEffect(() => {
    const handleFetchPrescriptions = () => {
      // Construct the query string with filters
      let query = `patientId=${id}`;
      if (date) query += `&date=${date}`;
      if (doctorId) query += `&doctorId=${doctorId}`;
      if (status) query += `&status=${status}`;

      fetch(`http://localhost:8000/Patient-home/view-perscriptions?${query}`)
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
    fetch(`http://localhost:8000/Patient-home/view-perscriptions?${query}`)
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
      `http://localhost:8000/Patient-home/view-perscription?prescId=${prescId}`
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

  return (
    <div>
      <button onClick={() => navigate(-1)}>Go Back</button>

      <div>
        <TextField
          id="date"
          label="Date"
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>

      <div>
        <TextField
          id="doctorId"
          label="Doctor ID"
          type="text"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
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
