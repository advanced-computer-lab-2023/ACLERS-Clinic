import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "react-datetime/css/react-datetime.css";
import { format } from "date-fns";
import PatientNavbar from "../components/PatientNavbar";
import { jsPDF } from "jspdf";
import { Button, Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { CardMedia } from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PrescriptionDetailsPopup from "../components/PrescriptionDetailsPopup";

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
  const [filterBy, setFilterBy] = useState("date");
  const [isDetailsPopupOpen, setDetailsPopupOpen] = useState(false);

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setDetailsPopupOpen(true);
  };

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
          console.log(data);
          console.log("hereeeeeeee");
          setPrescriptions(prescriptions);
          console.log(prescriptions);
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
      const response = await fetch(
        `http://localhost:8000/Patient-Home/fill-perscription?perscriptionId=${prescriptionId}`,
        {
          method: "POST", // Adjust the method if necessary
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

    doc.text("Prescription", 10, 10);
    doc.text(`ID: ${prescription._id}`, 10, 20);
    doc.text(
      `Date: ${new Date(prescription.date).toLocaleDateString("en-GB")}`,
      10,
      30
    );
    doc.text(`Doctor ID: ${prescription.doctor}`, 10, 40);
    doc.text(
      `Filled: ${prescription.status === "filled" ? "Yes" : "No"}`,
      10,
      50
    );
    doc.text("Medicines:", 10, 60);
    prescription.descriptions.forEach((description, index) => {
      doc.text(
        `Medicine Name: ${description.medicine.name}`,
        10,
        70 + index * 20
      );
      doc.text(`Dosage: ${description.dosage}`, 10, 80 + index * 20);
    });

    doc.save("prescription.pdf");
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
        console.log(data);
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
    <div style={{ marginLeft: "290px" }}>
      <PatientNavbar />
      <div
        style={{
          position: "relative",
          marginBottom: "10px",
        }}
      >
        {/* Background image */}
        <img
          src="https://as2.ftcdn.net/v2/jpg/01/15/92/83/1000_F_115928369_E2yDqT2WqvoKl6XmsmL6Yitlb6j9Lh1Q.jpg"
          alt="Background"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        {/* Content overlay */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "black",
            padding: "20px",
            background: "rgba(255, 255, 255, 0.8)",
            borderRadius: "10px",
          }}
        >
          <h1 style={{ fontSize: "2.5em", margin: "0", marginBottom: "10px" }}>
            Prescriptions
          </h1>
          <p style={{ fontSize: "1.3em", marginTop: "10px" }}>
            El7a2ni filters prescriptions efficiently by utilizing advanced
            algorithms, ensuring precise medication categorization based on
            factors like patient history and drug interactions. This streamlined
            process results in accurate and personalized medication
            recommendations.
          </p>
          {/* Filtering Interface */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <div className="filter-section">
              {/* Existing filter elements... */}
            </div>
          </div>
        </div>
      </div>
      {/* Prescription Cards */}
      <Grid container spacing={2}>
        {prescriptions.map((prescription) => (
          <Grid item xs={2.98} key={prescription._id}>
            <Card
              style={{
                width: "100%",
                margin: "10px 0",
                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
              }}
            >
              <CardContent style={{ height: "340px" }}>
                {/* Additional details */}
                {prescription.descriptions &&
                prescription.descriptions.length > 0 ? (
                  <div key={prescription.descriptions[0].medicine._id}>
                    <div style={{ height: "250px" }}>
                      <img
                        src={prescription.descriptions[0].medicine.picture}
                        alt="Medicine"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    </div>

                    <h2>{format(new Date(prescription.date), "MM/dd/yyyy")}</h2>
                    <p>Status: {prescription.status}</p>
                  </div>
                ) : (
                  <p>No descriptions found.</p>
                )}
              </CardContent>
              <div
                style={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {/* Icon Buttons */}
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#001F3F", // Dark Navy Blue
                    color: "white",
                    fontWeight: "bold",
                    padding: "8px 16px", // Add padding here
                  }}
                  onClick={() => handleViewPrescription(prescription)}
                  startIcon={<LibraryBooksIcon />}
                >
                  View Prescription
                </Button>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#114B5F", // Green
                    color: "white",
                    fontWeight: "bold",
                    padding: "8px 16px", // Add padding here
                  }}
                  onClick={() => handleFillPrescription(prescription._id)}
                  startIcon={<CheckCircleIcon />}
                >
                  Fill Prescription
                </Button>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#2D5968", // Blue
                    color: "white",
                    fontWeight: "bold",
                    padding: "8px 16px", // Add padding here
                  }}
                  onClick={() => downloadPdf(prescription)}
                  startIcon={<CloudDownloadIcon />}
                >
                  Download PDF
                </Button>
              </div>
              {selectedPrescription &&
                selectedPrescription._id === prescription._id && (
                  <div>{/* Selected prescription details... */}</div>
                )}
            </Card>
          </Grid>
        ))}
      </Grid>
      <PrescriptionDetailsPopup
        isOpen={isDetailsPopupOpen}
        onClose={() => setDetailsPopupOpen(false)}
        prescription={selectedPrescription}
      />
    </div>
  );
}

export default PrescriptionDataText;
