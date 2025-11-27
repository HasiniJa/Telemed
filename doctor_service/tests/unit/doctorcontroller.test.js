const doctorController = require('../../src/controllers/doctorcontroller');
const Doctor = require('../../src/models/doctormodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
 const app = require('../../src/app'); // your express app

jest.mock('../../src/models/doctormodel'); // Mock model
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

process.env.JWT_SECRET = 'test_secret';

describe('Doctor Controller Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test('register should handle duplicate email', async () => {
    req.body = { name: 'John', email: 'john@test.com', password: '1234', specialization: 'Cardio' };
    Doctor.create.mockRejectedValue({ code: 11000 });

    await doctorController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email already exists' });
  });

  test('login should return 404 if doctor not found', async () => {
    req.body = { email: 'john@test.com', password: '1234' };
    Doctor.findOne.mockResolvedValue(null);

    await doctorController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
  });
});
