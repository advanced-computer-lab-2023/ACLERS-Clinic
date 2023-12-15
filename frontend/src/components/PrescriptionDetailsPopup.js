import React from "react";
import { Dialog, DialogContent, Button, Typography } from "@mui/material";
import { format } from "date-fns";

const PrescriptionDetailsPopup = ({ isOpen, onClose, prescription }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent>
        {prescription && (
          <>
            <Typography variant="h4">Prescription Details</Typography>
            <Typography>
              Date:{format(new Date(prescription.date), "MM/dd/yyyy")}
            </Typography>
            <Typography>Status: {prescription.status}</Typography>

            {/* Display medicine details */}
            {prescription.descriptions &&
              prescription.descriptions.length > 0 && (
                <>
                  <Typography variant="h5">Medicine Details</Typography>
                  {prescription.descriptions.map((description, index) => (
                    <div key={index}>
                      <Typography variant="h6">
                        Medicine {index + 1}:
                      </Typography>
                      <img
                        src={description.medicine.picture}
                        alt="Medicine"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                      <Typography>Dosage: {description.dosage}</Typography>
                      <Typography>Name: {description.medicine.name}</Typography>
                      {/* Add more medicine details as needed */}
                      {description.medicine && (
                        <div>
                          <Typography>
                            Details: {description.medicine.details}
                          </Typography>
                          <Typography>
                            Medicinal Use: {description.medicine.medicinalUse}
                          </Typography>
                          <Typography>
                            Price: {description.medicine.price}
                          </Typography>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}

            <Button variant="contained" onClick={onClose}>
              Close
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionDetailsPopup;
