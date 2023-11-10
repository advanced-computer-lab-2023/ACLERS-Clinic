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
const {protect,checkRole} = require('../middleware/authMiddleware')
router.post("/add-admin",protect,checkRole('admin'), addAdmin);
router.delete("/remove-admin",protect,checkRole('admin'), removeAdmin);
router.delete("/remove-doctor",protect,checkRole('admin'), removeDoctor);
router.delete("/remove-patient",protect,checkRole('admin'), removePatient);
router.get("/view-admins",protect,checkRole('admin'), ViewAdmins);
router.get("/view-doctors",protect,checkRole('admin'), ViewDoctors);
router.get("/view-patients",protect,checkRole('admin'), ViewPatients);
router.get("/view-HealthPackage",protect,checkRole('admin'),viewHealthPackges)
router.post("/add-HealthPackage",protect,checkRole('admin'), addHealthPackage);
router.delete("/delete-HealthPackage",protect,checkRole('admin'), deleteHealthPackage);
router.put("/update-HealthPackage",protect,checkRole('admin'), editHealthPackage);
router.post("/approve-doctor",protect,checkRole('admin'), approveDoctorRequest);
router.delete("/reject-doctor",protect,checkRole('admin'), disapproveDoctorRequest);
router.get("/view-applicants",protect,checkRole('admin'), viewApplicants);
router.get("/view-HealthPackage",protect,checkRole('admin'),viewPackage)
module.exports = router;
