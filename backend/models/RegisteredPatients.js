 const mongoose = require('mongoose')

 const Doctor = require('./Doctor')
 const PatientHealthRecord = require('./PatientHealthRecord')
 const registeredPatientsSchema= new mongoose.Schema({
     doctor:{
        type:mongoose.Schema.Types.ObjectId,ref:'Doctor',
        unique:true
     },
     patients:[{type:mongoose.Schema.Types.ObjectId,ref:'PatientHealthRecord'}]

 })
 module.exports = mongoose.model('RegisteredPatients',registeredPatientsSchema)
