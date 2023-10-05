const express = require('express')
const router = express.Router()

const {addFamilyMember,viewFamilyMembers,setAppointment}= require('../controllers/patientController')

router.post('/add-family-member',addFamilyMember)
router.get('/view-fam-member',viewFamilyMembers)
router.post('/book-appointment',setAppointment)
module.exports = router