const express = require('express')
const router = express.Router()
const {register, getPatients} = require('../controllers/guestController')

router.post('/register',register)
router.get('/',getPatients)





module.exports = router