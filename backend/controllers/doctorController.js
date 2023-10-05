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

module.exports = {registerDoctor}