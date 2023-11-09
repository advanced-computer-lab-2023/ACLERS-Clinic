import React, { useState, useEffect, useParams } from "react";

function ViewHealthRecords() {
  const [healthRecords, setHealthRecords] = useState([]);
  const patientId = useParams()
  // This is just a placeholder function to load health records; you need to replace it with actual API calls.
  const loadHealthRecords = () => {
    // Simulate loading health records from the database (replace with actual API call)
    setTimeout(() => {
      const fakeData = [
        { id: 1, record: "Sample Health Record 1" },
        { id: 2, record: "Sample Health Record 2" },
        // Add more records as needed
      ];
      setHealthRecords(fakeData);
    }, 1000); // Simulated delay for loading data
  };

  useEffect(() => {
    // Load health records when the component mounts
    loadHealthRecords();
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Patient Health Records</h1>
      
      <table style={{ margin: "0 auto" }}>
        <thead>
          <tr>
            <th>Record ID</th>
            <th>Health Record</th>
          </tr>
        </thead>
        <tbody>
          {healthRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{record.record}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        style={{ display: "block", margin: "20px auto" }}
        onClick={() => { window.location.href = `/doctor/healthrecords/${patientId}`;
          // Implement the logic to navigate to the "Add Health Records" page.
          // You can use React Router or your preferred navigation method.
        }}
      >
        Add Health Records
      </button>
    </div>
  );
}

export default ViewHealthRecords;
