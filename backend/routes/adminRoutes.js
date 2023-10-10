const express = require("express");
const router = express.Router();

const {
  ViewAdmins,
  ViewDoctors,
  ViewPatients,
  viewApplicants,
  approveDoctorRequest,
  disapproveDoctorRequest,
  deleteHealthPackage,
  editHealthPackage,
  addAdmin,
  addHealthPackage,
  removeAdmin,
  removeDoctor,
  removePatient,
  viewHealthPackges,
  viewPackage
} = require("../controllers/adminController");

router.post("/add-admin", addAdmin);
router.delete("/remove-admin", removeAdmin);
router.delete("/remove-doctor", removeDoctor);
router.delete("/remove-patient", removePatient);
router.get("/view-admins", ViewAdmins);
router.get("/view-doctors", ViewDoctors);
router.get("/view-patients", ViewPatients);
router.get("/view-HealthPackage",viewHealthPackges)
router.post("/add-HealthPackage", addHealthPackage);
router.delete("/delete-HealthPackage", deleteHealthPackage);
router.put("/update-HealthPackage", editHealthPackage);
router.post("/approve-doctor", approveDoctorRequest);
router.delete("/reject-doctor", disapproveDoctorRequest);
router.get("/view-applicants", viewApplicants);
router.get("/view-HealthPackage",viewPackage)
module.exports = router;
