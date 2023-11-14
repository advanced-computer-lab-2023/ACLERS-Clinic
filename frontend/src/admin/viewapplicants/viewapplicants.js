// ViewApplicants.js

import ApplicantDetails from "../../components/applicantdetails.js";
import { Link, useNavigate } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";
import React, { useEffect, useState } from "react";
const ViewApplicants = () => {
  const [applicants, setApplicants] = useState(null);
  const [contractDetails, setContractDetails] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
useEffect(()=>{
  fetchApplicants()
},[])
  const fetchApplicants = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch("http://localhost:8000/admin/view-applicants", requestOptions);
    const json = await response.json();
  console.log(json)
    if (response.ok) {
      setApplicants(json);
    }
  };

  const handleAccept = (applicantId) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        description: contractDetails[applicantId],
      }),
    };

    fetch(`/admin/approve-doctor?applicantId=${applicantId}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        
        console.log("Doctor approved:", data);
        // Refresh the list of applicants after approving
        alert("Contract is sent")
        fetchApplicants();
        
      })
      .catch((error) => {
        console.error("Error approving doctor:", error);
      });
  };

  const handleReject = (applicantId) => {
    fetch(`/admin/reject-doctor?applicantId=${applicantId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Doctor rejected:", data);
        // Refresh the list of applicants after rejecting
        fetchApplicants();
      })
      .catch((error) => {
        console.error("Error rejecting doctor:", error);
      });
  };

  if (!token) {
    return <div>ACCESS DENIED, You are not authenticated, please log in</div>;
  }

  if (decodedToken.role !== "admin") {
    return <div>ACCESS DENIED, You are not authorized</div>;
  }

  return (
    <div className="applicantviewer">
      <button onClick={() => navigate(-1)}>Go Back</button>
      <h1>Applicants</h1>
      {applicants &&
        applicants.map((applicant) => (
          <div key={applicant._id}>
            <ApplicantDetails applicant={applicant} />
            <textarea
              placeholder="Enter employment contract details"
              value={contractDetails[applicant._id] || ""}
              onChange={(e) =>
                setContractDetails({
                  ...contractDetails,
                  [applicant._id]: e.target.value,
                })
              }
            />
            <button onClick={() => handleAccept(applicant._id)}>Accept</button>
            <button onClick={() => handleReject(applicant._id)}>Reject</button>
          </div>
        ))}
    </div>
  );
};

export default ViewApplicants;
