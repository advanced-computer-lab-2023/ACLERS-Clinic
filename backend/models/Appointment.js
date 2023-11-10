const mongoose = require('mongoose')

const Doctor = require('./Doctor')
const Patient = require('./Patient')
 const appointmentSchema = new mongoose.Schema({
    doctor:{
        type:mongoose.Schema.Types.ObjectId,ref:'Doctor',
       
     },
     patient:{
        type:mongoose.Schema.Types.ObjectId
        ,ref:'Patient'
        
    },

    date:{
        type:Date,
        required:true
    },
    startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
    status:{
        type:String,
        
enum:['UpComing','Done']
    }
 })
 module.exports = mongoose.model('Appointment',appointmentSchema)