const request = require('supertest');
const mongoose = require('mongoose');
 const app = require('../../src/app'); // your express app // your express app
const Doctor = require('../../src/models/doctormodel');

// ---- FIX: Add required env variables for tests ----
process.env.JWT_SECRET = "testsecret123";
process.env.MONGO_URI = "mongodb://localhost:27017/doctor_test_db";

describe("Doctor Routes Integration", () => {

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await Doctor.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  let doctorId;

  test("should register a new doctor", async () => {
    const res = await request(app)
      .post('/api/doctors/register')
      .send({
        name: "John Doe",
        email: "john@test.com",
        password: "1234"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.doctor).toBeDefined();
    doctorId = res.body.doctor._id;
  });

  test("should login an existing doctor", async () => {
    const res = await request(app)
      .post('/api/doctors/login')
      .send({
        email: "john@test.com",
        password: "1234"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

});
