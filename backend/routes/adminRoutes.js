const express = require('express')
const router = express.Router()
const {addAdmin}= require('../controllers/adminController')

router.post('/add-admin',addAdmin)

module.exports = router