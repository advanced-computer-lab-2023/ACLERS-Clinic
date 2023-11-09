const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const Doctor = require('../models/Doctor')
const Patient = require('../models/Patient');
const  Applicant = require('../models/Applicant');
const jwt = require('jsonwebtoken')
const blacklistedTokens = require('../middleware/blackListedTokens');
const multer = require('multer'); // Import Multer
//const upload = multer({ dest: 'uploads/' });
const path = require('path');
const login= asyncHandler(async (req,res)=>{
   const {email,password}= req.body;
   const patient = await Patient.findOne({email})
   
   const doctor = await Doctor.findOne({email})
   const applicant=await Applicant.findOne({email})
   if(patient && (await bcrypt.compare(password,patient.password))){
    return res.json({
         token:generateToken(patient._id,"patient")
      })
   }
if(doctor && await bcrypt.compare(password,doctor.password)){
 return res.json({
    token: generateToken(doctor._id,"doctor")
 })}
 if(applicant && await bcrypt.compare(password,applicant.password)){
  return res.json({
     token: generateToken(applicant._id,"applicant")
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

  const wallet = await Wallet.create({
    userId: doctor._id, // Set the userId to the doctor's ID
    balance: 0, // Set an initial balance
  });
 
  res.status(200).json(patient)
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define the destination folder where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file with a timestamp and original extension
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    if (extname === '.pdf' || extname === '.jpeg' || extname === '.jpg' || extname === '.png') {
      return cb(null, true);
    }
    cb(new Error('File type not supported'));
  },
});
const registerDoctor = asyncHandler(async (req, res) => {
    try {
     console.log(req.body)
     console.log(req.files)
      const saltRounds = await bcrypt.genSalt(10); // You can adjust the number of salt rounds for security
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      const idDocument = req.files['idDocument']; // Assuming the field name in the form is 'idDocument'
    const medicalLicense = req.files['medicalLicense']; // Field name for medical license
    const medicalDegree = req.files['medicalDegree']; // Field name for medical degree
    
    // Handle file uploads for the documents
    const idDocumentPath = idDocument ? idDocument[0].path : null;
    const medicalLicensePath = medicalLicense ? medicalLicense[0].path : null;
    const medicalDegreePath = medicalDegree ? medicalDegree[0].path : null;
    
  
      //console.log(req.body)
    const doctor = await Applicant.create({
      username:req.body.username,
      name:req.body.name,
      email:req.body.email,
      password:hashedPassword,
      dateOfBirth:req.body.dateOfBirth,
      hourlyRate:req.body.hourlyRate,
      affiliation:req.body.affiliation,
      educationalBackground:req.body.educationalBackground,
<<<<<<< HEAD
      speciality:req.body.speciality,
      status:'pending'
=======
      status:'pending',
      speciality:req.body.speciality,
     idDocument: idDocumentPath, // Store the path to the uploaded ID document
     medicalLicense: medicalLicensePath, // Store the path to the uploaded medical license
     medicalDegree: medicalDegreePath,
>>>>>>> omar
    })
    console.log(doctor)
    res.status(200).json(doctor)
  }
  catch(error){
    res.send(error)
  }
  
  });
  module.exports = {registerPatient,registerDoctor,login,logout,upload}