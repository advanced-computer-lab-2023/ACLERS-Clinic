import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function SelectedDoctor() {
  const { doctorId, sessionPrice } = useParams();
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    // Fetch the details of the selected doctor using the doctorId from the route parameters
    const token = localStorage.getItem("token");
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    // Include the sessionPrice in the request URL
    const url = `http://localhost:8000/Patient-home/view-doctor?doctorId=${doctorId}&sessionPrice=${sessionPrice}`;

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setSelectedDoctor(data);
        console.log("data", data);
      })
      .catch((error) => {
        console.error("Error fetching doctor data:", error);
        setSelectedDoctor(null);
      });
  }, [doctorId, sessionPrice]);

  return (
    <div>
      <h1>Your Selected Doctor</h1>

      {selectedDoctor ? (
        <div>
          <p>ID: {selectedDoctor._id}</p>
          <p>Name: {selectedDoctor.username}</p>
          <p>Email: {selectedDoctor.email}</p>
          <p>Hourly Rate: {selectedDoctor.hourlyRate}</p>
          <p>Affiliation: {selectedDoctor.affiliation}</p>
          <p>Educational Background: {selectedDoctor.educationalBackground}</p>
          {/* Add other details you want to display */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default SelectedDoctor;
