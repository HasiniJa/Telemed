const express = require('express');
const router = express.Router();
const controller = require('../controllers/patientcontroller');

// All route handlers should exist in your controller
router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/', controller.getAllPatients);
router.get('/:id', controller.getPatientById);
router.put('/:id', controller.updatePatient);
router.delete('/:id', controller.deletePatient);

module.exports = router;
