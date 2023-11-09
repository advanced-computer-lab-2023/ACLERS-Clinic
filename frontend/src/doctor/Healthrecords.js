import React, { useState } from "react";
import { useParams } from "react-router-dom";

function HealthRecordForm({ onAddRecord }) {
  const [healthRecord, setHealthRecord] = useState("");
  const patientId = useParams()// You need to get/set the patientId from your application state.

  const handleAddRecord = async () => {
    // Create a new health record object
    const newRecord = {
      healthRecord,
    };

    // Define the request data including the patientId in the query params
    const requestData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRecord),
    };

    try {
      const response = await fetch(
        `http://localhost:8000/Doctor-Home/add-health-record?patientId=${patientId}`,
        requestData
      );

      if (response.ok) {
        // Successful POST request, you can handle the response if needed
        const responseData = await response.json();
        onAddRecord(responseData);
        setHealthRecord("");
        window.location.href=`/doctor/viewhealthrecords/${patientId}`// Clear the form field
      } else {
        // Handle the error case here
        console.error("Failed to add health record.");
       
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const inputStyle = {
    width: "100%",
    fontSize: "24px",
    padding: "10px",
    marginBottom: "10px",
  };

  const labelStyle = {
    fontSize: "24px",
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  };

  return (
    <div style={containerStyle}>
      <h2 style={labelStyle}>Add New Health Record</h2>
      <form>
        <label style={labelStyle}>Health Record:</label>
        <input
          style={inputStyle}
          type="text"
          value={healthRecord}
          onChange={(e) => setHealthRecord(e.target.value)}
          placeholder="Enter health record"
        />

        <button type="button" onClick={handleAddRecord}>
          Add Record
        </button>
      </form>
    </div>
  );
}

export default HealthRecordForm;