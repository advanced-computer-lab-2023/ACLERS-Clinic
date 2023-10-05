const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin')
const healthPackage=require('../models/healthPackage')

const addAdmin = asyncHandler( async (req,res)=>{
    const username = req.body.username
    const saltRounds = await bcrypt.genSalt(10); // You can adjust the number of salt rounds for security
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
   const Admin = await Admin.create({
    username:username,
    password : hashedPassword
   })
   res.status(200).send(Admin)
})






const addHealthPackage = asyncHandler (async(req,res)=>{
    const { selectedpackage , Price , doctorDiscount , medicineDiscount , subscriptionDiscount} = req.body;
   console.log(selectedpackage,doctorDiscount,Price,medicineDiscount,subscriptionDiscount)
    if(!selectedpackage || !doctorDiscount || !Price || !medicineDiscount || ! subscriptionDiscount){
        return res.status(400).json({ error: 'selectedPackage,price,DoctorDiscount,medicinediscount and subscriptiondiscount are required' })
        
    }


    const HealthPackage = await healthPackage.create({
        type:req.body.selectedpackage,
        Price:req.body.Price,
        doctorDiscount:req.body.doctorDiscount,
        medicineDiscount:req.body.medicineDiscount,
        subscriptionDiscount:req.body.subscriptionDiscount
      })
return res.status(200).json({ message: 'Health package added successfully' });




});

module.exports = {addAdmin,addHealthPackage}





