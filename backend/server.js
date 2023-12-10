const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const { urlencoded } = require("body-parser");
const port = process.env.PORT;
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const http = require('http');
const socketIO = require('socket.io');
const uuidv4 = require('uuid').v4;

connectDB();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

const server = http.createServer(app)
const io = require("socket.io")(8600, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your client's origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));


app.use(express.json());
const endpointSecret =
  "whsec_e3aa0605f96c7a9b4d65f2fbdaa3d5c8fe1c741bbd51a03a36a63796a4a11cf9";

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const roomDoctorMap = {};
  
//app.use(express.urlencoded({extended : false}))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// app.use('/patients',require('./routes/guestRoutes'))
app.use("/auth", require("./routes/authRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/Doctor-Home", require("./routes/doctorRoutes"));
app.use("/Patient-Home", require("./routes/patientRoutes"));

app.listen(port, () => console.log("server started on port " + port));
