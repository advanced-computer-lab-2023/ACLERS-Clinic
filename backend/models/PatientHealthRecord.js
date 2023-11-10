const mongoose = require('mongoose')
const Patient = require('./Patient')
const patientHealthRecordSchema = new mongoose.Schema({
    patient:{
        type : mongoose.Schema.Types.ObjectId ,ref:'Patient',unique:true
    },
    healthRecord:{
        type:String,
        // required:true
    },
    attachments: [
        {
          filename: String, // Original name of the attached file
          path: String, // Path to the attached file in the server's filesystem or storage service
        },
      ],
})
module.exports = mongoose.model('PatientHealthRecord',patientHealthRecordSchema)