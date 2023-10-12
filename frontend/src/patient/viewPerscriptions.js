import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

function PrescriptionDataGrid() {
  const [prescriptions, setPrescriptions] = useState([]);
  const columns = [
    { field: "_id", headerName: "ID", width: 275 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "status", headerName: "Status", width: 200 },
    { field: "date", headerName: "Date", width: 200 },
    { field: "doctor", headerName: "Doctor", width: 200 },
    { field: "patient", headerName: "Patient", width: 200 },
  ];

  useEffect(() => {
    // Fetch prescription information from the API
    fetch(
      "http://localhost:8000/Patient-home/view-perscriptions?patientId=651f1a0ffa0441d0e58c0700"
    )
      .then((response) => response.json())
      .then((data) => {
        const prescriptionData = data.perscriptions; // Access the "perscriptions" array

        if (prescriptionData && prescriptionData.length > 0) {
          const prescriptionsWithIds = prescriptionData.map(
            (prescription, index) => ({
              id: index + 1, // You can use a different method to generate IDs if needed
              ...prescription,
            })
          );

          setPrescriptions(prescriptionsWithIds);
        } else {
          setPrescriptions([]); // No prescriptions found, set the state to an empty array
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={prescriptions}
        columns={columns}
        pageSize={10}
        checkboxSelection
      />
    </div>
  );
}

export default PrescriptionDataGrid;
