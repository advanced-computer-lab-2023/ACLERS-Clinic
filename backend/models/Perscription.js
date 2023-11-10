const mongoose = require('mongoose')

const Doctor = require('./Doctor')
const Patient = require('./Patient')

const perscriptionSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['filled','unfilled'],
        required:true
    },
    date:{
        type:Date,
        required:true,

    },
    doctor:{
        type:mongoose.Schema.Types.ObjectId,ref:'Doctor'
    },
    patient:{
        type:mongoose.Schema.Types.ObjectId,ref:'Patient'
    }
})

module.exports = mongoose.model('Perscription',perscriptionSchema)