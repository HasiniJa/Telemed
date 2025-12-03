// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const appointmentRoutes = require('./routes/appoinmentroutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/appointments', appointmentRoutes);

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Appointment Service DB connected');

  // Start server
  const PORT = process.env.PORT || 5003;
  app.listen(PORT, () => console.log(`Appointment Service running on port ${PORT}`));
})
.catch(err => {
  console.error('Failed to connect to DB:', err);
  process.exit(1); // Exit process if DB fails
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});
