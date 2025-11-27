const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./utils/db");
const notificationRoutes = require("./routes/notificationroutes");

require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./src/app");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Notification Service DB connected");
    const PORT = process.env.PORT || 5004;
    app.listen(PORT, () =>
      console.log(`Notification Service running on port ${PORT}`)
    );
  })
  .catch(err => console.error(err));