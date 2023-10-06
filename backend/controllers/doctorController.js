const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const Doctor = require('../models/Doctor')

const registerDoctor = asyncHandler(async (req, res) => {
  try {
    const saltRounds = await bcrypt.genSalt(10); // You can adjust the number of salt rounds for security
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const doctor = await Doctor.create({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      dateOfBirth: req.body.dateOfBirth,
      hourlyRate: req.body.hourlyRate,
      affiliation: req.body.affiliation,
      educationalBackground: req.body.educationalBackground,
    });

    res.status(200).json(doctor);
  } catch (error) {
    // Handle errors here
    console.error(error); // Log the error for debugging purposes

    // Send an appropriate error response
    res.status(500).json({
      success: false,
      message: 'An error occurred while registering the doctor',
      error: error.message, // You can include the error message in the response
    });
  }
});
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
  module.exports = {editEmail,registerDoctor}
