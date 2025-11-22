const Appointment = require("../models/appoimentmodel");

// -------------------------
// CREATE APPOINTMENT
// -------------------------
exports.createAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, date, time, reason } = req.body;

        if (!patientId || !doctorId || !date || !time) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const newAppointment = new Appointment({
            patientId,
            doctorId,
            date,
            time,
            reason
        });

        await newAppointment.save();

        res.status(201).json({
            message: "Appointment created successfully",
            appointment: newAppointment
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// -------------------------
// GET ALL APPOINTMENTS
// -------------------------
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// -------------------------
// GET APPOINTMENT BY ID
// -------------------------
exports.getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findOne({ appointmentId: id });

        if (!appointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        res.status(200).json(appointment);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// -------------------------
// UPDATE APPOINTMENT
// -------------------------
exports.updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedAppointment = await Appointment.findOneAndUpdate(
            { appointmentId: id },
            req.body,
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        res.status(200).json({
            message: "Appointment updated successfully",
            appointment: updatedAppointment
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// -------------------------
// DELETE APPOINTMENT
// -------------------------
exports.deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Appointment.findOneAndDelete({ appointmentId: id });

        if (!deleted) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        res.status(200).json({
            message: "Appointment deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
