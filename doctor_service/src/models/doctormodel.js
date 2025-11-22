const mongoose = require('mongoose');
const Counter = require('./countermodel');

const doctorSchema = new mongoose.Schema({
  doctorId: { type: Number, unique: true },  // auto-incremented ID
  name: String,
  email: { type: String, unique: true },
  password: String,
  specialization: String,
  availability: [String],  
  consultationFee: Number
});


doctorSchema.pre('save', async function(next) {
  const doc = this;
  if (doc.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { id: 'doctorId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      doc.doctorId = counter.seq;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Doctor', doctorSchema);
