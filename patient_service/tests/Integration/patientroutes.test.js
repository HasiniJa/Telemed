// tests/integration/patientRoutes.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app'); // your Express app
const Patient = require('../../src/models/patientmodel');

let mongoServer;

// Set JWT secret for tests
process.env.JWT_SECRET = 'test_secret';

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Patient.deleteMany(); // clear DB after each test
});

describe('Patient Routes Integration', () => {

  it('should register a new patient', async () => {
    const res = await request(app)
      .post('/api/patients/register')
      .send({ name: 'John', email: 'john@test.com', password: '1234', age: 25, gender: 'M' });

    expect(res.statusCode).toBe(201);
    expect(res.body.patient.name).toBe('John');
    expect(res.body.patient.email).toBe('john@test.com');
  });

  it('should not register duplicate email', async () => {
    await request(app)
      .post('/api/patients/register')
      .send({ name: 'Jane', email: 'jane@test.com', password: '1234', age: 20, gender: 'F' });

    const res = await request(app)
      .post('/api/patients/register')
      .send({ name: 'Jane2', email: 'jane@test.com', password: '1234', age: 22, gender: 'F' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Email already exists');
  });

  it('should login an existing patient', async () => {
    await request(app)
      .post('/api/patients/register')
      .send({ name: 'John', email: 'john@test.com', password: '1234', age: 25, gender: 'M' });

    const res = await request(app)
      .post('/api/patients/login')
      .send({ email: 'john@test.com', password: '1234' });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should get all patients', async () => {
    await request(app)
      .post('/api/patients/register')
      .send({ name: 'John', email: 'john@test.com', password: '1234', age: 25, gender: 'M' });

    const res = await request(app).get('/api/patients');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('John');
  });

  it('should get patient by ID', async () => {
    await request(app)
      .post('/api/patients/register')
      .send({ name: 'John', email: 'john@test.com', password: '1234', age: 25, gender: 'M' });

    const patientFromDb = await Patient.findOne({ email: 'john@test.com' });
    const patientId = patientFromDb._id;

    const res = await request(app).get(`/api/patients/${patientId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('John');
  });

  it('should update a patient', async () => {
    await request(app)
      .post('/api/patients/register')
      .send({ name: 'John', email: 'john@test.com', password: '1234', age: 25, gender: 'M' });

    const patientFromDb = await Patient.findOne({ email: 'john@test.com' });
    const patientId = patientFromDb._id;

    const res = await request(app)
      .put(`/api/patients/${patientId}`)
      .send({ name: 'John Updated' });

    expect(res.statusCode).toBe(200);
    expect(res.body.patient.name).toBe('John Updated');
  });

  it('should delete a patient', async () => {
    await request(app)
      .post('/api/patients/register')
      .send({ name: 'John', email: 'john@test.com', password: '1234', age: 25, gender: 'M' });

    const patientFromDb = await Patient.findOne({ email: 'john@test.com' });
    const patientId = patientFromDb._id;

    const res = await request(app).delete(`/api/patients/${patientId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Patient deleted successfully');
  });

});
