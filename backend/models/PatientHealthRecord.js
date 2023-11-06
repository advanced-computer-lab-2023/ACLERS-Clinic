const mongoose = require('mongoose')
const Patient = require('./Patient')
const patientHealthRecordSchema = new mongoose.Schema({
    patient:{
        type : mongoose.Schema.Types.ObjectId ,ref:'Patient',unique:true
    },
    healthRecord:{
        type:String,
        required:true
    }
})
module.exports = mongoose.model('PatientHealthRecord',patientHealthRecordSchema)