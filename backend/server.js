const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const { urlencoded } = require("body-parser");
const port = process.env.PORT;
const cors = require("cors");
const multer = require("multer");
const path = require("path");

connectDB();

const app = express();

app.use(express.json())
const endpointSecret = "whsec_e3aa0605f96c7a9b4d65f2fbdaa3d5c8fe1c741bbd51a03a36a63796a4a11cf9";


const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
app.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
    const sig = request.headers['stripe-signature'];
    console.log("webhook")
    console.log(request.body)
    console.log('Signature:', sig);
console.log('Endpoint Secret:', endpointSecret);
    let event;
  
    try {
      event = await stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log(event.data)
      handleStripeEvent(event)
    } catch (err) {
        console.log(err)
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // Handle the event
    console.log(`Unhandled event type ${event.type}`);
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  });
  function handleStripeEvent(event) {
    switch (event.type) {
      case 'checkout.session.completed':
        // Handle the event when a payment is completed
        const session = event.data.object;
        const paymentStatus = session.payment_status;
        console.log("paid")
        // Check the payment status, and perform actions accordingly
        if (paymentStatus === 'paid') {
          // Payment was successful
          // You can update your database or perform other actions here
          console.log('Payment was successful');
        } else {
          // Payment failed or incomplete
          console.log('Payment failed or incomplete');
        }
        break;
      // Add more event types and handling as needed
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }
//app.use(express.urlencoded({extended : false}))
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
