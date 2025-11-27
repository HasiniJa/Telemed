const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const doctorRoutes = require('./routes/doctor_routes');

require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./src/app");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Doctor Service DB connected");
    const PORT = process.env.PORT || 5002;
    app.listen(PORT, () =>
      console.log(`Doctor Service running on port ${PORT}`)
    );
  })
  .catch(err => console.error(err));
