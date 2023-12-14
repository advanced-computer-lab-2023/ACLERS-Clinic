const express = require('express')
const router = express.Router()
const {getNotifications,getMedicines,viewMyInfo,searchForPatient,viewPatient,viewPatients,filterAppointments,addFreeSlot,addHealthRecord,editEmail, writePerscription, viewPatientHealthRecords, getDoctorBalance, ViewMyContract, acceptContract, denyContract, setAppointmentORFollowup, viewDoctorFreeSlots, viewPerscriptions, rescheduleAppointment,cancelAppointment, acceptFollowUp, rejectFollowUp}= require('../controllers/doctorController')
const {protect,checkRole} = require('../middleware/authMiddleware')
router.put('/editDocEmail',protect,checkRole('doctor'),editEmail)
router.get('/view-appointments',protect,checkRole('doctor'),filterAppointments)
router.get('/view-patients',protect,checkRole('doctor'),viewPatients)
router.get('/view-patient',protect,checkRole('doctor'),viewPatient)
router.get('/search',protect,checkRole('doctor'),searchForPatient)
router.post('/write-prescription',protect,checkRole('doctor'),writePerscription)
router.get('/view-my-info',protect,checkRole('doctor'),viewMyInfo)
router.post('/add-doctor-time-slot',protect,checkRole('doctor'),addFreeSlot)
router.get('/viewPatientRecords',protect,checkRole('doctor'),viewPatientHealthRecords)
router.get('/viewMyBalance',protect,checkRole('doctor'),getDoctorBalance)
router.post('/addHealthRecord',protect,checkRole('doctor'),addHealthRecord)
router.get('/viewMyContract',protect,checkRole('applicant'),ViewMyContract)
router.post('/acceptContract',protect,checkRole('applicant'),acceptContract)
router.post('/denyContract',protect,checkRole('applicant'),denyContract)
router.get('/viewFreeslots',protect,checkRole('doctor'),viewDoctorFreeSlots)
router.post('/setAppointment',protect,checkRole('doctor'),setAppointmentORFollowup)
router.get('/viewPerscriptions',protect,checkRole('doctor'),viewPerscriptions)
router.post('/rescheduleAppointment',protect,checkRole('doctor'),rescheduleAppointment)
router.post('/cancelAppointment',protect,checkRole('doctor'),cancelAppointment)
router.post('/acceptFollowup',protect,checkRole('doctor'),acceptFollowUp)
router.post('/rejectFollowUp',protect,checkRole('doctor'),rejectFollowUp)
router.get('/get-Medicines',protect,checkRole('doctor'),getMedicines)
router.get('/get-notifications',protect,checkRole('doctor'),getNotifications)













module.exports = router