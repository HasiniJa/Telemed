const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctormodel');

/**
 * REGISTER DOCTOR
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, specialization, availability, consultationFee } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create doctor
    const doctor = await Doctor.create({
      name,
      email,
      password: hashedPassword,
      specialization,
      availability,
      consultationFee
    });

    return res.status(201).json({
      message: 'Doctor registered successfully',
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        availability: doctor.availability,
        consultationFee: doctor.consultationFee
      }
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * LOGIN DOCTOR
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(404).json({ message: 'Not found' });

    const valid = await bcrypt.compare(password, doctor.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET missing!");
      return res.status(500).json({ error: "JWT_SECRET missing" });
    }

    const token = jwt.sign(
      { id: doctor._id, role: 'doctor' },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET ALL DOCTORS
 */
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    return res.status(200).json(doctors);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * GET BY ID
 */
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    return res.status(200).json(doctor);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE DOCTOR
 */
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    return res.status(200).json({ message: 'Doctor updated successfully', doctor });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE DOCTOR
 */
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    return res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
