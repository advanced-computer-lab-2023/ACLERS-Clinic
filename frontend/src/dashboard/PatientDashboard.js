import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

function DoctorDataGrid() {
  const [doctors, setDoctors] = useState([]);
  const columns = [
    { field: "_id", headerName: "ID", width: 275 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "affiliation", headerName: "Affiliation", width: 200 },
    {
      field: "educationalBackground",
      headerName: "Educational Background",
      width: 300,
    },
    { field: "speciality", headerName: "Speciality", width: 200 },
    { field: "sessionPrice", headerName: "Session Price", width: 150 },
  ];

  useEffect(() => {
    // Fetch doctor information from the API
    fetch("http://localhost:8000/Patient-home/view-doctors")
      .then((response) => response.json())
      .then((data) => {
        // Generate unique IDs for each doctor
        const doctorsWithIds = data.map((doctor, index) => ({
          id: index + 1, // You can use a different method to generate IDs if needed
          ...doctor,
        }));

        setDoctors(doctorsWithIds);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={doctors}
        columns={columns}
        pageSize={10}
        checkboxSelection
      />
    </div>
  );
}

export default DoctorDataGrid;
