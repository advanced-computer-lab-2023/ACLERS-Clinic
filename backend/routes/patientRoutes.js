const express = require('express')
const router = express.Router()

<<<<<<< HEAD
const {upload,handleUpload,searchForDoctor,selectPresc,viewMyPerscriptions,viewDoctor,getPatientBalance,viewHealthPackages,subscribeHealthPackage,viewDoctors,filterAppointments,addFamilyMember,viewFamilyMembers,setAppointment, viewMyHealthRecords, viewSubscribedHealthPackage}= require('../controllers/patientController')
=======
const {subscribeHealthPackageFamMember,payUsingStripe,removeHealthRecordAttachment,linkAccount,upload,handleUpload,searchForDoctor,selectPresc,viewMyPerscriptions,viewDoctor,viewHealthPackages,subscribeHealthPackage,viewDoctors,filterAppointments,addFamilyMember,viewFamilyMembers,setAppointment}= require('../controllers/patientController')
>>>>>>> omar
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
<<<<<<< HEAD
router.post('/upload',upload.single('document'),handleUpload)
router.get('/viewMyHealthRecords',protect,checkRole('patient'),viewMyHealthRecords)
router.get('/viewMyBalance',protect,checkRole('patient'),getPatientBalance)
router.get('/viewSubscribedHealthPackage',protect,checkRole('patient'),viewSubscribedHealthPackage)




=======
router.post('/upload',protect,checkRole('patient'),upload.single('document'),handleUpload)
router.post('/link-fam-member',protect,checkRole('patient'),linkAccount)
router.delete('/removeAttachment',protect,checkRole('patient'),removeHealthRecordAttachment)
router.post('/pay',protect,checkRole('patient'),payUsingStripe)
router.post('/subscribe-healthpack-famMem',protect,checkRole('patient'),subscribeHealthPackageFamMember)
>>>>>>> omar
module.exports = router