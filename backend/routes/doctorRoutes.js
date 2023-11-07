const express = require('express')
const router = express.Router()
const {viewMyInfo,searchForPatient,viewPatient,viewPatients,filterAppointments,addFreeSlot,addHealthRecord,editEmail, writePerscription, viewPatientHealthRecords, getDoctorBalance}= require('../controllers/doctorController')
const {protect,checkRole} = require('../middleware/authMiddleware')
router.put('/editDocEmail',protect,checkRole('doctor'),editEmail)
router.get('/view-appointments',protect,checkRole('doctor'),filterAppointments)
router.get('/view-patients',protect,checkRole('doctor'),viewPatients)
router.get('/view-patient',protect,checkRole('doctor'),viewPatient)
router.get('/search',protect,checkRole('doctor'),searchForPatient)
router.post('/write-perscription',protect,checkRole('doctor'),writePerscription)
router.get('/view-my-info',protect,checkRole('doctor'),viewMyInfo)
router.post('/add-doctor-time-slot',protect,checkRole('doctor'),addFreeSlot)
router.get('/viewPatientRecords',protect,checkRole('doctor'),viewPatientHealthRecords)
router.get('/viewMyBalance',protect,checkRole('doctor'),getDoctorBalance)
router.post('/addHealthRecord',protect,checkRole('doctor'),addHealthRecord)




module.exports = router