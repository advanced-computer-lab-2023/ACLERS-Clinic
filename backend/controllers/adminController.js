const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin')
const Doctor = require('../models/Doctor')
const Patient = require('../models/Patient')

const addAdmin = asyncHandler( async (req,res)=>{
    const username = req.body.username
    const saltRounds = await bcrypt.genSalt(10); // You can adjust the number of salt rounds for security
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
   const newAdmin = await Admin.create({
    username:username,
    password : hashedPassword
   })
   res.status(200).send(newAdmin)
})
 
const removeAdmin = asyncHandler(async (req, res) => {
    const adminId = req.query.adminId; // Assuming you pass the admin ID in the URL params
    console.log(adminId)
    try {
      const admin = await Admin.findByIdAndDelete(adminId);
       console.log(admin)
    //   if (admi) {
    //     return res.status(404).send({ message: "Admin not found" });
    //   }
  
      res.status(200).send({ message: "Admin removed successfully" });
    } catch (error) {
      res.status(500).send({ message: "Error removing admin", error: error.message });
    }
  });





  
  const removeDoctor = asyncHandler(async (req, res) => {
    const doctorId = req.query.id;
  
    try {
      const doctor = await Doctor.findByIdAndDelete(doctorId);
  
      if (!doctor) {
        return res.status(404).send({ message: "Doctor not found" });
      }
  
      res.status(200).send({ message: "Doctor removed successfully" });
    } catch (error) {
      res.status(500).send({ message: "Error removing doctor", error: error.message });
    }
  });



  const removePatient = asyncHandler(async (req, res) => {
    const patientId = req.query.patientId; // Assuming you pass the patient ID as a query parameter
  console.log(patientId)
    if (!patientId) {
      return res.status(400).send({ message: "Patient ID is missing in the query" });
    }
  
    try {
      const patient = await Patient.findByIdAndDelete(patientId);
  
      if (!patient) {
        return res.status(404).send({ message: "Patient not found" });
      }
  
      res.status(200).send({ message: "Patient removed successfully" });
    } catch (error) {
      res.status(500).send({ message: "Error removing patient", error: error.message });
    }
  });
  
  
  


module.exports = {addAdmin, removeAdmin, removeDoctor, removePatient}