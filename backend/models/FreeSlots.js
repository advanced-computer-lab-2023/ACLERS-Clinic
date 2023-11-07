const mongoose = require('mongoose');

const freeSlotSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor', // Reference to the Doctor schema
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});

const FreeSlot = mongoose.model('FreeSlot', freeSlotSchema);

module.exports = FreeSlot;
