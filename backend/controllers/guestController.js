const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const Patient = require('../models/Patient');


const register = asyncHandler(async (req,res)=>{

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

const deltepatient = (req,res)=>{
    req.params.deltepatient
    PageTransition()
}

const getPatients = asyncHandler(async (req,res)=>{

    const  users = await Patient.find()
    res.json(users)
})

module.exports = {register,getPatients}