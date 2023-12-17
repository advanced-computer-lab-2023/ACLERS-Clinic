import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";
import DoctorNavbar from "../components/DoctorNavbar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const AddPrescription = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [dosage, setDosage] = useState(1);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
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
      } catch (error) {
        console.error("Error fetching medicines from pharmacy:", error.message);
      }
    };

    fetchMedicines();
  }, [token]);

  const getRandomImageURL = () =>
    `https://source.unsplash.com/random?pill=${Math.random()}`;

  const handleAddMedicine = (medicine) => {
    console.log(medicine+"adddddddd")
    setSelectedMedicine(medicine);
    console.log(selectedMedicine+"selecteeeddddd")
    setOpenDialog(true);
  };

  const handleRemoveMedicine = (medicineId) => {
    setSelectedMedicines((prevMedicines) =>
      prevMedicines.filter(
        (selectedMedicine) => selectedMedicine.medicine !== medicineId
      )
    );
  };

  const handleDosageChange = (change) => {
    setDosage(Math.max(1, dosage + change));
  };

  const handleSaveDosage = () => {
    console.log(selectedMedicine+"saveeeee")
    if (selectedMedicine) {
      setSelectedMedicines((prevMedicines) => [
        ...prevMedicines,
        { medicine: selectedMedicine._id, dosage },
      ]);
      setOpenDialog(false);
    }
    console.log(selectedMedicines)
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
          description: selectedMedicines,
        }),
      };

      const response = await fetch(
        `http://localhost:8000/Doctor-Home/write-prescription?patientId=${patientId}`,
        requestOptions
      );
      const data = await response.json();

      console.log("Prescription saved successfully:", data);
      if (response.ok) {
        setSuccessDialogOpen(true);
      } else {
        console.error("Error saving prescription");
      }
    } catch (error) {
      console.error("Error saving prescription:", error.message);
    }
  };
  const handleCloseSuccessDialog = () => {
    // Close the success dialog
    setSuccessDialogOpen(false);
    // Redirect or perform any other action after closing the dialog
   
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
                    height: "150px",
                    objectFit: "cover",
                    marginBottom: "10px",
                  }}
                />
                <Typography variant="body2">
                  Dosage: {medicine.dosage}
                </Typography>
                <Button onClick={() => handleDosageChange(1)}>+</Button>
                <Button onClick={() => handleDosageChange(-1)}>-</Button>
                <Button onClick={() => handleAddMedicine(medicine)}>Add</Button>
              </CardContent>
            </Card>
          ))}
      </div>

      <h2>Selected Medicines</h2>
      <ul>
      {selectedMedicines &&
  selectedMedicines.map((selectedMedicine) => {
    // Find the medicine object based on its ID
    const medicineObject = medicines.find(
      (medicine) => medicine._id === selectedMedicine.medicine
    );

    return (
      <li key={selectedMedicine.medicine}>
        {medicineObject ? (
          <>
            {medicineObject.name} - {selectedMedicine.dosage}
            <button
              onClick={() => handleRemoveMedicine(selectedMedicine.medicine)}
            >
              Remove
            </button>
          </>
        ) : (
          <span>Medicine not found</span>
        )}
      </li>
    );
  })}

      </ul>

      {/* Dialog for entering dosage */}
      <Dialog
        open={successDialogOpen}
        onClose={handleCloseSuccessDialog}
      >
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <Typography>
            Prescription saved successfully!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Enter Dosage</DialogTitle>
        <DialogContent>
          <TextField
            label="Dosage"
            type="number"
            value={dosage}
            onChange={(e) => setDosage(Math.max(1, parseInt(e.target.value) || 0))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveDosage} color="primary">
            Save Dosage
          </Button>
        </DialogActions>
      </Dialog>

      <button onClick={handleSavePrescription}>Save Prescription</button>
    </div>
  );
};

export default AddPrescription;