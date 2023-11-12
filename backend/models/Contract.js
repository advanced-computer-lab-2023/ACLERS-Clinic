const mongoose = require('mongoose');

const employmentContractSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor', // Reference to the Doctor model
    required: true,
    unique:true
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['accepted', 'rejected','pending'],
  },
});

const Contract = mongoose.model('Contract', employmentContractSchema);

module.exports = Contract;
