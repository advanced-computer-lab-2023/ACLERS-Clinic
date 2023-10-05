const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const Doctor = require('../models/Doctor')

const registerDoctor =asyncHandler( async (req,res)=>{
    const saltRounds = await bcrypt.genSalt(10); // You can adjust the number of salt rounds for security
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  const doctor = await Doctor.create({
    username:req.body.username,
    name:req.body.name,
    email:req.body.email,
    password:hashedPassword,
    dateOfBirth:req.body.dateOfBirth,
    hourlyRate:req.body.hourlyRate,
    affiliation:req.body.affiliation,
    educationalBackground:req.body.educationalBackground,
     
  })
 
  res.status(200).json(doctor)
})
module.exports = {registerDoctor}