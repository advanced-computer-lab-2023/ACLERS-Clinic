// notificationModel.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  messages: {
    type: [String],
    default: [],
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
