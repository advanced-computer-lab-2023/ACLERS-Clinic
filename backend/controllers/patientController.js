const Patient = require('../models/Patient');
const asyncHandler = require('express-async-handler');
const FamilyMember = require('../models/FamilyMember');
const Appointment = require('../models/Appointment')
const Doctor = require('../models/Doctor')
const PatientHealthPackage = require('../models/PatientHealthPackage')
const HealthPackage = require('../models/healthPackage')
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
  const viewDoctors = asyncHandler(async (req, res) => {
    try {
        var { patientId,speciality, date, time } = req.query;
    
        // Create an initial query object for doctors
        const doctorQuery = {};
        var doctorsWithSessionPrices =[]
        // Add speciality filter if provided
        if (speciality) {
          doctorQuery.educationalBackground = speciality;
        }
    
        // If date and time are provided, check doctor availability
        if (date && time) {
            
          var dateWithTime = new Date(date);
          dateWithTime.setHours(parseInt(time)+2, 0, 0, 0);
    
          // Find doctors available at the specified date and time
          console.log(dateWithTime)
         // dateWithTime=new Date('2023-10-15T15:00:00.000+00:00')
          console.log(dateWithTime)

          const availableDoctors = await Doctor.find(doctorQuery);
          const doctorIds = availableDoctors.map((doctor) => doctor._id);
    
          // Check if there are appointments for these doctors at the specified date and time
          const appointments = await Appointment.find({
            doctor: { $in: doctorIds },
            date: dateWithTime,
          });
    
          // Filter out doctors who have appointments at the specified date and time
          const filteredDoctors = availableDoctors.filter((doctor) => {
            return !appointments.some((appointment) => appointment.doctor.toString() === doctor._id.toString());
          });
           doctorsWithSessionPrices = await Promise.all(filteredDoctors.map(async (doctor) => {
            let sessionPrice = doctor.hourlyRate;
      
            // Check if the patient has a subscribed health package
            const patientHealthPackages = await PatientHealthPackage.find({ patient: patientId });
      
            if (patientHealthPackages.length > 0) {
              const healthPackageId = patientHealthPackages[0].healthPackage;
              const healthPackage = await HealthPackage.findById(healthPackageId);
      
              // Calculate the session price based on the health package
              if (healthPackage) {
                sessionPrice += (sessionPrice * 0.10) - ((healthPackage.doctorDiscount/100)*doctor.hourlyRate);
              }
            } else {
              // If no health package is provided, calculate without discounts and markup
              sessionPrice += sessionPrice * 0.10;
            }
      
            return {
              _id: doctor._id,
              username: doctor.username,
              name: doctor.name,
              specialty: doctor.educationalBackground, // Add the specialty field as needed
              sessionPrice: sessionPrice,
            };
          }));
    
        //   return res.status(200).json(filteredDoctors);
        }else{
    
        // If only speciality is provided, return doctors matching the speciality
        const doctors = await Doctor.find(doctorQuery); // Exclude password field from response
  
      // Calculate session prices for each doctor
       doctorsWithSessionPrices = await Promise.all(doctors.map(async (doctor) => {
        let sessionPrice = doctor.hourlyRate;
  
        // Check if the patient has a subscribed health package
        const patientHealthPackages = await PatientHealthPackage.find({ patient: patientId });
  
        if (patientHealthPackages.length > 0) {
          const healthPackageId = patientHealthPackages[0].healthPackage;
          const healthPackage = await HealthPackage.findById(healthPackageId);
  
          // Calculate the session price based on the health package
          if (healthPackage) {
            sessionPrice += (sessionPrice * 0.10) - ((healthPackage.doctorDiscount/100)*doctor.hourlyRate);
          }
        } else {
          // If no health package is provided, calculate without discounts and markup
          sessionPrice += sessionPrice * 0.10;
        }
  
        return {
          _id: doctor._id,
          username: doctor.username,
          name: doctor.name,
          specialty: doctor.educationalBackground, // Add the specialty field as needed
          sessionPrice: sessionPrice,
        };
      }));
    }
  
      res.status(200).json(doctorsWithSessionPrices);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  const subscribeHealthPackage = asyncHandler(async (req, res) => {
    try {
      const { patientId, healthPackageId } = req.query;
  
      // Check if the patient has an existing subscription
      const existingSubscription = await PatientHealthPackage.findOne({ patient: patientId });
  
      if (existingSubscription) {
        // Check if a year has passed since the last subscription
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
        if (existingSubscription.subscriptionDate > oneYearAgo) {
          return res.status(400).json({ message: 'Patient is not eligible for a new subscription yet' });
        }
      }
  
      // Create a new patient health package subscription
      const subscriptionDate = new Date();
      const patientHealthPackage = await PatientHealthPackage.create({
        patient: patientId,
        healthPackage: healthPackageId,
        dateOfSubscription: subscriptionDate,
      });
  
      res.status(200).json({ patientHealthPackage });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
const viewHealthPackages = asyncHandler(async (req,res)=>{
    try{
        const healthPackages = await HealthPackage.find()
        res.status(200).send(healthPackages)
    }catch(error){
        res.status(400).send(error)
    }
})
const viewDoctor = asyncHandler(async (req, res) => {
    try {
      const doctorId = req.query.doctorId;
  
      // Retrieve the doctor from the database
      const doctor = await Doctor.findById(doctorId);
  
      // Check if the doctor exists
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
  
      // Remove attributes you want to exclude from the response
      // For example, let's remove the 'password' attribute
      const modifiedDoctor = {
        _id: doctor._id,
        username: doctor.username,
        name: doctor.name,
        email:doctor.email,
        hourlyRate:doctor.hourlyRate
        ,affiliation:doctor.affiliation,
        educationalBackground:doctor.educationalBackground
        // Include other attributes as needed
      };
      
      // Send the modified doctor object in the response
      res.status(200).json(modifiedDoctor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

module.exports = {addFamilyMember,viewFamilyMembers,setAppointment,filterAppointments,viewDoctors,viewHealthPackages,subscribeHealthPackage,viewDoctor}