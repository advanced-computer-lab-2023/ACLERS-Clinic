// notificationService.js
const Notification = require('../models/Notification'); // Adjust the path accordingly

async function sendNotification(userId, message) {
  try {
    let notification = await Notification.findOne({ userId });

    if (!notification) {
      notification = await Notification.create({ userId });
    }

    notification.messages.push(message);
    await notification.save();

    console.log(`Notification sent to user ${userId}: ${message}`);
  } catch (error) {
    console.error(`Error sending notification: ${error.message}`);
  }
}

async function getNotifications(userId) {
  try {
    const notification = await Notification.findOne({ userId });
    console.log(notification)
    return notification ? notification.messages : [];
  } catch (error) {
    console.error(`Error getting notifications: ${error.message}`);
    return [];
  }
}

module.exports = { sendNotification, getNotifications };
