const express = require('express')
const router = express.Router()

const {upload,handleUpload,searchForDoctor,selectPresc,viewMyPerscriptions,viewDoctor,viewHealthPackages,subscribeHealthPackage,viewDoctors,filterAppointments,addFamilyMember,viewFamilyMembers,setAppointment}= require('../controllers/patientController')
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
router.post('/upload',upload.single('document'),handleUpload)
module.exports = router