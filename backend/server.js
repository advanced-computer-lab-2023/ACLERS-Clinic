const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const { urlencoded } = require("body-parser");
const port = process.env.PORT;
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
connectDB();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use(express.json());
const endpointSecret =
  "whsec_e3aa0605f96c7a9b4d65f2fbdaa3d5c8fe1c741bbd51a03a36a63796a4a11cf9";

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);


  
//app.use(express.urlencoded({extended : false}))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.get("/", (req, res) => {
  res.send("hello world");
});
// app.use('/patients',require('./routes/guestRoutes'))
app.use("/auth", require("./routes/authRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/Doctor-Home", require("./routes/doctorRoutes"));
app.use("/Patient-Home", require("./routes/patientRoutes"));
app.listen(port, () => console.log("server started on port " + port));
