const express = require('express')
const router = express.Router()
const {searchForPatient,viewPatient,viewPatients,filterAppointments,editEmail}= require('../controllers/doctorController')

router.put('/editDocEmail',editEmail)
router.get('/view-appointments',filterAppointments)
router.get('/view-patients',viewPatients)
router.get('/view-patient',viewPatient)
router.get('/search',searchForPatient)
module.exports = router