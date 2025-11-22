const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Patient = require('../models/patientmodel');

//Register a patient
exports.register = async (req, res) => {
  try {
    const { name, email, password, age, gender } = req.body;

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create new patient
    const patient = await Patient.create({
      name,
      email,
      password: hashed,
      age,
      gender
    });

    res.status(201).json({
      message: 'Patient registered successfully',
      patient: {
        patientId: patient.patientId,
        name: patient.name,
        email: patient.email,
        age: patient.age,
        gender: patient.gender
      }
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};

// =====================
// LOGIN
// =====================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(404).json({ message: 'Not found' });

    const valid = await bcrypt.compare(password, patient.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: patient._id, role: 'patient', patientId: patient.patientId },
      process.env.JWT_SECRET
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =====================
// GET ALL PATIENTS
// =====================
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// GET PATIENT BY ID
// =====================
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.status(200).json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// UPDATE PATIENT
// =====================
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.status(200).json({ message: 'Patient updated successfully', patient });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// DELETE PATIENT
// =====================
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
