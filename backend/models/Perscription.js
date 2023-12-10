const mongoose = require('mongoose')

const Doctor = require('./Doctor')
const Patient = require('./Patient')

const perscriptionSchema = new mongoose.Schema({
    descriptions: [{
        medicine: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        dosage: {
            type: String,
            required: true
        },
        // Add other properties as needed
    }],
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