const express = require('express')
const router = express.Router()
const {registerPatient} = require('../controllers/authController')
const {registerDoctor} = require('../controllers/authController')
const {login,logout} = require('../controllers/authController')
const {changePassword} = require('../controllers/authController')
const {protect} = require('../middleware/authMiddleware')
const {sendOTPEmail} = require('../controllers/authController')
const {resetPassword} = require('../controllers/authController')
router.post('/change-password',protect,changePassword);
router.post('/register-patient',registerPatient)
router.post('/logout',logout)
router.post('/register-doctor',registerDoctor)
router.post('/login',login)
router.post('/sendOTPEmail',sendOTPEmail)
router.post('/resetPassword',resetPassword)

module.exports = router