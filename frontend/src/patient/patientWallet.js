import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaWallet } from "react-icons/fa";
import jwt from "jsonwebtoken-promisified";
import { useParams, useNavigate } from "react-router-dom";
import PatientNavbar from "../components/PatientNavbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";

const PatientBalance = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
  const patientId = decodedToken.id;

  useEffect(() => {
    // Fetch patient balance when the component mounts
    fetchPatientBalance();
  }, []);

  const fetchPatientBalance = () => {
    // Make a request to fetch patient balance
    fetch(`http://localhost:8000/Patient-Home/viewMyBalance`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Patient Balance:", data);
        setBalance(data.balance);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching patient balance:", error);
        setLoading(false);
      });
  };

  if (!token) {
    // Handle the case where id is not available
    return <div>ACCESS DENIED, You are not authenticated, please log in</div>;
  }

  return (
    <div>
      <PatientNavbar />

      <div
        className="container mt-5"
        style={{ marginLeft: "240px", padding: "20px" }}
      >
        <div>
          <CssBaseline />
          {/* Hero unit */}
          <Container
            disableGutters
            maxWidth="sm"
            component="main"
            sx={{ pt: 2, pb: 2 }}
          >
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Your Wallet
            </Typography>
          </Container>
        </div>
        <div className="row">
          <div className="col-md-6 mx-auto text-center">
            <div className="card">
              <div className="card-body">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <div>
                    <div>
                      <p>Your currently have:</p>
                      <h2 style={{ fontWeight: "bold" }}>
                        <FaWallet /> ${balance}
                      </h2>
                      <p>Available in your wallet.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientBalance;
