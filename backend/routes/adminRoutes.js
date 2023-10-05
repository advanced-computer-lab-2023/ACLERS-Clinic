const express = require('express')
const router = express.Router()
const {addAdmin,addHealthPackage}= require('../controllers/adminController')

router.post('/add-admin',addAdmin)



router.post('/add-HealthPackage',addHealthPackage) 
// router.post('/delete-HealthPackage',deleteHealthPackage)
// router.post('/update-HealthPackage',updateHealthPackage)

module.exports = router
