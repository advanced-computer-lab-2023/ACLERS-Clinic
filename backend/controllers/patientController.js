const Patient = require("../models/Patient");
const asyncHandler = require("express-async-handler");
const FamilyMember = require("../models/FamilyMember");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const PatientHealthPackage = require("../models/PatientHealthPackage");
const HealthPackage = require("../models/healthPackage");
const RegisteredPatients = require("../models/RegisteredPatients");
const PatientHealthRecord = require("../models/PatientHealthRecord");
const multer = require("multer");
const path = require("path");
const Perscription = require("../models/Perscription");
const axios = require("axios");
const Wallet = require("../models/Wallet");
const FreeSlots = require("../models/FreeSlots");
const PatientMedicalHistory = require("../models/PatientMedicalHistory");
const healthPackage = require("../models/healthPackage");
const FollowUps = require("../models/FollowUps")
const notificationService = require('../services/notificationService');
const mailService = require('../services/mailService')
function calculateBirthdate(age) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const birthYear = currentYear - age;
  const birthdate = new Date(
    birthYear,
    currentDate.getMonth(),
    currentDate.getDate()
  );
  return birthdate;
}
const addFamilyMember = asyncHandler(async (req, res) => {
  try {
    const patientId = req.user.id;
    const user = await Patient.findById(patientId);

    const patient = await Patient.create({
      username: req.body.name,
      dateOfBirth: calculateBirthdate(req.body.age),
      email: req.body.name + "@gmail.com",
      gender: req.body.gender,
      name: req.body.name,
      mobileNumber: user.mobileNumber,
      emergencyContact: user.emergencyContact,
      password: user.password,
    });
    const familyMember = await FamilyMember.create({
      patient: patientId,
      memberId: patient._id,
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

const setAppointmentFamMem = asyncHandler(async (req, res) => {
  const doctorId = req.query.doctorId;
  const slotId = req.query.slotId;
  const paymentMethod = req.body.paymentMethod;
  const sessionPrice = req.body.sessionPrice;
  const slot = await FreeSlots.findById(slotId);
  const familyMemId = req.query.familyMemId;
  const docwallet = await Wallet.findOne({ userId: doctorId });
  function getType(variable) {
    return typeof variable;
  }
  console.log("TYPE OF SESSIONPRICE FEL BACKEND: ", getType(sessionPrice));
  console.log("body of request fel backend: ", req.body);
  if (paymentMethod === "wallet") {
    // Check if the patient's wallet balance is sufficient

    let wallet = await Wallet.findOne({ userId: familyMemId });
    if (!wallet) {
      wallet = await Wallet.create({
        userId: familyMemId,
        balance: 0,
      });
    }

    const balance = wallet.balance; // Replace with the actual model
    if (balance < sessionPrice) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    } else {
      wallet.balance -= sessionPrice;
      await wallet.save();
      docwallet.balance += sessionPrice;
      await docwallet.save();
    }
  } else {
    // Define any other necessary data here
    const name = "Doctor Appointment";
    const description = "Doctor Appointment";
    const quantity = 1;
    let body = {
      name: name,
      description: description,
      quantity: quantity,
      price: sessionPrice,
    };
    try {
      const response = await axios.post(
        "http://localhost:8000/Patient-Home/pay",
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: req.headers.authorization,
          },
        }
      );

      console.log("EL RESPONSE DATA AHOOOO: ", response.data);
      res.json({ url: response.data.session.url });
      docwallet.balance += sessionPrice;
      await docwallet.save();
      // return res.json(stripeResponse)
    } catch (error) {
      console.log(error);
    }
  }

  const appointment = await Appointment.create({
    patient: familyMemId,
    doctor: doctorId,
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    status: "UpComing",
    price: sessionPrice,
  });
  slot.status = "booked";
  await slot.save();
  var patientHealthRecord = await PatientHealthRecord.findOne({
    patient: familyMemId,
  });
  var patientHealthRecordId;
  if (patientHealthRecord) {
    patientHealthRecordId = patientHealthRecord._id;
  } else {
    var patientHealthRecord2 = await PatientHealthRecord.create({
      patient: familyMemId,
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
  res.status(200).send(appointment);
});

const setAppointment = asyncHandler(async (req, res) => {
  const patientId = req.user.id;
  const doctorId = req.query.doctorId;
  const slotId = req.query.slotId;
  const paymentMethod = req.body.paymentMethod;
  const sessionPrice = req.body.sessionPrice;
  const slot = await FreeSlots.findById(slotId);
  console.log(doctorId +"doctorId")
  const docwallet = await Wallet.findOne({userId:doctorId})
  console.log(docwallet+"docwallet")
  if(slot.status ==="free"){
  if (paymentMethod === "wallet") {
    // Check if the patient's wallet balance is sufficient

    let wallet = await Wallet.findOne({ userId: patientId });
    if (!wallet) {
      wallet = await Wallet.create({
        userId: patientId,
        balance: 0,
      });
    }

    const balance = wallet.balance;
    console.log(balance, sessionPrice); // Replace with the actual model
    if (balance < sessionPrice) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    } else {
      wallet.balance -= sessionPrice;
      await wallet.save();
      docwallet.balance += sessionPrice;
      await docwallet.save();
    }
  } else {
    // Define any other necessary data here
    const name = "Doctor Appointment";
    const description = "Doctor Appointment";
    const quantity = 1;
    let body = {
      name: name,
      description: description,
      quantity: quantity,
      price: sessionPrice,
    };
    try {
      const response = await axios.post(
        "http://localhost:8000/Patient-Home/pay",
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: req.headers.authorization,
          },
        }
      );
      console.log(response.data);
      docwallet.balance += sessionPrice;
      await docwallet.save();
      res.json({ url: response.data.session.url });

      // return res.json(stripeResponse)
    } catch (error) {
      console.log(error);
    }
  }

  const appointment = await Appointment.create({
    patient: patientId,
    doctor: doctorId,
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    status: "UpComing",
    price: sessionPrice,
  });
  slot.status = "booked";
  await slot.save();
  const doctor = await Doctor.findById(doctorId);

  await notificationService.sendNotification(req.user.id, `Appointment with doctor ${doctor.name} booked successfully`);
  await notificationService.sendNotification(doctorId, `Appointment with patient ${req.user.name} has been booked 
  on ${slot.date} from  ${slot.startTime} to ${slot.endTime}`);

  await mailService.sendNotification(req.user.email,"Appointment Booked",`Appointment with doctor ${doctor.name} booked successfully`)

  await mailService.sendNotification(doctor.email,"Appointment Booked",`Appointment with patient ${req.user.name} has been booked 
  on ${slot.date} from  ${slot.startTime} to ${slot.endTime}`)


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

      console.log(`Patient with ID ${patientId} added to RegisteredPatients.`);
    }
  } else {
    await RegisteredPatients.create({
      doctor: doctorId,
      patients: [patientHealthRecordId],
    });
  }
  res.status(200).send(appointment);
}
});
const viewMyPerscriptions = asyncHandler(async (req, res) => {
  try {
    const { date, status } = req.query;
    const patientId = req.user.id;
    const filter = {};
    if (date) {
      filter.date = new Date(date);
      console.log(filter.date);
    }
    // if (doctorId) {
    //   filter.doctor = doctorId;
    // }
    if (status) {
      filter.status = status;
    }
    filter.patient = patientId;

    const prescriptions = await Perscription.find(filter);

    // Fetch medicine details from the pharmacy API for each prescription
    const prescriptionsWithDetails = await Promise.all(
      prescriptions.map(async (prescription) => {
        const prescriptionObject = prescription.toObject();

        // Fetch medicine details for each description in the prescription
        const descriptionsWithMedicineDetails = await Promise.all(
          prescriptionObject.descriptions.map(async (description) => {
            const medicineDetails = await axios.get(`http://localhost:8800/pharmacist/view-Medicine?medicineId=${description.medicine}`);

            return {
              medicine: medicineDetails.data, // Assuming the API returns the complete medicine details
              dosage: description.dosage,
              // Add other description properties if needed
            };
          })
        );

        return {
          ...prescriptionObject,
          descriptions: descriptionsWithMedicineDetails,
        };
      })
    );

    res.json({ prescriptions: prescriptionsWithDetails });

   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const filterAppointments = asyncHandler(async (req, res) => {
  try {
    const { status, date } = req.query;
    const patientId = req.user.id;
    console.log(date);
    console.log(patientId);
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
    const appointments = await Appointment.find(filter).populate("doctor");
    console.log(appointments);

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
    console.log(time);
    const doctorQuery = {};
    var doctorsWithSessionPrices = [];
    // Add speciality filter if provided
    if (speciality) {
      doctorQuery.speciality = speciality;
    }

    // If date and time are provided, check doctor availability
    if (date && time) {
      const [hours, minutes] = time.split(":");

      // Create a new Date object with the combined date and time
      var dateWithTime = new Date(date);
      dateWithTime.setHours(parseInt(hours) + 2, minutes, 0, 0);

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

          if (
            patientHealthPackages.length > 0 &&
            patientHealthPackages[patientHealthPackages.length-1].status == "subscribed"
          ) {
            const healthPackageId = patientHealthPackages[patientHealthPackages.length-1].healthPackage;
            const healthPackage = await HealthPackage.findById(healthPackageId);

            // Calculate the session price based on the health package
            console.log(sessionPrice+"sesssssioooonnnnn beforeeeee");
            if (healthPackage) {
              
              sessionPrice +=
                sessionPrice * 0.1 -
                (healthPackage.doctorDiscount / 100) * doctor.hourlyRate;
            }
            console.log(sessionPrice+"sesssssioooonnnnn afteeerrrrrrr");
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
    console.log(patientHealthPackages +"healthhhhhhhhhhh")
          if (
            patientHealthPackages.length > 0 &&
            patientHealthPackages[patientHealthPackages.length-1].status == "subscribed"
          ) {
            const healthPackageId = patientHealthPackages[patientHealthPackages.length-1].healthPackage;
            const healthPackage = await HealthPackage.findById(healthPackageId);

            // Calculate the session price based on the health package
            console.log(sessionPrice+"sesssssioooonnnnn beforeeeee");
            if (healthPackage) {
              sessionPrice +=
                sessionPrice * 0.1 -
                (healthPackage.doctorDiscount / 100) * doctor.hourlyRate;
            }
            console.log(sessionPrice+"sesssssioooonnnnn afteeerrrrrrr");
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
    console.log("query of request fel backend: ", req.query);
    console.log("body of request fel backend: ", req.body);
    const { healthPackageId, familyMemberId } = req.query;
    const patientId = req.user.id;
    const paymentMethod = req.body.paymentMethod;
    const patientHealthPack = await PatientHealthPackage.findOne({
      patient: patientId,
      status: "susbcribed",
    });
    let discountAmount = 0;

    if (patientHealthPack) {
      const healthPackage1 = await HealthPackage.findById(
        patientHealthPack.healthPackage
      );
      if (healthPackage1) {
        discountAmount = healthPackage1.subscriptionDiscount / 100;
      }
    }

    // Check if the patient has an existing subscription
    const existingSubscription = await PatientHealthPackage.find({
      patient: familyMemberId,
    });

    const subscribedSubscription = existingSubscription.find(
      (subscription) => subscription.status === "subscribed"
    );
    if (subscribedSubscription) {
      // Check if a year has passed since the last subscription
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      console.log("in existing sub");
      console.log(subscribedSubscription.dateOfSubscription > oneYearAgo);

      if (subscribedSubscription.dateOfSubscription > oneYearAgo) {
        return res.status(400).json({
          message: "Patient is not eligible for a new subscription yet",
        });
      } else {
        subscribedSubscription.status = "cancelled";
        subscribedSubscription.save();
      }
    }
    const healthPackage = await HealthPackage.findById(healthPackageId);
    if (paymentMethod === "wallet") {
      // Check if the patient's wallet balance is sufficient

      let wallet = await Wallet.findOne({ userId: familyMemberId });
      if (!wallet) {
        wallet = await Wallet.create({
          userId: familyMemberId,
          balance: 0,
        });
      }

      const balance = wallet.balance; // Replace with the actual model
      if (
        balance <
        healthPackage.Price - healthPackage.Price * discountAmount
      ) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      } else {
        wallet.balance -=
          healthPackage.Price - healthPackage.Price * discountAmount;
        wallet.save();
      }
    } else {
      // Define any other necessary data here
      const name = healthPackage.type;
      const description = healthPackage.type + " package";
      const quantity = 1;
      let body = {
        name: name,
        description: description,
        quantity: quantity,
        price: healthPackage.Price - healthPackage.Price * discountAmount,
      };
      try {
        const response = await axios.post(
          "http://localhost:8000/Patient-Home/pay",
          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: req.headers.authorization,
            },
          }
        );
        console.log(response.data);
        res.json({ url: response.data.session.url });

        // return res.json(stripeResponse)
      } catch (error) {
        console.log(error);
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
    const { paymentMethod } = req.body;
    const patientId = req.user.id;
    // Check if the patient has an existing subscription
    const existingSubscription = await PatientHealthPackage.find({
      patient: patientId,
    }).populate("healthPackage");
    console.log(existingSubscription + "existsubb");
    const subscribedSubscription = existingSubscription.find(
      (subscription) => subscription.status === "subscribed"
    );
    if (subscribedSubscription) {
      // Check if a year has passed since the last subscription
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      console.log("in existing sub");
      console.log(subscribedSubscription.dateOfSubscription > oneYearAgo);

      if (subscribedSubscription.dateOfSubscription > oneYearAgo) {
        return res.status(400).json({
          message: "Patient is not eligible for a new subscription yet",
        });
      } else {
        subscribedSubscription.status = "cancelled";
        subscribedSubscription.save();
      }
    }
    const healthPackage = await HealthPackage.findById(healthPackageId);
    if (paymentMethod === "wallet") {
      // Check if the patient's wallet balance is sufficient

      let wallet = await Wallet.findOne({ userId: patientId });
      if (!wallet) {
        wallet = await Wallet.create({
          userId: patientId,
          balance: 0,
        });
      }
      const balance = wallet.balance; // Replace with the actual model
      if (balance < healthPackage.Price) {
        return res.status(400).json({ message: "Insufficient wallet balance" });
      } else {
        wallet.balance -= healthPackage.Price;
        wallet.save();
      }
    } else {
      // Define any other necessary data here
      const name = healthPackage.type;
      const description = healthPackage.type + " package";
      const quantity = 1;
      let body = {
        name: name,
        description: description,
        quantity: quantity,
        price: healthPackage.Price,
      };
      try {
        const response = await axios.post(
          "http://localhost:8000/Patient-Home/pay",
          body,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: req.headers.authorization,
            },
          }
        );
        console.log(response.data);
        res.json({ url: response.data.session.url });

        // return res.json(stripeResponse)
      } catch (error) {
        console.log(error);
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

    // res.status(200).json({ patientHealthPackage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
const viewHealthPackage = asyncHandler(async (req, res) => {
  const healthPackageId = req.query;
  try {
    const healthpackage = await HealthPackage.findById(healthPackageId);
    res.status(200).send(healthpackage);
  } catch (error) {
    res.status(400).send(error);
  }
});

const viewAppointmentsOfDr = asyncHandler(async (req, res) => {
  const doctorId = req.query.doctorId;
  try {
    const slots = await FreeSlots.find({ doctorId: doctorId });

    if (!slots || slots.length === 0) {
      return res.status(404).send("No appointments available");
    }
    console.log(slots);
    // Filter slots by status: "free"
    const freeSlots = slots.filter((slot) => slot.status === "free");

    if (freeSlots.length === 0) {
      return res.status(404).send("No free appointments available");
    }

    return res.json({ slots: freeSlots });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

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
    const sessionPrice = req.query.sessionPrice;
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
      sessionPrice: sessionPrice,
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
    cb(null, "uploads/"); // Define the destination folder where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename the file with a timestamp and original extension
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    if (
      extname === ".pdf" ||
      extname === ".jpeg" ||
      extname === ".jpg" ||
      extname === ".png"
    ) {
      return cb(null, true);
    }
    cb(new Error("File type not supported"));
  },
});

async function handleUpload(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Find the patient's health record by the patient ID
    let healthRecord = await PatientHealthRecord.findOne({
      patient: req.user.id,
    });

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

    res.status(200).json({
      message: "File uploaded and medical history updated",
      health_record: healthRecord,
    });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: "Error saving medical history" });
  }
}

const removeHealthRecordAttachment = asyncHandler(async (req, res) => {
  const filename = req.query.filename; // Get the filename from req.query

  // Find the patient's health record
  const healthRecord = await PatientHealthRecord.findOne({
    patient: req.user.id,
  });

  if (!healthRecord) {
    return res.status(404).json({ message: "Health record not found" });
  }

  // Find the attachment with the provided filename and remove it
  const attachmentToRemove = healthRecord.attachments.find(
    (attachment) => attachment.filename === filename
  );

  if (!attachmentToRemove) {
    return res
      .status(404)
      .json({ message: "Attachment not found in health record" });
  }

  // Remove the attachment from the array
  healthRecord.attachments = healthRecord.attachments.filter(
    (attachment) => attachment.filename !== filename
  );

  try {
    // Save the updated health record
    await healthRecord.save();

    res
      .status(200)
      .json({ message: "Attachment removed", health_record: healthRecord });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res
      .status(500)
      .json({ message: "Error removing attachment from health record" });
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
const linkAccount = asyncHandler(async (req, res) => {
  const patientId = req.user.id;
  const { email, mobileNumber, relation } = req.body;
  let patient;
  if (email) {
    patient = await Patient.findOne({ email });
    console.log("email found");
  }
  if (mobileNumber) {
    patient = await Patient.findOne({ mobileNumber });
    console.log("mobile number found");
  }

  const member = await FamilyMember.create({
    patient: patientId,
    memberId: patient._id,
    name: patient.name,
    age: calculateAge(patient.dateOfBirth),
    nationalId: 30203130101014,
    gender: patient.gender,
    relationToPatient: relation,
  });
  return res.json(member);
});

const getPatientBalance = asyncHandler(async (req, res) => {
  const patientId = req.user.id; // Assuming you have authenticated the doctor

  try {
    // Find the wallet associated with the doctor's user ID
    const wallet = await Wallet.findOne({ userId: patientId });

    if (!wallet) {
      res.json({ balance: 0 }); // Default balance if wallet not found
    } else {
      res.json({ balance: wallet.balance });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve patient balance." });
  }
});

const viewMyHealthRecords = asyncHandler(async (req, res) => {
  const patientId = req.user.id;
  const patientHealthRecords = await PatientHealthRecord.find({
    patient: patientId,
  });

  return res.json(patientHealthRecords);
});
const viewSubscribedHealthPackage = asyncHandler(async (req, res) => {
  const patientId = req.user.id; // Get patientId from req.user.id (assuming you have authenticated the patient)

  try {
    // Find the patient's subscribed health package
    const subscription = await PatientHealthPackage.find({
      patient: patientId,
    }).populate("healthPackage");

    if (!subscription) {
      return res
        .status(404)
        .json({ message: "No subscribed health package found" });
    }

    // Extract the health package details from the subscription
    const healthPackage = subscription.healthPackage;

    res.status(200).json(subscription);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to fetch subscribed health package" });
  }
});

const viewSubscribedHealthPackageFamMem = asyncHandler(async (req, res) => {
  const { FamMemId } = req.query;
  try {
    // Find the patient's subscribed health package
    const subscription = await PatientHealthPackage.find({
      patient: FamMemId,
    }).populate("healthPackage");

    if (!subscription) {
      return res
        .status(404)
        .json({ message: "No subscribed health package found" });
    }

    // Extract the health package details from the subscription
    const healthPackage = subscription.healthPackage;

    res.status(200).json(subscription);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to fetch subscribed health package" });
  }
});
const cancelSubscription = asyncHandler(async (req, res) => {
  const patientId = req.user.id;
  try {
    // Find the patient's subscribed health package
    const subscription = await PatientHealthPackage.findOne({
      patient: patientId,
      status: "subscribed",
    }).populate("healthPackage");

    if (!subscription) {
      return res
        .status(404)
        .json({ message: "No subscribed health package found" });
    }
    const wallet = await Wallet.findOne({ userId: patientId });

    // Extract the health package details from the subscription
    subscription.status = "cancelled";
    subscription.endDate = new Date();
    subscription.save();
    wallet.balance += subscription.healthPackage.Price;
    await wallet.save();
    res.status(200).json(subscription);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to fetch subscribed health package" });
  }
});
const cancelSubscriptionFamMem = asyncHandler(async (req, res) => {
  const { famMemId } = req.query;

  try {
    // Find the patient's subscribed health package
    console.log("FamMemId fel backend: ", famMemId);
    const subscription = await PatientHealthPackage.findOne({
      patient: famMemId,
      status: "subscribed",
    }).populate("healthPackage");

    if (!subscription) {
      return res
        .status(404)
        .json({ message: "No subscribed health package found" });
    }

    // Extract the health package details from the subscription
    subscription.status = "cancelled";
    subscription.endDate = new Date();
    subscription.save();

    res.status(200).json(subscription);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to fetch subscribed health package" });
  }
});

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const payUsingStripe = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    const product = await stripe.products.create({
      name: req.body.name,
      description: req.body.description,
      // URL of the product image
    });
    const price = await stripe.prices.create({
      product: product.id, // ID of the product created in step 1
      unit_amount: req.body.price * 100, // Amount in the smallest currency unit (e.g., cents)
      currency: "usd", // Currency code (e.g., USD)
    });
    //console.log(product,price)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: price.id,
          quantity: req.body.quantity,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/payment-success",

      cancel_url: "http://localhost:3000/payment-cancel",
    });
    // console.log(session)

    return res.json({ session: session });
  } catch (error) {
    return res.send(error);
  }
});
const rescheduleAppointment = asyncHandler(async (req, res) => {
  const patientId = req.user.id;
  const {appointmentId,freeSlotId} = req.query;
  try{
  const appointment = await Appointment.findById(appointmentId);
  const slot = await FreeSlots.findById(freeSlotId);
  const slotOld = await FreeSlots.findOne({date:appointment.date,startTime:appointment.startTime});
  if(slotOld){
  slotOld.status ="free"
  await slotOld.save();
  }
  console.log(slot+"slotttttttttt")
  appointment.date = slot.date;
  appointment.status = 'Rescheduled';
  appointment.startTime = slot.startTime;
  appointment.endTime = slot.endTime;
  await appointment.save();
  slot.status="booked";
  await slot.save();
  const doctor = await Doctor.findById(appointment.doctor)
  const doctorId = doctor._id
  await notificationService.sendNotification(req.user.id, `Appointment with doctor ${doctor.name} has been Rescheduled`);
  await notificationService.sendNotification(doctorId, `Appointment with patient ${req.user.name}  
  on ${slot.date} from  ${slot.startTime} to ${slot.endTime} has been Rescheduled`);
  
  await mailService.sendNotification(req.user.email,"Appointment Rescheduled",`Appointment with doctor ${doctor.name} has been Rescheduled`)

  await mailService.sendNotification(doctor.email,"Appointment Rescheduled",`Appointment with patient ${req.user.name} 
  on ${slot.date} from  ${slot.startTime} to ${slot.endTime} has been Rescheduled`)
  res.json({appointment : appointment});
  }catch(error){
    console.log(error);
    res.status(400).send(error);
  }
})
// const rescheduleAppointmentFamMem = asyncHandler(async (req,res)=>{
//   const {appointmentId,freeSlotId,famMemId} = req.query;
//   try{
//     const appointment = await Appointment.findById(appointmentId);
//     const freeSlot = await FreeSlots.findById(freeSlotId);
//     console.log(freeSlot);
//     appointment.date = freeSlot.date;
//     appointment.status = "Rescheduled";
//     appointment.startTime = freeSlot.startTime;
//     appointment.endTime = freeSlot.endTime;
//     await appointment.save();
//     res.json({appointment : appointment});
//     }catch(error){
//       console.log(error);
//       res.status(400).send(error);
//     }
// })
const cancelAppointment = asyncHandler(async (req,res)=>{
  const patientId = req.user.id;
  const {appointmentId}=req.query
  const appointment = await Appointment.findById(appointmentId);
  const wallet = await Wallet.findOne({userId:patientId});
  const drWallet = await Wallet.findOne({userId:appointment.doctor});
  const now = new Date();
    const startTime = new Date(appointment.startTime);

    // Calculate the difference in milliseconds between the current time and the appointment start time
    const timeDifference = startTime - now;

    // Calculate the difference in hours
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    // Check if the cancellation is before the start time by 24 hours
    if (hoursDifference > 24) {
     wallet.balance+=appointment.price;
     drWallet.balance-=appointment.price;
     await wallet.save();
     await drWallet.save();
    }
    const doctor = await Doctor.findById(appointment.doctor)
    const doctorId = doctor._id
    appointment.status='Cancelled';
    console.log(appointment)
    const slot = await FreeSlots.findOne({date:appointment.date,startTime:appointment.startTime});
    if(slot){
    slot.status='free';
    await slot.save();
    }
    await appointment.save();
     await notificationService.sendNotification(req.user.id, `Appointment with doctor ${doctor.name} has been cancelled`);
  await notificationService.sendNotification(doctorId, `Appointment with patient ${req.user.name}  
  on ${slot.date} from  ${slot.startTime} to ${slot.endTime} has been cancelled`);
  
  await mailService.sendNotification(req.user.email,"Appointment Cancelled",`Appointment with doctor ${doctor.name} has been cancelled`)

  await mailService.sendNotification(doctor.email,"Appointment Cancelled",`Appointment with patient ${req.user.name} 
  on ${slot.date} from  ${slot.startTime} to ${slot.endTime} has been cancelled`)
    res.send(appointment);
})
const cancelAppointmentFamMem = asyncHandler(async (req,res)=>{
  
  const {appointmentId,famMemId}=req.query
  const appointment = await Appointment.findById(appointmentId);
  const wallet = await Wallet.findOne({userId:famMemId});
  const drWallet = await Wallet.findOne({userId:appointment.doctor});
  const now = new Date();
    const startTime = new Date(appointment.startTime);

    // Calculate the difference in milliseconds between the current time and the appointment start time
    const timeDifference = startTime - now;

    // Calculate the difference in hours
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    // Check if the cancellation is before the start time by 24 hours
    if (hoursDifference > 24) {
     wallet.balance+=appointment.price;
     drWallet.balance-=appointment.price;
     await wallet.save();
     await drWallet.save();
    }
    appointment.status='Cancelled';
    console.log(appointment)
    const slot = await FreeSlots.findOne({date:appointment.date,startTime:appointment.startTime});
    slot.status='free';
    await slot.save();
    await appointment.save();
    res.send(appointment);
})
const requestFollowUp = asyncHandler(async (req,res)=>{
  const patientId = req.user.id;
  const {freeSlotId,appointmentId} = req.query;
  try{
   const slot = await FreeSlots.findById(freeSlotId);
   const appointment = await Appointment.findById(appointmentId);
   const followUp = await FollowUps.create({
    doctor:appointment.doctor,
    patient:patientId,
    date:slot.date,
    startTime:slot.startTime,
    endTime:slot.endTime,
    price:0,
    status:"Pending"
   })
   appointment.status="Requested";
   slot.status="booked";
   await slot.save();
   
   await appointment.save();
   res.send(followUp)
  }catch(error){
    console.log(error)
    res.send(error)
  }
});
const rescheduleAppointmentFamMem = asyncHandler(async (req, res) => {
  const { appointmentId, freeSlotId, famMemId } = req.query;
  try {
    const appointment = await Appointment.findById(appointmentId);
    const freeSlot = await FreeSlots.findById(freeSlotId);
    console.log(freeSlot);
    appointment.date = freeSlot.date;
    appointment.status = "Rescheduled";
    appointment.startTime = freeSlot.startTime;
    appointment.endTime = freeSlot.endTime;
    await appointment.save();
    freeSlot.status = "booked";
    await freeSlot.save();
    res.json({ appointment: appointment });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
// const cancelAppointment = asyncHandler(async (req, res) => {
//   const patientId = req.user.id;
//   const { appointmentId } = req.query;
//   const appointment = await Appointment.findById(appointmentId);
//   const wallet = await Wallet.findOne({ userId: patientId });
//   const drWallet = await Wallet.findOne({ userId: appointment.doctor });
//   const now = new Date();
//   const startTime = new Date(appointment.startTime);

//   // Calculate the difference in milliseconds between the current time and the appointment start time
//   const timeDifference = startTime - now;

//   // Calculate the difference in hours
//   const hoursDifference = timeDifference / (1000 * 60 * 60);

//   // Check if the cancellation is before the start time by 24 hours
//   if (hoursDifference > 24) {
//     wallet.balance += appointment.price;
//     drWallet.balance -= appointment.price;
//     await wallet.save();
//     await drWallet.save();
//   }
//   appointment.status = "Cancelled";
//   console.log(appointment);
//   const slot = await FreeSlots.findOne({
//     date: appointment.date,
//     startTime: appointment.startTime,
//   });
//   slot.status = "free";
//   await slot.save();
//   await appointment.save();
//   res.send(appointment);
// });
// const cancelAppointmentFamMem = asyncHandler(async (req, res) => {
//   const { appointmentId, famMemId } = req.query;
//   const appointment = await Appointment.findById(appointmentId);
//   const wallet = await Wallet.findOne({ userId: famMemId });
//   const drWallet = await Wallet.findOne({ userId: appointment.doctor });
//   const now = new Date();
//   const startTime = new Date(appointment.startTime);

//   // Calculate the difference in milliseconds between the current time and the appointment start time
//   const timeDifference = startTime - now;

//   // Calculate the difference in hours
//   const hoursDifference = timeDifference / (1000 * 60 * 60);

//   // Check if the cancellation is before the start time by 24 hours
//   if (hoursDifference > 24) {
//     wallet.balance += appointment.price;
//     drWallet.balance -= appointment.price;
//     await wallet.save();
//     await drWallet.save();
//   }
//   appointment.status = "Cancelled";
//   console.log(appointment);
//   const slot = await FreeSlots.findOne({
//     date: appointment.date,
//     startTime: appointment.startTime,
//   });
//   slot.status = "free";
//   await slot.save();
//   await appointment.save();
//   res.send(appointment);
// });
// const requestFollowUp = asyncHandler(async (req, res) => {
//   const patientId = req.user.id;
//   const { freeSlotId, appointmentId } = req.query;
//   try {
//     const slot = await FreeSlots.findById(freeSlotId);
//     const appointment = await Appointment.findById(appointmentId);
//     const followUp = await FollowUps.create({
//       doctor: appointment.doctor,
//       patient: patientId,
//       date: slot.date,
//       startTime: slot.startTime,
//       endTime: slot.endTime,
//       price: 0,
//       status: "Pending",
//     });
//     res.send(followUp);
//   } catch (error) {
//     console.log(error);
//     res.send(error);
//   }
// })
const requestFollowUpFamMem =asyncHandler(async(req,res)=>{
 
  const {freeSlotId,appointmentId,famMemId} = req.query;
  try{
   const slot = await FreeSlots.findById(freeSlotId);
   const appointment = await Appointment.findById(appointmentId);
   const followUp = await FollowUps.create({
    doctor:appointment.doctor,
    patient:famMemId,
    date:slot.date,
    startTime:slot.startTime,
    endTime:slot.endTime,
    price:0,
    status:"Pending"
   })
  
   slot.status="booked";
   await slot.save();
   
   await appointment.save();
   res.send(followUp)
  }catch(error){
    console.log(error)
    res.send(error)
  }
})
const viewFamMemAppointments = asyncHandler(async(req,res)=>{
  const {famMemId}= req.query;
  try{
  const appointments = await Appointment.find({patient:famMemId}).populate("doctor");
  res.send(appointments)
  }catch(error){
    console.log(error);
    res.send(error);
  }
})
const fillPrescription = asyncHandler(async (req, res) => {
  try {
    const perscriptionId = req.query.perscriptionId;

    if (!perscriptionId) {
      return res.status(400).json({ message: 'Prescription ID is required' });
    }

    const perscription = await Perscription.findById(perscriptionId);

    if (!perscription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Process each medicine in the prescription
    const descriptionsWithMedicineDetails = await Promise.all(
      perscription.descriptions.map(async (description) => {
        // Assuming medicine details are already present in the description
        const medicineDetails = description.medicine;

        // Make a POST request to add the medicine to the patient's cart
        await axios.post(
          'http://localhost:8800/patient/add-to-cart',
          {
            medicineId: description.medicine._id, // Adjust the property name based on your medicine model
            quantity: 1, // You may adjust the quantity as needed
            // Assuming the patient ID is used for the user in the pharmacy
          },
          {
            headers: {
              Authorization: ` ${req.headers.authorization}`, // Assuming the token is present in the request headers
            },
          }
        );

        return {
          medicine: medicineDetails,
          dosage: description.dosage,
          // Add other description properties if needed
        };
      })
    );
    perscription.status="filled";
    await perscription.save();
    const perscriptionWithDetails = {
      ...perscription.toObject(),
      descriptions: descriptionsWithMedicineDetails,
    };

    res.json({ perscription: perscriptionWithDetails ,message:"perscription filled items added to cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
const getNotifications = asyncHandler(async (req,res)=>{
  const notifications = await notificationService.getNotifications(req.user.id);
  console.log(notifications)
  res.send(notifications);
})
module.exports = {
  getNotifications,
  fillPrescription,
  requestFollowUpFamMem,
  viewFamMemAppointments,
  requestFollowUp,
  cancelAppointmentFamMem,
  cancelAppointment,
  rescheduleAppointmentFamMem,
  rescheduleAppointment,
  viewSubscribedHealthPackage,
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
  viewSubscribedHealthPackageFamMem,
  viewAppointmentsOfDr,
  viewMyHealthRecords,
  getPatientBalance,
  cancelSubscription,
  cancelSubscriptionFamMem,
  setAppointmentFamMem,
  upload,
  handleUpload,
  linkAccount,
  removeHealthRecordAttachment,
  payUsingStripe,
  subscribeHealthPackageFamMember,
};
