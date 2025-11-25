const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const patientRoutes = require('./routes/patientroutes');

dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Root route to verify server is running
app.get('/', (req, res) => {
  res.send('Patient Service is running!');
});

// Mount patient routes
app.use('/api/patients', patientRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if DB connection fails
  });

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Patient Service running on port ${PORT}`));
