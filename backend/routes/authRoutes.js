const express = require('express')
const router = express.Router()
const {registerPatient} = require('../controllers/authController')
const {registerDoctor} = require('../controllers/authController')


router.post('/register-patient',registerPatient)

router.post('/register-doctor',registerDoctor)
module.exports = router