import React, { useState, useEffect } from "react";
import jwt from "jsonwebtoken-promisified";
import { Typography } from "@mui/material";
const ContractDetails = () => {
  const [contractDetails, setContractDetails] = useState(null);
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
  console.log("decoded Token:", decodedToken);
  useEffect(() => {
    // Fetch contract details on component mount
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    fetch("http://localhost:8000/Doctor-Home/viewMyContract", requestOptions)
      .then((response) => response.json())
      .then((data) => setContractDetails(data))
      .catch((error) =>
        console.error("Error fetching contract details:", error)
      );
  }, []); // Empty dependency array to run the effect only once on mount

  const handleAccept = () => {
    // Call the suitable backend API for accepting the contract
    fetch("http://localhost:8000/Doctor-Home/acceptContract", {
      method: "POST", // Adjust the method if needed
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action: "accept" }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Contract accepted:", result);
        window.location.href = "/login";
        // You can update the UI or redirect the user as needed
      })
      .catch((error) => console.error("Error accepting contract:", error));
  };

  const handleReject = () => {
    // Call the suitable backend API for rejecting the contract
    fetch("http://localhost:8000/Doctor-Home/denyContract", {
      method: "POST", // Adjust the method if needed
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action: "reject" }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Contract rejected:", result);
        // You can update the UI or redirect the user as needed
      })
      .catch((error) => console.error("Error rejecting contract:", error));
  };

  return (
    <div>
      {contractDetails ? (
        <>
          <Typography variant="h6">Contract Details</Typography>
          <Typography variant="body1">{contractDetails.description}</Typography>
          <button className="filter-button" onClick={handleAccept}>
            Accept
          </button>

          <button
            className="filter-button"
            style={{ marginLeft: "10px" }}
            onClick={handleReject}
          >
            Reject
          </button>
        </>
      ) : (
        <p>Loading contract details...</p>
      )}
    </div>
  );
};

export default ContractDetails;
