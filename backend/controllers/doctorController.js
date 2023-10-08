const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const Doctor = require('../models/Doctor');
const RegisteredPatients = require('../models/RegisteredPatients');
const PatientHealthRecord = require('../models/PatientHealthRecord');
const Appointment = require('../models/Appointment')
const Patient = require('../models/Patient');
const Perscription = require('../models/Perscription');

const editEmail=asyncHandler(async(req,res)=>{
         const doctorID=req.query.doctorID
                 console.log(doctorID)
                     const newEmail = req.body.email;
          const newHourlyRate=req.body.hourlyRate
     const newAffiliation=req.body.affiliation


try {

  const doctor = await Doctor.findById(doctorID);

  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  // Update the doctor's email
  if (newEmail!=null){
    const existingDoctor = await Doctor.findOne({ email: newEmail });

    if (existingDoctor) {
      res.status(400).json({ exists: true, message: 'Email already taken' });
    } else {
    
  doctor.email = newEmail;
  }}
if (newHourlyRate!=null){
  doctor.hourlyRate=newHourlyRate
}
if (newAffiliation!=null){
  doctor.affiliation=newAffiliation
}
  // Save the updated doctor
  await doctor.save();

  res.status(200).json({ message: 'Doctor email updated successfully', doctor });
} catch (error) {
  console.error('Error updating doctor email:', error);
  res.status(500).json({ message: 'Internal server error' });
}





})

const filterAppointments = asyncHandler(async (req, res) => {

  try {
      const { doctorId, status, date } = req.query;

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
      const appointments = await Appointment.find(filter).populate('patient','-password');

      res.status(200).json(appointments);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
const viewPatients = asyncHandler(async (req, res) => {
  const doctorId = req.query.doctorId;
  const status = req.query.status
  
  const registeredPatients = await RegisteredPatients.findOne({ doctor: doctorId });

  if (!registeredPatients) {
    return res.status(404).json({ message: 'RegisteredPatients document not found for the doctor.' });
  }

  
  const patientHealthRecordIds = registeredPatients.patients;

  
  const patientsHealthRecords = await PatientHealthRecord.find({ _id: { $in: patientHealthRecordIds } });

  
  const patientIds = patientsHealthRecords.map(record => record.patient);


  const patients = await Patient.find({ _id: { $in: patientIds } }).select('-password');

 var filteredPatients = patients
 if (status) {
  filteredPatients = await Promise.all(filteredPatients.map(async patient => {
    // Assuming Appointment schema has a 'status' field
    const hasMatchingAppointment = await Appointment.exists({ patient: patient._id, status: status, doctor: doctorId });
    console.log(hasMatchingAppointment)
    return hasMatchingAppointment ? patient : null;
  }));
  filteredPatients = filteredPatients.filter(patient => patient !== null);
  console.log(filteredPatients);
}
  const patientMap = filteredPatients.reduce((acc, patient) => {
    acc[patient._id.toString()] = patient;
    return acc;
  }, {});
  
  const patientsWithHealthRecords = patientsHealthRecords.map(record => ({
    patient: patientMap[record.patient.toString()],
    healthRecord: record.healthRecord,
  }));

  // Return the patients along with their health records
  res.status(200).json({ patients: patientsWithHealthRecords });
});

const viewPatient = asyncHandler(async (req,res)=>{
   const {doctorId,patientId}= req.query

   const registeredPatients = await RegisteredPatients.findOne({ doctor: doctorId });

  if (!registeredPatients) {
    return res.status(404).json({ message: 'RegisteredPatients document not found for the doctor.' });
  }

  const patientHealthRecordIds = registeredPatients.patients;

  const patientsHealthRecords = await PatientHealthRecord.find({ _id: { $in: patientHealthRecordIds } });

  const patients = await Patient.find({ _id: patientId }).select('-password');

  if (!patients || patients.length === 0) {
    return res.status(404).json({ message: 'Patient not found.' });
  }

  const patientMap = patients.reduce((acc, patient) => {
    acc[patient._id.toString()] = patient;
    return acc;
  }, {});

  const patientWithHealthRecord = patientsHealthRecords.find(record => record.patient.toString() === patientId);

  if (!patientWithHealthRecord) {
    return res.status(404).json({ message: 'Patient health record not found.' });
  }

  const patientResponse = {
    patient: patientMap[patientId],
    healthRecord: patientWithHealthRecord.healthRecord,
  };

  // Return the patient along with their health record without the extra "patient" layer
  res.status(200).json(patientResponse);
})

const writePerscription = asyncHandler(async(req,res)=>{
   const {patientId,doctorId} = req.query
   const description = req.body.description
   const perscription = await Perscription.create({
   
    description:description,
    date:new Date(),
    status:'filled',
    patient:patientId,
    doctor:doctorId,
    


   })
   res.send(perscription)
})
const searchForPatient = asyncHandler( async (req, res) => {

   
  const { name } = req.body;

  // Define a filter object to build the query dynamically
  const filter ={}

  if (name) {
    // If 'status' is provided in the query, add it to the filter
    filter.name = name;
  }

 
  const patient= await Patient.find(filter)
  res.send(patient)
});
module.exports = {writePerscription,editEmail,filterAppointments,viewPatients,viewPatient,searchForPatient}

