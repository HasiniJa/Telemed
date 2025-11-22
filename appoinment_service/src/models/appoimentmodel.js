const mongoose = require("mongoose");
const Counter = require("./countermodel");

const appointmentSchema = new mongoose.Schema({
    appointmentId: { type: Number, unique: true },
    patientId: { type: String, required: true },
    doctorId: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    reason: { type: String }
});

// Auto-increment middleware
appointmentSchema.pre("save", async function (next) {
    if (!this.isNew) return next(); // Only increment for new docs

    try {
        const counter = await Counter.findByIdAndUpdate(
            { _id: "appointmentId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        this.appointmentId = counter.seq;
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("Appointment", appointmentSchema);
