const Patient = require("../models/Patient");
const asyncHandler = require("express-async-handler");
const FamilyMember = require("../models/FamilyMember");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const PatientHealthPackage = require("../models/PatientHealthPackage");
const HealthPackage = require("../models/healthPackage");
const RegisteredPatients = require("../models/RegisteredPatients");
const PatientHealthRecord = require("../models/PatientHealthRecord");
const multer = require('multer');
const path = require('path');
const Perscription = require("../models/Perscription");
const PatientMedicalHistory = require("../models/PatientMedicalHistory")

function calculateBirthdate(age) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const birthYear = currentYear - age;
  const birthdate = new Date(birthYear, currentDate.getMonth(), currentDate.getDate());
  return birthdate;
}
const addFamilyMember = asyncHandler(async (req, res) => {
  try {
    const patientId = req.user.id;
   const user = await Patient.findById(patientId)

    const patient = await Patient.create({
      username:req.body.name,
      dateOfBirth:calculateBirthdate(req.body.age),
      email:user.body.name + '@gmail.com',
      gender:req.body.gender,
      name:req.body.name,
      mobileNumber:user.mobileNumber,
      emergencyContact:user.emergencyContact,
      password:user.password


    })
    const familyMember = await FamilyMember.create({
      patient: patientId,
      memberId:patient._id,
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
      message: "An error occurred while adding a family member",
      error: error.message, // You can include the error message in the response
    });
  }
});

const viewFamilyMembers = asyncHandler(async (req, res) => {
  try {
    const patientId = req.user.id;

    // Find the patient by ID
    // const patient = await Patient.findById(patientId);

    // if (!patient) {
    //     return res.status(404).json({ message: 'Patient not found' });
    // }

    // Retrieve the family members of the patient
    var familyMembers = await FamilyMember.find({ patient: patientId });
    if (!familyMembers) {
      res.status(404).json({ message: "No family members were found" });
    }
    res.json({ familyMembers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const setAppointment = asyncHandler(async (req, res) => {
  const patientId = req.user.id;
  const doctorId = req.query.doctorId;

  const date = new Date(req.body.date);
  const date2 = await Appointment.find({ date: date, doctor: doctorId });

  var status = "UpComing";
  if (date2.length != 0) {
    return res
      .status(400)
      .json({ message: "No appointments available at this time" });
  }
  const now = new Date();

  if (date < now) {
    res
      .status(400)
      .json({ message: "you cant book an appointment in the past" });
  } else if (date > now) {
    status = "UpComing";

    console.log("i am adding");
    const Appointment2 = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      date: date,
      status: status,
    });

    var patientHealthRecord = await PatientHealthRecord.findOne({
      patient: patientId,
    });
    var patientHealthRecordId;
    if (patientHealthRecord) {
      patientHealthRecordId = patientHealthRecord._id;
    } else {
      var patientHealthRecord2 = await PatientHealthRecord.create({
        patient: patientId,
        healthRecord: "no health record yet",
      });
      patientHealthRecordId = patientHealthRecord2._id;
    }
    var registeredPatients = await RegisteredPatients.findOne({
      doctor: doctorId,
    });

    if (registeredPatients) {
      var isPatientAlreadyAdded = registeredPatients.patients.includes(
        patientHealthRecordId
      );

      if (!isPatientAlreadyAdded) {
        registeredPatients.patients.push(patientHealthRecordId);

        await registeredPatients.save();

        console.log(
          `Patient with ID ${patientIdToAdd} added to RegisteredPatients.`
        );
      }
    } else {
      await RegisteredPatients.create({
        doctor: doctorId,
        patients: [patientHealthRecordId],
      });
    }
    res.status(200).send(Appointment2);
  }
});
const viewMyPerscriptions = asyncHandler(async (req, res) => {
  try {
    const { patientId, date, doctorId, status } = req.query;
    const filter = {};
    if (date) {
      filter.date = new Date(date);
      console.log(filter.date)
    }
    if (doctorId) {
      filter.doctor = doctorId;
    }
    if (status) {
      filter.status = status;
    }
    filter.patient = patientId;

    var perscriptions = await Perscription.find(filter);

    res.json({ perscriptions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const filterAppointments = asyncHandler(async (req, res) => {
  try {
    const { status, date } = req.query;
    const patientId = req.user.id;
    console.log(date)
    console.log(patientId)
    // Define a filter object to build the query dynamically
    const filter = { patient: patientId };

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
    console.log(appointments)

    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
const viewDoctors = asyncHandler(async (req, res) => {
  try {
    var { speciality, date, time } = req.query;
    const patientId = req.user.id;
    // Create an initial query object for doctors
    const doctorQuery = {};
    var doctorsWithSessionPrices = [];
    // Add speciality filter if provided
    if (speciality) {
      doctorQuery.speciality = speciality;
    }

    // If date and time are provided, check doctor availability
    if (date && time) {
      var dateWithTime = new Date(date);
      dateWithTime.setHours(parseInt(time) + 2, 0, 0, 0);

      // Find doctors available at the specified date and time
      console.log(dateWithTime);
      // dateWithTime=new Date('2023-10-15T15:00:00.000+00:00')
      console.log(dateWithTime);

      const availableDoctors = await Doctor.find(doctorQuery);
      const doctorIds = availableDoctors.map((doctor) => doctor._id);

      // Check if there are appointments for these doctors at the specified date and time
      const appointments = await Appointment.find({
        doctor: { $in: doctorIds },
        date: dateWithTime,
      });

      // Filter out doctors who have appointments at the specified date and time
      const filteredDoctors = availableDoctors.filter((doctor) => {
        return !appointments.some(
          (appointment) =>
            appointment.doctor.toString() === doctor._id.toString()
        );
      });
      doctorsWithSessionPrices = await Promise.all(
        filteredDoctors.map(async (doctor) => {
          let sessionPrice = doctor.hourlyRate;

          // Check if the patient has a subscribed health package
          const patientHealthPackages = await PatientHealthPackage.find({
            patient: patientId,
          });

          if (patientHealthPackages.length > 0) {
            const healthPackageId = patientHealthPackages[0].healthPackage;
            const healthPackage = await HealthPackage.findById(healthPackageId);

            // Calculate the session price based on the health package
            if (healthPackage) {
              sessionPrice +=
                sessionPrice * 0.1 -
                (healthPackage.doctorDiscount / 100) * doctor.hourlyRate;
            }
          } else {
            // If no health package is provided, calculate without discounts and markup
            sessionPrice += sessionPrice * 0.1;
          }

          return {
            _id: doctor._id,
            username: doctor.username,
            name: doctor.name,
            speciality: doctor.speciality, // Add the speciality field as needed
            sessionPrice: doctor.sessionPrice,
            educationalBackground: doctor.educationalBackground,
            affiliation: doctor.affiliation,
          };
        })
      );

      //   return res.status(200).json(filteredDoctors);
    } else {
      // If only speciality is provided, return doctors matching the speciality
      const doctors = await Doctor.find(doctorQuery); // Exclude password field from response

      // Calculate session prices for each doctor
      doctorsWithSessionPrices = await Promise.all(
        doctors.map(async (doctor) => {
          let sessionPrice = doctor.hourlyRate;

          // Check if the patient has a subscribed health package
          const patientHealthPackages = await PatientHealthPackage.find({
            patient: patientId,
          });

          if (patientHealthPackages.length > 0) {
            const healthPackageId = patientHealthPackages[0].healthPackage;
            const healthPackage = await HealthPackage.findById(healthPackageId);

            // Calculate the session price based on the health package
            if (healthPackage) {
              sessionPrice +=
                sessionPrice * 0.1 -
                (healthPackage.doctorDiscount / 100) * doctor.hourlyRate;
            }
          } else {
            // If no health package is provided, calculate without discounts and markup
            sessionPrice += sessionPrice * 0.1;
          }

          return {
            _id: doctor._id,
            username: doctor.username,
            name: doctor.name,
            speciality: doctor.speciality, // Add the speciality field as needed
            sessionPrice: sessionPrice,
            educationalBackground: doctor.educationalBackground,
            affiliation: doctor.affiliation,
          };
        })
      );
    }

    res.status(200).json(doctorsWithSessionPrices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
const subscribeHealthPackageFamMember = asyncHandler(async (req, res) => {
  try {
    const { healthPackageId, familyMemberId, relation } = req.query;
    const patientId = req.user.id;

    // Check if the patient has an existing subscription
    const existingSubscription = await PatientHealthPackage.findOne({
      patient: familyMemberId,
    });

    if (existingSubscription) {
      // Check if a year has passed since the last subscription
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      if (existingSubscription.renewalDate > oneYearAgo) {
        return res.status(400).json({
          message: "Patient is not eligible for a new subscription yet",
        });
      }
    }

    // Create a new patient health package subscription for the family member
    const subscriptionDate = new Date();
    const renewalDate = new Date(subscriptionDate);
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);

    const familyMemberHealthPackage = await PatientHealthPackage.create({
      patient: familyMemberId,
      healthPackage: healthPackageId,
      dateOfSubscription: subscriptionDate,
      renewalDate: renewalDate,
      status: "subscribed",
       // Set the relation to the provided value
    });

    res.status(200).json({ familyMemberHealthPackage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const subscribeHealthPackage = asyncHandler(async (req, res) => {
  try {
    const { healthPackageId } = req.query;
    const patientId = req.user.id;
    // Check if the patient has an existing subscription
    const existingSubscription = await PatientHealthPackage.findOne({
      patient: patientId,
    });

    if (existingSubscription) {
      // Check if a year has passed since the last subscription
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      if (existingSubscription.subscriptionDate > oneYearAgo) {
        return res.status(400).json({
          message: "Patient is not eligible for a new subscription yet",
        });
      }
    }

    // Create a new patient health package subscription
    const subscriptionDate = new Date();
    const renewalDate = new Date(subscriptionDate);
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);

    const patientHealthPackage = await PatientHealthPackage.create({
      patient: patientId,
      healthPackage: healthPackageId,
      dateOfSubscription: subscriptionDate,
      renewalDate: renewalDate,
      status: "subscribed", // Set the status to "subscribed"
    });

    res.status(200).json({ patientHealthPackage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
const viewHealthPackage = asyncHandler(async(req,res)=>{
  const healthPackageId= req.query;
  try{
    const healthpackage = await HealthPackage.findById(healthPackageId)
    res.status(200).send(healthpackage);

  }
  catch(error){
    res.status(400).send(error);
  }
})

const viewHealthPackages = asyncHandler(async (req, res) => {
  try {
    const healthPackages = await HealthPackage.find();
    res.status(200).send(healthPackages);
  } catch (error) {
    res.status(400).send(error);
  }
});
const viewDoctor = asyncHandler(async (req, res) => {
  try {
    const doctorId = req.query.doctorId;

    // Retrieve the doctor from the database
    const doctor = await Doctor.findById(doctorId);

    // Check if the doctor exists
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Remove attributes you want to exclude from the response
    // For example, let's remove the 'password' attribute
    const modifiedDoctor = {
      _id: doctor._id,
      username: doctor.username,
      name: doctor.name,
      email: doctor.email,
      hourlyRate: doctor.hourlyRate,
      affiliation: doctor.affiliation,
      educationalBackground: doctor.educationalBackground,
      speciality: doctor.speciality,
      // Include other attributes as needed
    };

    // Send the modified doctor object in the response
    res.status(200).json(modifiedDoctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const selectPresc = asyncHandler(async (req, res) => {
  try {
    var prescId = req.query.prescId;
    const perscription = await Perscription.findById(prescId);
    res.json({ perscription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
const searchForDoctor = asyncHandler(async (req, res) => {
  const { name, speciality } = req.query;

  // Define a filter object to build the query dynamically
  const filter = {};

  if (name) {
    filter.name = name;
  }

  if (speciality) {
    filter.speciality = speciality;
  }

  const doctors = await Doctor.find(filter);
  res.send(doctors);
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define the destination folder where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file with a timestamp and original extension
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    if (extname === '.pdf' || extname === '.jpeg' || extname === '.jpg' || extname === '.png') {
      return cb(null, true);
    }
    cb(new Error('File type not supported'));
  },
});

async function handleUpload(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Find the patient's health record by the patient ID
    let healthRecord = await PatientHealthRecord.findOne({ patient: req.user.id });

    // If no health record exists, create a new one
    if (!healthRecord) {
      healthRecord = new PatientHealthRecord({
        patient: req.user.id,
        attachments: [], // Initialize with an empty attachments array
      });
    }

    // Add the new attachment to the health record
    const newAttachment = {
      filename: req.file.originalname,
      path: req.file.path, // Store the path to the uploaded file
    };
    healthRecord.attachments.push(newAttachment);

    // Save the health record to the database
    await healthRecord.save();

    res.status(200).json({ message: 'File uploaded and medical history updated', health_record: healthRecord });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: 'Error saving medical history' });
  }
}

const removeHealthRecordAttachment = asyncHandler(async (req, res) => {
  const filename = req.query.filename; // Get the filename from req.query

  // Find the patient's health record
  const healthRecord = await PatientHealthRecord.findOne({ patient: req.user.id });

  if (!healthRecord) {
    return res.status(404).json({ message: 'Health record not found' });
  }

  // Find the attachment with the provided filename and remove it
  const attachmentToRemove = healthRecord.attachments.find(
    (attachment) => attachment.filename === filename
  );

  if (!attachmentToRemove) {
    return res.status(404).json({ message: 'Attachment not found in health record' });
  }

  // Remove the attachment from the array
  healthRecord.attachments = healthRecord.attachments.filter(
    (attachment) => attachment.filename !== filename
  );

  try {
    // Save the updated health record
    await healthRecord.save();

    res.status(200).json({ message: 'Attachment removed', health_record: healthRecord });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: 'Error removing attachment from health record' });
  }
});

function calculateAge(birthdate) {
  const birthDate = new Date(birthdate);
  const currentDate = new Date();

  const yearsDiff = currentDate.getFullYear() - birthDate.getFullYear();
  const monthsDiff = currentDate.getMonth() - birthDate.getMonth();
  const daysDiff = currentDate.getDate() - birthDate.getDate();

  // Adjust age if birthdate has not occurred this year
  if (monthsDiff < 0 || (monthsDiff === 0 && daysDiff < 0)) {
    return yearsDiff - 1;
  } else {
    return yearsDiff;
  }
}
const linkAccount = asyncHandler(async(req,res)=>{
   const patientId= req.user.id
   const{email,mobileNumber,relation} = req.body
   let patient
   if(email){
    patient = await Patient.findOne({email})
   }
   if(mobileNumber){
    patient = await Patient.findOne({mobileNumber})
   }
  
   const member = await FamilyMember.create({
    patient:patientId,
    memberId:patient._id,
    name:patient.name,
    age:calculateAge(patient.dateOfBirth),
    nationalId:30203130101014,
    gender:patient.gender,
    relationToPatient:relation



   })
  
   return res.status(200).json(member)
   
})
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const payUsingStripe = asyncHandler(async (req,res)=>{
try{
  

const product = await stripe.products.create({
  name: req.body.name,
  description: req.body.description,
   // URL of the product image
});
const price = await stripe.prices.create({
  product: product.id, // ID of the product created in step 1
  unit_amount: 1000, // Amount in the smallest currency unit (e.g., cents)
  currency: 'usd', // Currency code (e.g., USD)
 
});
console.log(product,price)

  const session = await stripe.checkout.sessions.create({
payment_method_types:['card'],
line_items:[{
price : price.id,
 quantity:req.body.quantity
}]
,mode:'payment',
success_url:'http://localhost:3000/payment-success',

cancel_url:'http://localhost:3000/payment-cancel',

  })
  console.log(session)
   return res.json({session:session.url})
}catch(error){
return res.send(error)
}
})


module.exports = {
  searchForDoctor,
  selectPresc,
  viewMyPerscriptions,
  addFamilyMember,
  viewFamilyMembers,
  setAppointment,
  filterAppointments,
  viewDoctors,
  viewHealthPackages,
  subscribeHealthPackage,
  viewDoctor,
  upload,handleUpload,linkAccount,removeHealthRecordAttachment,payUsingStripe,subscribeHealthPackageFamMember
};
