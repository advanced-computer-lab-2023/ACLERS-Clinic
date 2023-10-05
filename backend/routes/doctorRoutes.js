const express = require('express')
const router = express.Router()
const {editEmail}= require('../controllers/doctorController')

router.put('/editDocEmail',editEmail)

module.exports = router