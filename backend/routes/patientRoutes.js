const express = require('express')
const router = express.Router()

const {filterAppointments,addFamilyMember,viewFamilyMembers,setAppointment}= require('../controllers/patientController')

router.post('/add-family-member',addFamilyMember)
router.get('/view-fam-member',viewFamilyMembers)
router.post('/book-appointment',setAppointment)
router.get('/appointments',filterAppointments)
module.exports = router