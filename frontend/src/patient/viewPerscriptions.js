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
import {jsPDF} from "jspdf";
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
          const prescriptions = data.prescriptions;
          console.log(data)
          console.log("hereeeeeeee")
          setPrescriptions(prescriptions);
          console.log(prescriptions)
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setPrescriptions([]);
        });
    };
    handleFetchPrescriptions();
  }, []);
  const handleFillPrescription = async (prescriptionId) => {
    try {
      const response = await fetch(`http://localhost:8000/Patient-Home/fill-perscription?perscriptionId=${prescriptionId}`, {
        method: "POST", // Adjust the method if necessary
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        // Prescription filled successfully, you might want to update the UI accordingly
        console.log("Prescription filled successfully");
      } else {
        console.error("Failed to fill prescription");
      }
    } catch (error) {
      console.error("Error filling prescription:", error);
    }
  };
  const downloadPdf = (prescription) => {
    const doc = new jsPDF();

    doc.text('Prescription', 10, 10);
    doc.text(`ID: ${prescription._id}`, 10, 20);
    doc.text(`Date: ${new Date(prescription.date).toLocaleDateString('en-GB')}`, 10, 30);
    doc.text(`Doctor ID: ${prescription.doctor}`, 10, 40);
    doc.text(`Filled: ${prescription.status === 'filled' ? 'Yes' : 'No'}`, 10, 50);
    doc.text('Medicines:', 10, 60);
    prescription.descriptions.forEach((description, index) => {
        doc.text(`Medicine Name: ${description.medicine.name}`, 10, 70 + (index * 20));
        doc.text(`Dosage: ${description.dosage}`, 10, 80 + (index * 20));
    });
   

    doc.save('prescription.pdf');
};
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
        const prescriptions = data.prescriptions;
        console.log(data)
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
      {/* <PatientNavbar /> */}

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

      {prescriptions ? (
  prescriptions.map((prescription) => (
    <div key={prescription._id}>
      <p>ID: {prescription._id}</p>
      {prescription.descriptions && prescription.descriptions.length > 0 ? (
        prescription.descriptions.map((description, index) => (
          <div key={index}>
            <p>Dosage: {description.dosage}</p>
            <p>Medicine: {description.medicine.name}</p>
            {/* Assuming each 'medicine' is an object with the following properties */}
            {description.medicine && (
              <div>
                <p>Details: {description.medicine.details}</p>
                <p>Medicinal Use: {description.medicine.medicinialUse}</p>
                <p>Name: {description.medicine.name}</p>
                <p>Picture: <img src={description.medicine.picture} alt="Medicine" /></p>
                <p>Price: {description.medicine.price}</p>
               
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No descriptions found.</p>
      )}
      <button onClick={() => handleSelectPrescription(prescription._id)}>
        Select Prescription
      </button>
      <button onClick={() => handleFillPrescription(prescription._id)}>
        Fill Prescription
      </button>
      <button onClick={() => downloadPdf(prescription)}>
        download PDF
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
  ))
) : (
  <p>No prescriptions found.</p>
)}


    </div>
  );
}

export default PrescriptionDataText;
