
const nodemailer = require("nodemailer");

const sendNotification = async (email,subject,body) => {
   // console.log(req.user);
    const emailService = email.split("@")[1];
  console.log(email)
    const serviceConfigurations = {
      "gmail.com": {
        service: "Gmail",
        auth: {
          user: "aclersomar@gmail.com",
          pass: "wadurapjmeodkpad",
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      "yahoo.com": {
        service: "Yahoo",
        auth: {
          user: "aclersomar@gmail.com",
          pass: "wadurapjmeodkpad",
        },
      },
      "hotmail.com": {
        service: "Outlook", // Hotmail uses Outlook
        auth: {
          user: "aclersomar@gmail.com",
          pass: "wadurapjmeodkpad",
        },
      },
    };
  
    if (serviceConfigurations[emailService]) {
      const transporter = nodemailer.createTransport(
        serviceConfigurations[emailService]
      );
  
      
      const mailOptions = {
        from: "aclersomar@gmail.com",
        to: email,
        subject: subject,
        text: body,
      };
      const sendMailPromise = () =>
        new Promise((resolve, reject) => {
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log("Error sending  email: " + error);
              reject(error);
            } else {
              console.log(" email sent: " + info.response);
              resolve(info);
            }
          });
        });
  
      // Use await to wait for the email sending operation to complete
      await sendMailPromise();
  
     
      
    } else {
      console.log("Unrecognized email service");
      res.status(400).json({ message: "Unrecognized email service" });
    }
  };
  module.exports = { sendNotification };