const express = require('express')
const router = express.Router()
const {registerPatient} = require('../controllers/authController')
const {registerDoctor} = require('../controllers/authController')
const {login,logout,upload} = require('../controllers/authController')

router.post('/register-patient',registerPatient)
router.post('/logout',logout)
router.post('/register-doctor', upload.fields([
    { name: 'idDocument', maxCount: 1 }, // Field name for ID document
    { name: 'medicalLicense', maxCount: 1 }, // Field name for medical license
    { name: 'medicalDegree', maxCount: 1 }, // Field name for medical degree
  ]),registerDoctor)
router.post('/login',login)
module.exports = router