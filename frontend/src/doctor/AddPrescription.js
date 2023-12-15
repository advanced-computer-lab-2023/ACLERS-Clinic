import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import jwt from "jsonwebtoken-promisified";

const AddPrescription = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [dosages, setDosages] = useState({}); // State for storing dosages

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

        const response = await fetch('http://localhost:8000/Doctor-Home/get-Medicines', requestOptions);
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
        console.error('Error fetching medicines from pharmacy:', error.message);
      }
    };

    fetchMedicines();
  }, [token]);

  const handleAddMedicine = (medicine) => {
    // Add selected medicine with its dosage to the list
    setSelectedMedicines((prevMedicines) => [
      ...prevMedicines,
      { ...medicine, dosage: dosages[medicine.id] },
    ]);
  };

  const handleRemoveMedicine = (medicineId) => {
    // Remove selected medicine from the list
    setSelectedMedicines((prevMedicines) =>
      prevMedicines.filter((selectedMedicine) => selectedMedicine.id !== medicineId)
    );
  };

  const handleDosageChange = (medicineId, change) => {
    setDosages((prevDosages) => ({
      ...prevDosages,
      [medicineId]: Math.max(1, prevDosages[medicineId] + change),
    }));
  };

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

      const response = await fetch(`http://localhost:8000/write-prescription?patientId=${patientId}`, requestOptions);
      const data = await response.json();

      console.log('Prescription saved successfully:', data);
      if (response.ok) {
        navigate(`/doctor/view-patient/${patientId}`);
      } else {
        console.error('Error saving prescription');
      }
    } catch (error) {
      console.error('Error saving prescription:', error.message);
    }
  };

  return (
    <div>
      <button onClick={() => navigate(`/doctor/view-patient/${patientId}`)}>Go Back</button>

      <h1>Add Prescription</h1>
      <h2>Select Medicines</h2>
      <ul>
        {medicines && medicines.map((medicine) => (
          <li key={medicine.id}>
            {medicine.name} - {medicine.dosage} {/* Display dosage next to medicine */}
            <button onClick={() => handleDosageChange(medicine.id, 1)}>+</button>
            <button onClick={() => handleDosageChange(medicine.id, -1)}>-</button>
            <button onClick={() => handleAddMedicine(medicine)}>Add</button>
          </li>
        ))}
      </ul>

      <h2>Selected Medicines</h2>
      <ul>
        {selectedMedicines && selectedMedicines.map((selectedMedicine) => (
          <li key={selectedMedicine.id}>
            {selectedMedicine.name} - {selectedMedicine.dosage}
            <button onClick={() => handleRemoveMedicine(selectedMedicine.id)}>Remove</button>
          </li>
        ))}
      </ul>

      <button onClick={handleSavePrescription}>Save Prescription</button>
    </div>
  );
};

export default AddPrescription;
