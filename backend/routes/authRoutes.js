const express = require('express')
const router = express.Router()
const {register} = require('../controllers/guestController')
const {registerDoctor} = require('../controllers/doctorController')


router.post('/register',register)

router.post('/register-doctor',registerDoctor)
module.exports = router