const { login, logout, upload } = require("../controllers/authController");
const express = require('express')
const router = express.Router()
const {registerPatient} = require('../controllers/authController')
const {registerDoctor} = require('../controllers/authController')

const {changePassword} = require('../controllers/authController')
const {protect} = require('../middleware/authMiddleware')
const {sendOTPEmail} = require('../controllers/authController')
const {resetPassword} = require('../controllers/authController')
router.post('/change-password',protect,changePassword);
router.post('/register-patient',registerPatient)
router.post('/logout',logout)
router.post('/register-doctor', upload.fields([
    { name: 'idDocument', maxCount: 1 }, // Field name for ID document
    { name: 'medicalLicense', maxCount: 1 }, // Field name for medical license
    { name: 'medicalDegree', maxCount: 1 }, // Field name for medical degree
  ]),registerDoctor)
router.post('/login',login)
router.post('/sendOTPEmail',sendOTPEmail)
router.post('/resetPassword',resetPassword)

module.exports = router