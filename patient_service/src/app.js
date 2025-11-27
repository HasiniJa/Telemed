const express = require("express");
const patientRoutes = require("./routes/patientroutes");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use("/api/patients", patientRoutes);

module.exports = app;
