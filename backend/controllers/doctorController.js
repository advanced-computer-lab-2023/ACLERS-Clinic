const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Doctor = require("../models/Doctor");
const RegisteredPatients = require("../models/RegisteredPatients");
const PatientHealthRecord = require("../models/PatientHealthRecord");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Perscription = require("../models/Perscription");
const DoctorSlot = require("../models/FreeSlots"); // Import the DoctorSlot model
const Wallet = require("../models/Wallet");
const Contract = require("../models/Contract"); // Import the EmploymentContract model
const Applicant = require("../models/Applicant");
const FreeSlots = require("../models/FreeSlots");
const FollowUps = require("../models/FollowUps");
const axios = require("axios");
const FreeSlot = require("../models/FreeSlots");

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
        return res
          .status(400)
          .json({ exists: true, message: "Email already taken" });
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
    const { status, date } = req.query;
    const doctorId = req.user.id;
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
    const appointments = await Appointment.find(filter).populate('patient')
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
  console.log(registeredPatients, "registered");
  if (!registeredPatients) {
    return res.status(404).json({
      message: "RegisteredPatients document not found for the doctor.",
    });
  }

  const patientHealthRecordIds = registeredPatients.patients;
  console.log(registeredPatients.patients);
  console.log(patientHealthRecordIds, "ids");
  const patientsHealthRecords = await PatientHealthRecord.find({
    _id: { $in: patientHealthRecordIds },
  });
  console.log(patientsHealthRecords, "patient halth record");
  const patientIds = patientsHealthRecords.map((record) => record.patient);

  const patients = await Patient.find({ _id: { $in: patientIds } }).select(
    "-password"
  );

  var filteredPatients = patients;
  console.log(patients, "patients");
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
  console.log(patientMap, "map");
  const patientsWithHealthRecords = patientsHealthRecords.map((record) => ({
    patient: patientMap[record.patient.toString()],
    healthRecord: record.healthRecord,
  }));
  console.log(patientsWithHealthRecords);
  // Return the patients along with their health records
  res.status(200).send(patientsWithHealthRecords);
});

const viewPatient = asyncHandler(async (req, res) => {
  const { patientId } = req.query;
  const doctorId = req.user.id;

  const registeredPatients = await RegisteredPatients.findOne({
    doctor: doctorId,
  });

  if (!registeredPatients) {
    return res.status(404).json({
      message: "RegisteredPatients document not found for the doctor.",
    });
  }

  const patientHealthRecordIds = registeredPatients.patients;

  const patientsHealthRecords = await PatientHealthRecord.find({
    _id: { $in: patientHealthRecordIds },
  }).populate('healthRecord');

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
    attachments :patientWithHealthRecord.attachments
  };
  console.log(patientWithHealthRecord+"patientWithHealthRecord");

  // Return the patient along with their health record without the extra "patient" layer
  res.status(200).json(patientResponse);
});
const viewMyInfo = asyncHandler(async (req, res) => {
  try {
    const id = req.user.id;
    const doctor = await Doctor.findById(id);
    if (doctor) {
      res.status(200).send(doctor);
    } else {
      res.status(404).json({ message: "doctor not found" });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
const getNotifications = asyncHandler(async (req,res)=>{
  const notifications = notificationService.getNotifications(req.user.id);
  res.send(notifications);
})
const writePerscription = asyncHandler(async (req, res) => {
  const { patientId } = req.query;
  const doctorId = req.user.id;
  const description = req.body.description;
  const perscription = await Perscription.create({
    descriptions: description,
    date: new Date(),
    status: "unfilled",
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

const addFreeSlot = asyncHandler(async (req, res) => {
  const { date, startTime, endTime } = req.body;
  const doctorId = req.user.id;

  if (!doctorId || !date || !startTime || !endTime) {
    return res
      .status(400)
      .json({
        error: "Please provide doctorId, date, start time, and end time.",
      });
  }

  try {
    const newDoctorSlot = await DoctorSlot.create({
      doctorId,
      date,
      startTime,
      endTime,
      status: "free",
    });
    res.status(201).json(newDoctorSlot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create a doctor slot." });
  }
});

const viewPatientHealthRecords = asyncHandler(async (req, res) => {
  const doctorId = req.user.id; // Assuming you have authenticated the doctor
  const patientId = req.params.patientId;

  // Check if the doctor has permission to access the patient's records (you might need to implement your own logic here)

  // Retrieve the health records associated with the patient's ID
  const patientHealthRecords = await PatientHealthRecord.find({
    patient: patientId,
  });

  res.json(patientHealthRecords);
});

const getDoctorBalance = asyncHandler(async (req, res) => {
  const doctorId = req.user.id; // Assuming you have authenticated the doctor
  
  try {
    // Find the wallet associated with the doctor's user ID
    const wallet = await Wallet.findOne({ userId: doctorId });

    if (!wallet) {
      res.json({ balance: 0 }); // Default balance if wallet not found
    } else {
      res.json({ balance: wallet.balance });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve doctor balance." });
  }
});

const addHealthRecord = asyncHandler(async (req, res) => {
  const doctorId = req.user.id; // Assuming you have authenticated the doctor
  const patientId = req.query.patientId; // Assuming you have a patient ID in the request body
  const newHealthRecord = req.body.healthRecord; // Assuming you have health record data in the request body
console.log(newHealthRecord+"decsription");
  try {
   
    const newHealthRecord1 = await PatientHealthRecord.findOne({
      patient: patientId,
     
    });
    newHealthRecord1.healthRecord=newHealthRecord;
    await newHealthRecord1.save();

    return res.status(201).json(newHealthRecord1);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add a new health record." });
  }
});

const ViewMyContract = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;

  try {
    const contract = await Contract.findOne({ doctor: doctorId });

    if (!contract) {
      res.json({ message: "No contract" });
    } else {
      res.send({ description: contract.description });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve contract" });
  }
});
const acceptContract = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  try {
    // Find the contract by its ID
    const contract = await Contract.findOne({ doctor: doctorId });

    if (!contract) {
      res.json({ message: "Contract not found" });
    }

    // Update the contract's status to 'accepted'
    contract.status = "accepted";
    const applicantId = req.user.id;

    var applicant = await Applicant.findById(applicantId);

    const doctor = await Doctor.create({
      username: applicant.username,
      name: applicant.name,
      email: applicant.email,
      password: applicant.password,
      dateOfBirth: applicant.dateOfBirth,
      hourlyRate: applicant.hourlyRate,
      affiliation: applicant.affiliation,
      educationalBackground: applicant.educationalBackground,
      speciality: applicant.speciality,
    });
    const wallet = await Wallet.create({
      userId: doctor._id, // Set the userId to the doctor's ID
      balance: 0, // Set an initial balance
    });
    await Applicant.findByIdAndDelete(applicantId);

    // Save the updated contract
    await contract.save();

    return res.status(200).send(doctor);
  } catch (error) {
    throw error;
  }
});

const denyContract = asyncHandler(async (req, res) => {
  doctorId = req.user.id;
  try {
    // Find the contract by its ID
    const contract = await Contract.findOne({ doctor: doctorId });

    if (!contract) {
      throw new Error("Contract not found");
    }

    // Update the contract's status to 'rejected'
    contract.status = "rejected";

    // Save the updated contract
    await contract.save();

    return res.send(contract);
  } catch (error) {
    throw error;
  }
});

const setAppointmentORFollowup = asyncHandler(async (req, res) => {
  const patientId = req.query.patientId; // Get patientId from the query
  const { freeSlotId } = req.body; // Get freeSlotId from the request body

  try {
    // Find the free slot by its ID
    const freeSlot = await FreeSlot.findById(freeSlotId);

    if (!freeSlot) {
      return res.status(404).json({ message: "Free slot not found" });
    }

    // Create an appointment using the doctor from the free slot, the patient ID, the date, start time, and end time from the free slot
    const newAppointment = new Appointment({
      doctor: freeSlot.doctorId,
      patient: patientId,
      date: freeSlot.date,
      startTime: freeSlot.startTime,
      endTime: freeSlot.endTime,
      status: "UpComing", // You can set the initial status as needed
      price:0
    });

    // Save the new appointment to the database
    await newAppointment.save();

    // Remove the free slot from the database
    await FreeSlot.findByIdAndRemove(freeSlotId);

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to set the appointment" });
  }
});

const viewDoctorFreeSlots = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;

  try {
    // Find all free slots for the specified doctorId
    const doctorFreeSlots = await FreeSlots.find({ doctorId ,status : 'free' });

    // Log the doctorId and doctorFreeSlots to see what's going on
    console.log('Doctor ID:', doctorId);
    console.log('Doctor Free Slots:', doctorFreeSlots);

    // Check if any free slots were found
    if (!doctorFreeSlots || doctorFreeSlots.length === 0) {
      return res.status(404).json({ message: 'No free slots found for the doctor.' });
    }

    // Return the list of free slots
    res.json(doctorFreeSlots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve doctor free slots.' });
  }
});
const viewPerscriptions = asyncHandler(async (req, res) => {
  try {
    const { patientId, date, status } = req.query;
    const filter = {};
    if (date) {
      filter.date = new Date(date);
      console.log(filter.date);
    }
    // if (doctorId) {
    //   filter.doctor = doctorId;
    // }
    if (status) {
      filter.status = status;
    }
    filter.patient = patientId;

    var perscriptions = await Perscription.find(filter);

    res.json({ perscriptions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const rescheduleAppointment=asyncHandler(async(req,res)=>{
  const AppointmentId=req.query.AppointmentId
  const freeSlotId=req.query.freeSlotId
  try{
  const freeSlot=await FreeSlots.findById(freeSlotId)
  const appointment=await Appointment.findById(AppointmentId)
  appointment.date=freeSlot.date
  appointment.startTime=freeSlot.startTime
  appointment.endTime=freeSlot.endTime
  appointment.status='Rescheduled'
  appointment.save()
  res.json({appointment: appointment
  })
  }
catch(error){
  res.status(400).send(error)
}
})
const cancelAppointment=asyncHandler(async(req,res)=>{

  const AppointmentId=req.query.AppointmentId
  try{
   const appointment=await Appointment.findById(AppointmentId)
   appointment.status='Cancelled'
    const wallet=await Wallet.findOne({userId:appointment.patient})
    const walletdoc=await Wallet.findOne({userId:appointment.doctor})
    walletdoc.balance-=appointment.price

    wallet.balance+=appointment.price
    const freeslot=await FreeSlots.findOne({date:appointment.date,startTime:appointment.startTime})
    freeslot.status='free'
    walletdoc.save()
appointment.save()
wallet.save()
freeslot.save()

res.json({appointment : appointment, wallet : wallet, freeslot : freeslot ,walletdoc:walletdoc})
  }
  catch(error){
    console.log(error)
    res.status(404).send(error)
  }
})

const acceptFollowUp =asyncHandler(async(req,res)=>{
 const followUpId=req.query.followUpId
  try{
 const followUp= await FollowUps.findById(followUpId)
 followUp.status='Accepted'
 followUp.save();

 const newAppointment = new Appointment({
  doctor: followUp.doctor,
  patient:followUp.patient,
  date: followUp.date,
  startTime: followUp.startTime,
  endTime: followUp.endTime,
  status: "UpComing", // You can set the initial status as needed
  price:0
});
res.send(newAppointment)
  }
catch(error){
  res.status(404).send(error)
}

})

const rejectFollowUp =asyncHandler(async(req,res)=>{
 const followUpId=req.query.followUpId
  try{
 const followUp= await FollowUps.findById(followUpId)
 const slot = await FreeSlot.findOne({date:followUp.date,startTime:followUp.startTime});
 slot.status="free";
 await slot.save();
 followUp.status='Denied'
 await followUp.save();

 
res.send(followUp)
  }
catch(error){
  res.status(404).send(error)
}

})

const getMedicines = asyncHandler(async (req,res)=>{
  try{
  const pharmacyResponse = await axios.get('http://localhost:8800/pharmacist/view-Medicines');
  const medicines = pharmacyResponse.data;

  // Do something with the medicines (send them to the client, process, etc.)
  res.json({ medicines });
  }catch(error){
    console.error('Error fetching medicines from pharmacy:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
module.exports = {
  getNotifications,
  getMedicines,
  writePerscription,
  editEmail,
  filterAppointments,
  viewPatients,
  viewPatient,
  searchForPatient,
  viewMyInfo,
  addFreeSlot,
  viewPatientHealthRecords,
  getDoctorBalance,
  addHealthRecord,
  ViewMyContract,
  acceptContract,
  denyContract, 
  setAppointmentORFollowup
  ,viewDoctorFreeSlots,
  viewPerscriptions, 
  rescheduleAppointment,
  cancelAppointment,
  acceptFollowUp,
  rejectFollowUp
};
