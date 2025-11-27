const express = require('express');
const appointmentRoutes = require('./routes/appoinmentroutes');

const app = express();
app.use(express.json());

app.use("/api/appointments", appointmentRoutes);

module.exports = app;


// Mount appointment routes
app.use('/api/appointments', appointmentRoutes); 
// Export app for testing (do NOT start server here)
module.exports = app;
