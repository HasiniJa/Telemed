// db.js
const mongoose = require("mongoose");

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

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (err) {
    console.error("DB Disconnection Error:", err);
  }
};

module.exports = { mongoose, connect: connectDB, disconnect: disconnectDB };
