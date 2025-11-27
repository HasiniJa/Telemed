const Patient = require('../../src/models/patientmodel');
const controller = require('../../src/controllers/patientcontroller');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/patientmodel');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Patient Controller', () => {

  // =====================
  // REGISTER
  // =====================
  describe('register', () => {
    it('should register a new patient successfully', async () => {
      const req = { body: { name: 'John', email: 'john@test.com', password: '1234', age: 25, gender: 'M' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      bcrypt.hash.mockResolvedValue('hashedpassword');
      Patient.create.mockResolvedValue({
        patientId: 'p123',
        name: 'John',
        email: 'john@test.com',
        age: 25,
        gender: 'M'
      });

      await controller.register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Patient registered successfully',
        patient: expect.objectContaining({ name: 'John', email: 'john@test.com' })
      }));
    });

    it('should return 400 if email already exists', async () => {
      const req = { body: { email: 'john@test.com' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Patient.create.mockRejectedValue({ code: 11000 });

      await controller.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Email already exists" });
    });
  });

  // =====================
  // LOGIN
  // =====================
  describe('login', () => {
    it('should return 404 if patient not found', async () => {
      const req = { body: { email: 'a@test.com', password: '123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Patient.findOne.mockResolvedValue(null);

      await controller.login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
    });

    it('should return 401 if password invalid', async () => {
      const req = { body: { email: 'a@test.com', password: 'wrong' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Patient.findOne.mockResolvedValue({ password: 'hashed' });
      bcrypt.compare.mockResolvedValue(false);

      await controller.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    it('should return token on successful login', async () => {
      const req = { body: { email: 'a@test.com', password: '123' } };
      const res = { json: jest.fn() };

      Patient.findOne.mockResolvedValue({ _id: 'id123', password: 'hashed', patientId: 'p1' });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockedtoken');

      await controller.login(req, res);

      expect(res.json).toHaveBeenCalledWith({ token: 'mockedtoken' });
    });
  });

  // =====================
  // GET ALL PATIENTS
  // =====================
  describe('getAllPatients', () => {
    it('should return all patients', async () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Patient.find.mockResolvedValue([{ name: 'John' }]);

      await controller.getAllPatients(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ name: 'John' }]);
    });
  });

  // =====================
  // GET PATIENT BY ID
  // =====================
  describe('getPatientById', () => {
    it('should return 404 if not found', async () => {
      const req = { params: { id: '123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Patient.findById.mockResolvedValue(null);

      await controller.getPatientById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Patient not found' });
    });

    it('should return patient if found', async () => {
      const req = { params: { id: '123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const patient = { _id: '123', name: 'John' };
      Patient.findById.mockResolvedValue(patient);

      await controller.getPatientById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(patient);
    });
  });

  // =====================
  // UPDATE PATIENT
  // =====================
  describe('updatePatient', () => {
    it('should return 404 if patient not found', async () => {
      const req = { params: { id: '123' }, body: { name: 'Updated' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Patient.findByIdAndUpdate.mockResolvedValue(null);

      await controller.updatePatient(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Patient not found' });
    });

    it('should update patient successfully', async () => {
      const req = { params: { id: '123' }, body: { name: 'Updated' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      const updatedPatient = { _id: '123', name: 'Updated' };
      Patient.findByIdAndUpdate.mockResolvedValue(updatedPatient);

      await controller.updatePatient(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Patient updated successfully', patient: updatedPatient });
    });
  });

  // =====================
  // DELETE PATIENT
  // =====================
  describe('deletePatient', () => {
    it('should return 404 if patient not found', async () => {
      const req = { params: { id: '123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Patient.findByIdAndDelete.mockResolvedValue(null);

      await controller.deletePatient(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Patient not found' });
    });

    it('should delete patient successfully', async () => {
      const req = { params: { id: '123' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      Patient.findByIdAndDelete.mockResolvedValue({ _id: '123' });

      await controller.deletePatient(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Patient deleted successfully' });
    });
  });

});
