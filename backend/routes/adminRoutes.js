const express = require('express')
const router = express.Router()
const {addAdmin, removeAdmin, removeDoctor, removePatient}= require('../controllers/adminController')

router.post('/add-admin',addAdmin)
router.delete('/remove-admin', removeAdmin)
router.delete('/remove-doctor', removeDoctor)
router.delete('/remove-patient', removePatient)


module.exports = router