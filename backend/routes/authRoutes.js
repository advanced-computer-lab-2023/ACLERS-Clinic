const express = require('express')
const router = express.Router()
const {registerPatient} = require('../controllers/authController')
const {registerDoctor} = require('../controllers/authController')
const {login,logout} = require('../controllers/authController')

router.post('/register-patient',registerPatient)
router.post('/logout',logout)
router.post('/register-doctor',registerDoctor)
router.post('/login',login)
module.exports = router