const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const healthPackage = require("../models/healthPackage");
const Applicant = require("../models/Applicant");

const addAdmin = asyncHandler(async (req, res) => {
  const username = req.body.username;
  const saltRounds = await bcrypt.genSalt(10); // You can adjust the number of salt rounds for security
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  const newAdmin = await Admin.create({
    username: username,
    password: hashedPassword,
  });
  res.status(200).send(newAdmin);
});

const removeAdmin = asyncHandler(async (req, res) => {
  const adminId = req.query.adminId; // Assuming you pass the admin ID in the URL params
  console.log(adminId);
  try {
    const admin = await Admin.findByIdAndDelete(adminId);
    console.log(admin);
    //   if (admi) {
    //     return res.status(404).send({ message: "Admin not found" });
    //   }

    res.status(200).send({ message: "Admin removed successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error removing admin", error: error.message });
  }
});

const ViewAdmins = asyncHandler(async (req, res) => {
  try {
    var admins = await Admin.find();
    if (!admins) {
      return res.status(404).json({ message: "no admins were found" });
    }
    return res.status(200).send(admins);
  } catch (error) {
    return res.status(400).send(error);
  }
});

const ViewDoctors = asyncHandler(async (req, res) => {
  try {
    var doctors = await Doctor.find();
    if (!doctors) {
      return res.status(404).json({ message: "no doctors were found" });
    }
    return res.status(200).send(admins);
  } catch (error) {
    return res.status(400).send(error);
  }
});

const ViewPatients = asyncHandler(async (req, res) => {
  try {
    var patients = await Patient.find();
    if (!patients) {
      return res.status(404).json({ message: "no patients were found" });
    }
    return res.status(200).send(patients);
  } catch (error) {
    return res.status(400).send(error);
  }
});

const removeDoctor = asyncHandler(async (req, res) => {
  const doctorId = req.query.id;

  try {
    const doctor = await Doctor.findByIdAndDelete(doctorId);

    if (!doctor) {
      return res.status(404).send({ message: "Doctor not found" });
    }

    res.status(200).send({ message: "Doctor removed successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error removing doctor", error: error.message });
  }
});

const removePatient = asyncHandler(async (req, res) => {
  const patientId = req.query.patientId; // Assuming you pass the patient ID as a query parameter
  console.log(patientId);
  if (!patientId) {
    return res
      .status(400)
      .send({ message: "Patient ID is missing in the query" });
  }

  try {
    const patient = await Patient.findByIdAndDelete(patientId);

    if (!patient) {
      return res.status(404).send({ message: "Patient not found" });
    }

    res.status(200).send({ message: "Patient removed successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error removing patient", error: error.message });
  }
});

const addHealthPackage = asyncHandler(async (req, res) => {
  const {
    selectedpackage,
    Price,
    doctorDiscount,
    medicineDiscount,
    subscriptionDiscount,
  } = req.body;
  console.log(
    selectedpackage,
    doctorDiscount,
    Price,
    medicineDiscount,
    subscriptionDiscount
  );
  if (
    !selectedpackage ||
    !doctorDiscount ||
    !Price ||
    !medicineDiscount ||
    !subscriptionDiscount
  ) {
    return res.status(400).json({
      error:
        "selectedPackage,price,DoctorDiscount,medicinediscount and subscriptiondiscount are required",
    });
  }

  const HealthPackage = await healthPackage.create({
    type: req.body.selectedpackage,
    Price: req.body.Price,
    doctorDiscount: req.body.doctorDiscount,
    medicineDiscount: req.body.medicineDiscount,
    subscriptionDiscount: req.body.subscriptionDiscount,
  });
  return res.status(200).json({ message: "Health package added successfully" });
});

const editHealthPackage = asyncHandler(async (req, res) => {
  try {
    const healthPackageId = req.query.healthPackageId;

    // Check if the health package exists
    const existingHealthPackage = await healthPackage.findById(healthPackageId);

    if (!existingHealthPackage) {
      return res.status(404).json({ message: "Health package not found" });
    }

    // Parse the request body to get the updated field(s)
    const {
      selectedPackage,
      Price,
      doctorDiscount,
      medicineDiscount,
      subscriptionDiscount,
    } = req.body;

    // Update the health package document with the provided fields
    if (selectedPackage) {
      existingHealthPackage.type = selectedPackage;
    }
    if (Price) {
      existingHealthPackage.Price = Price;
    }
    if (doctorDiscount) {
      existingHealthPackage.doctorDiscount = doctorDiscount;
    }
    if (medicineDiscount) {
      existingHealthPackage.medicineDiscount = medicineDiscount;
    }
    if (subscriptionDiscount) {
      existingHealthPackage.subscriptionDiscount = subscriptionDiscount;
    }

    // Save the updated health package
    await existingHealthPackage.save();

    return res.status(200).json({
      message: "Health package updated successfully",
      existingHealthPackage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
const deleteHealthPackage = asyncHandler(async (req, res) => {
  try {
    const healthPackageId = req.query.healthPackageId;

    // Check if the health package exists
    const existingHealthPackage = await healthPackage.findById(healthPackageId);

    if (!existingHealthPackage) {
      return res.status(404).json({ message: "Health package not found" });
    }

    // Delete the health package document
    await healthPackage.findByIdAndRemove(healthPackageId);

    return res
      .status(200)
      .json({ message: "Health package deleted successfully", healthPackage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const approveDoctorRequest = asyncHandler(async (req, res) => {
  const applicantId = req.query.applicantId;
  var applicant = await Applicant.findById(applicantId);
  if (!applicant) {
    return res.status(404).json({ message: "Applicant not found" });
  }
  const doctor = await Doctor.create({
    username: applicant.username,
    name: applicant.name,
    email: applicant.email,
    password: applicant.password,
    dateOfBirth: applicant.dateOfBirth,
    hourlyRate: applicant.hourlyRate,
    affiliation: applicant.affiliation,
    educationalBackground: applicant.educationalBackground,
    speciality: applicant.speciality
  });
  await Applicant.findByIdAndDelete(applicantId);
  return res.status(200).send(doctor);
});

const disapproveDoctorRequest = asyncHandler(async (req, res) => {
  const applicantId = req.query.applicantId;
  var applicant = await Applicant.findById(applicantId);
  if (!applicant) {
    return res.status(404).json({ message: "Applicant not found" });
  }

  await Applicant.findByIdAndDelete(applicantId);
  return res.status(200).json({ message: "applicant rejected successfullly" });
});
const viewApplicants = asyncHandler(async (req, res) => {
  try {
    var applicants = await Applicant.find();
    if (!applicants) {
      return res.status(404).json({ message: "no applicants were found" });
    }
    return res.status(200).send(applicants);
  } catch (error) {
    return res.status(400).send(error);
  }
});

module.exports = {
  viewApplicants,
  addAdmin,
  addHealthPackage,
  removeAdmin,
  removeDoctor,
  removePatient,
  editHealthPackage,
  deleteHealthPackage,
  approveDoctorRequest,
  disapproveDoctorRequest,
  ViewAdmins,
  ViewPatients,
  ViewDoctors,
};
