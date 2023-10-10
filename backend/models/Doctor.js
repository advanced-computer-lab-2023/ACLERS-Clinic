const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  hourlyRate: {
    type: Number,

    required: true,
  },
  affiliation: {
    type: String,
    required: true,
    trim: true,
  },
  educationalBackground: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Doctor", doctorSchema);
