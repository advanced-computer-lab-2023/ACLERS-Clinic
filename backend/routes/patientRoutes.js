const express = require('express')
const router = express.Router()

const {requestFollowUp,cancelAppointmentFamMem,cancelAppointment,rescheduleAppointmentFamMem,rescheduleAppointment,setAppointmentFamMem,cancelSubscription,cancelSubscriptionFamMem,viewAppointmentsOfDr,viewSubscribedHealthPackageFamMem,subscribeHealthPackageFamMember,payUsingStripe,removeHealthRecordAttachment,getPatientBalance,linkAccount,upload,handleUpload,searchForDoctor,selectPresc,viewMyPerscriptions,viewDoctor,viewHealthPackages,subscribeHealthPackage, viewMyHealthRecords,viewDoctors, viewSubscribedHealthPackage,filterAppointments,addFamilyMember,viewFamilyMembers,setAppointment}= require('../controllers/patientController')
const {protect,checkRole} = require('../middleware/authMiddleware')
router.post('/add-family-member',protect,checkRole('patient'),addFamilyMember)
router.get('/view-fam-member',protect,checkRole('patient'),viewFamilyMembers)
router.post('/book-appointment',protect,checkRole('patient'),setAppointment)
router.get('/appointments',protect,checkRole('patient'),filterAppointments)
router.get('/view-doctors',protect,checkRole('patient'),viewDoctors)
router.get('/view-healthPackages',protect,checkRole('patient'),viewHealthPackages),
router.post('/subscribe-healthPackage',protect,checkRole('patient'),subscribeHealthPackage)
router.get('/view-doctor',protect,checkRole('patient'),viewDoctor)
router.get('/view-perscriptions',protect,checkRole('patient'),viewMyPerscriptions)
router.get('/view-perscription',protect,checkRole('patient'),selectPresc)
router.get('/search',protect,checkRole('patient'),searchForDoctor)
router.post('/book-appointment-fam',protect,checkRole('patient'),setAppointmentFamMem)
router.get('/viewMyHealthRecords',protect,checkRole('patient'),viewMyHealthRecords)
router.get('/viewMyBalance',protect,checkRole('patient'),getPatientBalance)
router.get('/viewSubscribedHealthPackage',protect,checkRole('patient'),viewSubscribedHealthPackage)
router.post('/cancel-subscription',protect,checkRole('patient'),cancelSubscription)
router.post('/cancel-subscription-famMem',protect,checkRole('patient'),cancelSubscriptionFamMem)
router.get('/view-appointments',protect,checkRole('patient'),viewAppointmentsOfDr)
router.get('/view-HealthPack-FamMember',protect,checkRole('patient'),viewSubscribedHealthPackageFamMem)
router.post('/upload',protect,checkRole('patient'),upload.single('document'),handleUpload)
router.post('/link-fam-member',protect,checkRole('patient'),linkAccount)
router.delete('/removeAttachment',protect,checkRole('patient'),removeHealthRecordAttachment)
router.post('/pay',protect,checkRole('patient'),payUsingStripe)
router.post('/subscribe-healthpack-famMem',protect,checkRole('patient'),subscribeHealthPackageFamMember)
router.post('/reschedule-appointment',protect,checkRole('patient'),rescheduleAppointment)
router.post('/reschedule-appointment-fam',protect,checkRole('patient'),rescheduleAppointmentFamMem)
router.post('/cancel-appointment',protect,checkRole('patient'),cancelAppointment)
router.post('/cancel-appointment-fam',protect,checkRole('patient'),cancelAppointmentFamMem)
router.post('/request-followUp',protect,checkRole('patient'),requestFollowUp)
module.exports = router