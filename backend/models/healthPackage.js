const mongoose = require("mongoose");

const healthPackageSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  doctorDiscount: {
    type: Number,
    required: true,
  },
  medicineDiscount: {
    type: Number,
    required: true,
  },
  subscriptionDiscount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("healthPackage", healthPackageSchema);
