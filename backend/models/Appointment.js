const mongoose = require('mopngoose')

const Doctor = require('./Doctor')
const Patient = require('./Patient')
 const appointmentSchema = new mongoose.Schema({
    doctor:{
        type:mongoose.Schema.Types.ObjectId,ref:'Doctor',
        unique:true
     },
     patient:{
        type:mongoose.Schema.Types.ObjectId
        ,ref:'Patient'
        ,unique:true
    },

    date:{
        type:Date,
        required:true
    }
    ,status:{
        type:String,
        required:true
,enum:['UpComing','Done']
    }
 })
 module.exports = mongoose.model('Appointment',appointmentSchema)