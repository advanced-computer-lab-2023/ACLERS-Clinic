const Patient = require('../models/Patient');
const asyncHandler = require('express-async-handler');
const FamilyMember = require('../models/FamilyMember');
const Appointment = require('../models/Appointment')


const addFamilyMember = asyncHandler(async (req, res) => {
    try {
      const patientId = req.query.patientId;
  
      const familyMember = await FamilyMember.create({
        patient: patientId,
        name: req.body.name,
        nationalId: req.body.nationalId,
        age: req.body.age,
        gender: req.body.gender,
        relationToPatient: req.body.relationToPatient,
      });
  
      res.status(200).send(familyMember);
    } catch (error) {
      // Handle errors here
      console.error(error); // Log the error for debugging purposes
  
      // Send an appropriate error response
      res.status(500).json({
        success: false,
        message: 'An error occurred while adding a family member',
        error: error.message, // You can include the error message in the response
      });
    }
  });

const viewFamilyMembers = asyncHandler(async (req, res) => {
    try {
        const patientId = req.query.patientId;

        // Find the patient by ID
        // const patient = await Patient.findById(patientId);

        // if (!patient) {
        //     return res.status(404).json({ message: 'Patient not found' });
        // }

        // Retrieve the family members of the patient
        var familyMembers = await FamilyMember.find({ patient: patientId });
         if(!familyMembers){
            res.status(404).json({message:'No family members were found'})
         }
        res.json({familyMembers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const setAppointment = asyncHandler(async (req,res)=>{
    const patientId = req.query.patientId
    const doctorId = req.query.doctorId

    const date =new Date( req.body.date)
    const date2 = await Appointment.find({date:date,doctor:doctorId})
    console.log(date2)
    var  status='UpComing'
    if(date2.length!=0){
       return res.status(400).json({message:'No appointments available at this time'})
        
    }
    const now = new Date()
    console.log(now)
    if(date<now){
        
        console.log("i am in the date<now")
        res.status(400).json({message:'you cant book an appointment in the past'})
    }else if(date>now){
        console.log("i am in else if")
        status = 'UpComing'
        // res.status(200).json({message:'Appointment booked successfully'})
        console.log("i am adding")
        const Appointment2 = await Appointment.create({
            patient:patientId,
            doctor:doctorId,
            date:date,
            status:status
        })
        res.status(200).send(Appointment2)
        
    }
 
   
})

const filterAppointments = asyncHandler( async (req, res) => {

    try {
      const { patientId,status, date } = req.query;
  
      // Define a filter object to build the query dynamically
      const filter = {patient:patientId};
  
      if (status) {
        // If 'status' is provided in the query, add it to the filter
        filter.status = status;
      }
  
      if (date) {
        // If 'date' is provided in the query, convert it to a Date object and add it to the filter
        filter.date = new Date(date);
      }
  
      // Use the filter object to query the database
      const appointments = await Appointment.find(filter);
  
      res.status(200).json(appointments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  


module.exports = {addFamilyMember,viewFamilyMembers,setAppointment,filterAppointments}