const express = require('express')
const router = express.Router()

const {viewApplicants,approveDoctorRequest,disapproveDoctorRequest,deleteHealthPackage,editHealthPackage,addAdmin,addHealthPackage, removeAdmin, removeDoctor, removePatient}= require('../controllers/adminController')



router.post('/add-admin',addAdmin)
router.delete('/remove-admin', removeAdmin)
router.delete('/remove-doctor', removeDoctor)
router.delete('/remove-patient', removePatient)




router.post('/add-HealthPackage',addHealthPackage) 
 router.delete('/delete-HealthPackage',deleteHealthPackage)
 router.put('/update-HealthPackage',editHealthPackage)
router.post('/approve-doctor',approveDoctorRequest)
router.delete('/reject-doctor',disapproveDoctorRequest)
router.get('/view-applicants',viewApplicants)
module.exports = router
