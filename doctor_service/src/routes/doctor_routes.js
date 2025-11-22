const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorcontroller');

// Only register route
router.post('/register', doctorController.register);
router.post('/login', doctorController.login);
router.get('/',doctorController.getAllDoctors);
router.get('/:id',doctorController.getDoctorById);
router.put('/:id',doctorController.updateDoctor);
router.delete('/:id',doctorController.deleteDoctor);

module.exports = router;
