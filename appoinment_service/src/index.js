const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const appoinmentroutes = require('./routes/appoinmentroutes');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/appoinments', appoinmentroutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
