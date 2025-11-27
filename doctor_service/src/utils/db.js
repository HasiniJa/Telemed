// src/utils/db.js
const mongoose = require("mongoose");

/**
 * Connects to MongoDB
 * @param {string} uri - MongoDB connection string
 */
const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB Connection Error:", err);
    process.exit(1);
  }
};

/**
 * Disconnects from MongoDB
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (err) {
    console.error("DB Disconnection Error:", err);
  }
};

// Export both mongoose instance and helper functions

module.exports = { mongoose, connect: connectDB, disconnect: disconnectDB };
