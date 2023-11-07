const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Doctor = require("../models/Doctor");
const RegisteredPatients = require("../models/RegisteredPatients");
const PatientHealthRecord = require("../models/PatientHealthRecord");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Perscription = require("../models/Perscription");

const editEmail = asyncHandler(async (req, res) => {
  const doctorID = req.user.id;
  console.log(doctorID);
  const newEmail = req.body.email;
  const newHourlyRate = req.body.hourlyRate;
  const newAffiliation = req.body.affiliation;

  try {
    const doctor = await Doctor.findById(doctorID);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Update the doctor's email
    if (newEmail != null) {
      const existingDoctor = await Doctor.findOne({ email: newEmail });

      if (existingDoctor && doctor._id == existingDoctor._id) {
       return res.status(400).json({ exists: true, message: "Email already taken" });
      } else {
        doctor.email = newEmail;
      }
    }
    if (newHourlyRate != null) {
      doctor.hourlyRate = newHourlyRate;
    }
    if (newAffiliation != null) {
      doctor.affiliation = newAffiliation;
    }
    // Save the updated doctor
    await doctor.save();

    res
      .status(200)
      .json({ message: "Doctor email updated successfully", doctor });
  } catch (error) {
    console.error("Error updating doctor email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const filterAppointments = asyncHandler(async (req, res) => {
  try {
    const {  status, date } = req.query;
 const doctorId =req.user.id;
    // Define a filter object to build the query dynamically
    const filter = { doctor: doctorId };

    if (status) {
      // If 'status' is provided in the query, add it to the filter
      filter.status = status;
    }

    if (date) {
      // If 'date' is provided in the query, convert it to a Date object and add it to the filter
      filter.date = new Date(date);
    }

    // Use the filter object to query the database
    const appointments = await Appointment.find(filter)
    appointments.forEach(async (map)=>{
     const patient = await Patient.findById(map.patient)
    // console.log(patient)
     console.log(map.patient)
     map.patient =patient
    })
    res.status(200).json(appointments);
    //console.log(appointments)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
const viewPatients = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const status = req.query.status;
  // console.log(doctorId)
  const registeredPatients = await RegisteredPatients.findOne({
    doctor: doctorId,
  });
   console.log(registeredPatients,"registered")
  if (!registeredPatients) {
    return res
      .status(404)
      .json({
        message: "RegisteredPatients document not found for the doctor.",
      });
  }

  const patientHealthRecordIds = registeredPatients.patients;
  console.log(registeredPatients.patients)
console.log(patientHealthRecordIds,"ids")
  const patientsHealthRecords = await PatientHealthRecord.find({
    _id: { $in: patientHealthRecordIds },
  });
  console.log(patientsHealthRecords,"patient halth record")
  const patientIds = patientsHealthRecords.map((record) => record.patient);

  const patients = await Patient.find({ _id: { $in: patientIds } }).select(
    "-password"
  );

  var filteredPatients = patients;
  console.log(patients,"patients")
  if (status) {
    filteredPatients = await Promise.all(
      filteredPatients.map(async (patient) => {
        // Assuming Appointment schema has a 'status' field
        const hasMatchingAppointment = await Appointment.exists({
          patient: patient._id,
          status: status,
          doctor: doctorId,
        });
      //  console.log(hasMatchingAppointment);
        return hasMatchingAppointment ? patient : null;
      })
    );
    filteredPatients = filteredPatients.filter((patient) => patient !== null);
   console.log(filteredPatients);
  }
  const patientMap = filteredPatients.reduce((acc, patient) => {
    acc[patient._id.toString()] = patient;
    return acc;
  }, {});
console.log(patientMap,"map")
  const patientsWithHealthRecords = patientsHealthRecords.map((record) => ({
    patient: patientMap[record.patient.toString()],
    healthRecord: record.healthRecord,
  }));
   console.log(patientsWithHealthRecords)
  // Return the patients along with their health records
  res.status(200).send( patientsWithHealthRecords );
});

const viewPatient = asyncHandler(async (req, res) => {
  const {  patientId } = req.query;
  const doctorId=req.user.id;

  const registeredPatients = await RegisteredPatients.findOne({
    doctor: doctorId,
  });

  if (!registeredPatients) {
    return res
      .status(404)
      .json({
        message: "RegisteredPatients document not found for the doctor.",
      });
  }

  const patientHealthRecordIds = registeredPatients.patients;

  const patientsHealthRecords = await PatientHealthRecord.find({
    _id: { $in: patientHealthRecordIds },
  });

  const patients = await Patient.find({ _id: patientId }).select("-password");

  if (!patients || patients.length === 0) {
    return res.status(404).json({ message: "Patient not found." });
  }

  const patientMap = patients.reduce((acc, patient) => {
    acc[patient._id.toString()] = patient;
    return acc;
  }, {});

  const patientWithHealthRecord = patientsHealthRecords.find(
    (record) => record.patient.toString() === patientId
  );

  if (!patientWithHealthRecord) {
    return res
      .status(404)
      .json({ message: "Patient health record not found." });
  }

  const patientResponse = {
    patient: patientMap[patientId],
    healthRecord: patientWithHealthRecord.healthRecord,
  };

  // Return the patient along with their health record without the extra "patient" layer
  res.status(200).json(patientResponse);
});
const viewMyInfo = asyncHandler(async (req,res)=>{
  try{
    const id = req.user.id;
    const doctor = await Doctor.findById(id)
    if(doctor){
      res.status(200).send(doctor)
    }else{
      res.status(404).json({message:'doctor not found'})
    }
  }catch(error){
    res.status(400).send(error)
  }
})

const writePerscription = asyncHandler(async (req, res) => {
  const { patientId } = req.query;
  const doctorId = req.user.id;
  const description = req.body.description;
  const perscription = await Perscription.create({
    description: description,
    date: new Date(),
    status: "filled",
    patient: patientId,
    doctor: doctorId,
  });
  res.send(perscription);
});
const searchForPatient = asyncHandler(async (req, res) => {
  const { name } = req.body;

  // Define a filter object to build the query dynamically
  const filter = {};

  if (name) {
    // If 'status' is provided in the query, add it to the filter
    filter.name = name;
  }

  const patient = await Patient.find(filter);
  res.send(patient);
});
module.exports = {
  writePerscription,
  editEmail,
  filterAppointments,
  viewPatients,
  viewPatient,
  searchForPatient,
  viewMyInfo
};
