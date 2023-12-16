import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";
import DoctorNavbar from "../components/DoctorNavbar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const AddPrescription = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [dosages, setDosages] = useState({});
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await fetch(
          "http://localhost:8000/Doctor-Home/get-Medicines",
          requestOptions
        );
        const data = await response.json();
        const medicinesData = data.medicines;
        setMedicines(medicinesData);

        // Initialize dosages for each medicine with default value 1
        const initialDosages = {};
        medicinesData.forEach((medicine) => {
          initialDosages[medicine.id] = 1;
        });
        setDosages(initialDosages);
      } catch (error) {
        console.error("Error fetching medicines from pharmacy:", error.message);
      }
    };

    fetchMedicines();
  }, [token]);

  const handleAddMedicine = (medicine) => {
    setSelectedMedicines((prevMedicines) => [
      ...prevMedicines,
      { ...medicine, dosage: dosages[medicine.id] },
    ]);
  };

  const handleRemoveMedicine = (medicineId) => {
    setSelectedMedicines((prevMedicines) =>
      prevMedicines.filter(
        (selectedMedicine) => selectedMedicine.id !== medicineId
      )
    );
  };

  const handleDosageChange = (medicineId, change) => {
    setDosages((prevDosages) => ({
      ...prevDosages,
      [medicineId]: Math.max(1, prevDosages[medicineId] + change),
    }));
  };

  const getRandomImageURL = () =>
    `https://source.unsplash.com/random?pill=${Math.random()}`;

  const handleSavePrescription = async () => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientId,
          doctorId: decodedToken.id,
          medicines: selectedMedicines,
        }),
      };

      const response = await fetch(
        `http://localhost:8000/write-prescription?patientId=${patientId}`,
        requestOptions
      );
      const data = await response.json();

      console.log("Prescription saved successfully:", data);
      if (response.ok) {
        navigate(`/doctor/view-patient/${patientId}`);
      } else {
        console.error("Error saving prescription");
      }
    } catch (error) {
      console.error("Error saving prescription:", error.message);
    }
  };

  return (
    <div style={{ marginLeft: "240px", padding: "20px" }}>
      <DoctorNavbar />

      <h1>Add Prescription</h1>
      <h2>Select Medicines</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {medicines &&
          medicines.map((medicine) => (
            <Card
              key={medicine.id}
              style={{ width: "30%", margin: "10px", textAlign: "left" }}
            >
              <CardContent>
                <Typography variant="h6" textAlign={"center"}>
                  {medicine.name}
                </Typography>
                <img
                  src={getRandomImageURL()}
                  alt={medicine.name}
                  style={{
                    width: "100%",
                    height: "150px", // Set the desired fixed height
                    objectFit: "cover", // Ensure the image covers the entire container
                    marginBottom: "10px",
                  }}
                />
                <Typography variant="body2">
                  Dosage: {medicine.dosage}
                </Typography>
                <Button onClick={() => handleDosageChange(medicine.id, 1)}>
                  +
                </Button>
                <Button onClick={() => handleDosageChange(medicine.id, -1)}>
                  -
                </Button>
                <Button onClick={() => handleAddMedicine(medicine)}>Add</Button>
              </CardContent>
            </Card>
          ))}
      </div>

      <h2>Selected Medicines</h2>
      <ul>
        {selectedMedicines &&
          selectedMedicines.map((selectedMedicine) => (
            <li key={selectedMedicine.id}>
              {selectedMedicine.name} - {selectedMedicine.dosage}
              <button onClick={() => handleRemoveMedicine(selectedMedicine.id)}>
                Remove
              </button>
            </li>
          ))}
      </ul>

      <button onClick={handleSavePrescription}>Save Prescription</button>
    </div>
  );
};

export default AddPrescription;
