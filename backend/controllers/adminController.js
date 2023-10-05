const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin')

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

module.exports = {addAdmin}