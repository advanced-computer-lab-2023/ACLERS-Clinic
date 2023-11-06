const express = require('express')
const router = express.Router()

const {searchForDoctor,selectPresc,viewMyPerscriptions,viewDoctor,viewHealthPackages,subscribeHealthPackage,viewDoctors,filterAppointments,addFamilyMember,viewFamilyMembers,setAppointment}= require('../controllers/patientController')

router.post('/add-family-member',addFamilyMember)
router.get('/view-fam-member',viewFamilyMembers)
router.post('/book-appointment',setAppointment)
router.get('/appointments',filterAppointments)
router.get('/view-doctors',viewDoctors)
router.get('/view-healthPackages',viewHealthPackages),
router.post('/subscribe-healthPackage',subscribeHealthPackage)
router.get('/view-doctor',viewDoctor)
router.get('/view-perscriptions',viewMyPerscriptions)
router.get('/view-perscription',selectPresc)
router.get('/search',searchForDoctor)
module.exports = router