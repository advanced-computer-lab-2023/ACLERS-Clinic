const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient', // Reference to the patient who owns the medical history
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  attachments: [
    {
      filename: String, // Original name of the attached file
      path: String, // Path to the attached file in the server's filesystem or storage service
    },
  ],
});

const PatientMedicalHistory = mongoose.model('MedicalHistory', medicalHistorySchema);

module.exports = PatientMedicalHistory;
