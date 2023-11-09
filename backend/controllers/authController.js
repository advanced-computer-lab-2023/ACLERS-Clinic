const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const Doctor = require('../models/Doctor')
const Patient = require('../models/Patient');
const  Applicant = require('../models/Applicant');
const jwt = require('jsonwebtoken')
const blacklistedTokens = require('../middleware/blackListedTokens');


const login= asyncHandler(async (req,res)=>{
   const {email,password}= req.body;
   const patient = await Patient.findOne({email})
   
   const doctor = await Doctor.findOne({email})
   if(patient && (await bcrypt.compare(password,patient.password))){
    return res.json({
         token:generateToken(patient._id,"patient")
      })
   }
if(doctor && await bcrypt.compare(password,doctor.password)){
 return res.json({
    token: generateToken(doctor._id,"doctor")
 })
}
  return res.status(400).send("invalid credentials") 
})

const logout = (asyncHandler(async (req,res)=>{
  const token = req.headers.authorization.split(' ')[1];

    // Add the token to the blacklistedTokens list
    blacklistedTokens.push(token)

    res.status(200).json({ message: 'Logout successful' });
}))

const generateToken = (id,role)=>{

  return jwt.sign({id,role},process.env.JWT_SECRET,{expiresIn:"2h"})
}
const registerPatient = asyncHandler(async (req,res)=>{

    // if (Patient.findOne({email:req.body.email}).exists){
    //    return res.status(400).json({message : "already registered"})
    // }

    const saltRounds = await bcrypt.genSalt(10); // You can adjust the number of salt rounds for security
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

  const patient = await Patient.create({
    username:req.body.username,
    name:req.body.name,
    email:req.body.email,
    password:hashedPassword,
    dateOfBirth:req.body.dateOfBirth,
    gender:req.body.gender,
    mobileNumber:req.body.mobileNumber,
    emergencyContact:req.body.emergencyContact,
     
  })
 
  res.status(200).json(patient)
})


const registerDoctor = asyncHandler(async (req, res) => {
    try {
      const saltRounds = await bcrypt.genSalt(10); // You can adjust the number of salt rounds for security
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  
  
    const doctor = await Applicant.create({
      username:req.body.username,
      name:req.body.name,
      email:req.body.email,
      password:hashedPassword,
      dateOfBirth:req.body.dateOfBirth,
      hourlyRate:req.body.hourlyRate,
      affiliation:req.body.affiliation,
      educationalBackground:req.body.educationalBackground,
      status:'Pending'
    })
   
    res.status(200).json(doctor)
  }
  catch(error){
    res.send(error)
  }
  
  });
  module.exports = {registerPatient,registerDoctor,login,logout}