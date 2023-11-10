const mongoose = require('mongoose')
const Patient = require('./Patient')
const healthPackage = require('./healthPackage')
const patientHealthPackageSchema = new mongoose.Schema({
    patient:{
        type:mongoose.Schema.Types.ObjectId
        ,ref:'Patient'
        
    },
    healthPackage:{
        type:mongoose.Schema.Types.ObjectId
        ,ref:'healthPackage'
    },
    dateOfSubscription:{
        type:Date
    }
    ,status:{
        type:String
    },
    renewalDate:{
        type:Date
    },
    endDate:{
        type:Date
    }
})

module.exports = mongoose.model('PatientHealthPackage',patientHealthPackageSchema)