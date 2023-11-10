const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const Doctor = require('../models/Doctor')
const Patient = require('../models/Patient');
const  Applicant = require('../models/Applicant');
const jwt = require('jsonwebtoken')
const blacklistedTokens = require('../middleware/blackListedTokens');
const Admin = require('../models/Admin');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring')

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


const changePassword = asyncHandler (async (req, res) => {
  try {
    const {  oldPassword, newPassword } = req.body;
    const userId = req.user.id
   
  

   
    // Extract the user's role from the authenticated JWT token
    const userRole = req.role;

    // Check if the user has the permission to change their password based on their role
    if (userRole !== 'doctor' && userRole !== 'patient' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Check if the old password matches
    const isPasswordValid = await bcrypt.compare(oldPassword, req.user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect old password' });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;


    if (!newPassword.match(passwordRegex)) {
      return res.status(400).json({
        message: 'Password must contain at least 1 capital letter, 1 small letter, 1 special character, and 1 number',
      });
    }

    // Hash and update the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
   

    if ( userRole == 'doctor'){
      const doctor = await Doctor.findById(userId);
      doctor.password=hashedPassword
      await doctor.save();
    }
    if ( userRole == 'patient'){
      const patient = await Patient.findById(userId) ;
      patient.password = hashedPassword ;
      await patient.save();
    }
    if ( userRole == 'admin'){
      const admin = await Admin.findById(userId);
      admin.password = hashedPassword;
      await admin.save();
    }

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' });
  }
});


const otpStorage = {};
const sendOTPEmail = asyncHandler(async(req,res) => {
  console.log(req.user)
  const emailService = req.body.email.split('@')[1];

  const serviceConfigurations = {
    "gmail.com": {
      service: 'Gmail',
      auth: {
        user: "aclersomar@gmail.com",
        pass: "wadurapjmeodkpad",
      },tls: {
        rejectUnauthorized: false,
      },
    },
    "yahoo.com": {
      service: 'Yahoo',
      auth: {
        user:"aclersomar@gmail.com" ,
        pass: "wadurapjmeodkpad",
      },
    },
    "hotmail.com": {
      service: 'Outlook', // Hotmail uses Outlook
      auth: {
        user: "aclersomar@gmail.com",
        pass: "wadurapjmeodkpad",
      },
    },
  };

  if (serviceConfigurations[emailService]) {
    const transporter = nodemailer.createTransport(serviceConfigurations[emailService]);

    const otp = randomstring.generate(6); 
    const mailOptions = {
      from: 'aclersomar@gmail.com',
      to: req.body.email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };
    const sendMailPromise = () => new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending OTP email: ' + error);
          reject(error);
        } else {
          console.log('OTP email sent: ' + info.response);
          resolve(info);
        }
      });
    });

    // Use await to wait for the email sending operation to complete
    await sendMailPromise();

    otpStorage[req.body.email] = otp;
    res.status(200).json({ message: 'OTP email sent' });
  } else {
    console.log('Unrecognized email service');
    res.status(400).json({ message: 'Unrecognized email service' });
  }
});


const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const oldOTP = otpStorage[email];
  if (otp !== oldOTP) {
    console.log(otpStorage);
    console.log("Invalid OTP");
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  let user;

  if (await Patient.findOne({ email: email })) {
    user = await Patient.findOne({ email: email });
  } else if (await Admin.findOne({ email: email })) {
    user = await Admin.findOne({ email: email });
  } else if (await Doctor.findOne({ email: email })) {
    user = await Doctor.findOne({ email: email });
  }

  if (user) {
    user.password = newPassword;
    await user.save(); // Assuming you save the user details in your database
    console.log('Password changed successfully');
    return res.status(200).json({ message: 'Password changed successfully' });
  } else {
    console.log('User not found');
    return res.status(404).json({ message: 'User not found' });
  }
});

















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
  module.exports = {registerPatient,registerDoctor,login,logout,changePassword,sendOTPEmail , resetPassword}