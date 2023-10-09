const express = require('express')
const router = express.Router()
const {searchForPatient,viewPatient,viewPatients,filterAppointments,editEmail, writePerscription}= require('../controllers/doctorController')

router.put('/editDocEmail',editEmail)
router.get('/view-appointments',filterAppointments)
router.get('/view-patients',viewPatients)
router.get('/view-patient',viewPatient)
router.get('/search',searchForPatient)
router.post('/write-perscription',writePerscription)
module.exports = router