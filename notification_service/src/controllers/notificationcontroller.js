const Notification = require("../models/notificationmodel");

// CREATE
exports.sendNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.json({ message: "Notification sent", notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
exports.getNotifications = async (req, res) => {
  try {
    const data = await Notification.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// MARK AS READ
exports.markAsRead = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
