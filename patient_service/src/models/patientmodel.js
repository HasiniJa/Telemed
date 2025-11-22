const mongoose = require('mongoose');
const Counter = require('./countermodel'); // import counter model

const patientSchema = new mongoose.Schema({
  patientId: { type: Number, unique: true }, // new auto-increment field
  name: String,
  email: { type: String, unique: true },
  password: String,
  age: Number,
  gender: String,
  medicalHistory: [{ condition: String, medications: [String], date: Date }]
});

// Pre-save hook to auto-increment patientId
patientSchema.pre('save', async function(next) {
  const doc = this;
  if (doc.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { id: 'patientId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true } // create counter if not exists
      );
      doc.patientId = counter.seq;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Patient', patientSchema);
