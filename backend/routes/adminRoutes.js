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
  viewPackage,
  changePassword
} = require("../controllers/adminController");


router.post("/add-admin", addAdmin);
router.delete("/remove-admin", removeAdmin);
router.delete("/remove-doctor", removeDoctor);
router.delete("/remove-patient", removePatient);
router.get("/view-admins", ViewAdmins);
router.get("/view-doctors", ViewDoctors);
router.get("/view-patients", ViewPatients);
router.get("/view-health-packages", viewHealthPackges);
router.post("/add-health-package", addHealthPackage);
router.delete("/delete-health-package", deleteHealthPackage);
router.put("/update-health-package", editHealthPackage);
router.post("/approve-doctor", approveDoctorRequest);
router.delete("/reject-doctor", disapproveDoctorRequest);
router.get("/view-applicants", viewApplicants);
router.get("/view-health-package", viewPackage);

module.exports = router;
