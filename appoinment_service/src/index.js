const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const appoinmentroutes = require('./routes/appoinmentroutes');

dotenv.config();

const app = express();
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Mount appointment routes
app.use('/api/appoinments', appoinmentroutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
