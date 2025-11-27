const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const appoinmentroutes = require('./routes/appoinmentroutes');

require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./src/app");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Appointment Service DB connected");
    const PORT = process.env.PORT || 5003;
    app.listen(PORT, () =>
      console.log(`Appointment Service running on port ${PORT}`)
    );
  })
  .catch(err => console.error(err));
