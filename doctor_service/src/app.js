const express = require('express');
const doctorRoutes = require('./routes/doctor_routes');

const app = express();
app.use(express.json());

app.use("/api/doctors", doctorRoutes);

module.exports = app;
