const mongoose = require("mongoose");
const Patient = require("./Patient");
const familyMemberSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
  memberId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",

  },
  name: {
    type: String,
    required: true,
  },
  nationalId: {
    type: Number,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  relationToPatient: {
    type: String,
    enum: ["wife", "husband", "children"],
    required: true,
  },
});

module.exports = mongoose.model("FamilyMember", familyMemberSchema);
