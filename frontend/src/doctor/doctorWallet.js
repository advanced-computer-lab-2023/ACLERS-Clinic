import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import jwt from "jsonwebtoken-promisified";
import { useParams, useNavigate } from "react-router-dom";
const DoctorBalance = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
  const patientId = decodedToken.id;
  useEffect(() => {
    // Fetch patient balance when the component mounts
    fetchDoctorBalance();
  }, []);

  const fetchDoctorBalance = () => {
  

    // Make a request to fetch patient balance
    fetch(`http://localhost:8000/Doctor-Home/viewMyBalance`, {
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
    <><button onClick={() => navigate(-1)}>Go Back</button>
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Patient Balance</h5>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <p>
                  Your current balance is: ${balance}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default DoctorBalance;
