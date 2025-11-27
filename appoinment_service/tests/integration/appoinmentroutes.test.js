const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../src/app"); // points to your corrected app.js
const Appointment = require("../../src/models/appoimentmodel");
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Appointment.deleteMany({});
});

describe("Appointment Routes Integration Tests", () => {
  let appointment;

  test("should create a new appointment", async () => {
   
    const res = await request(app)
      .post("/api/appointments/book") 
      .send({
        patientId: "PAT100",
        doctorId: "DOC200",
        date: "2025-12-01",
        time: "10:00",
        reason: "Routine checkup",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.appointment.patientId).toBe("PAT100");
    appointment = res.body.appointment; // save for later tests
  });

  test("should fetch all appointments", async () => {
    // first create an appointment
    await Appointment.create({
      patientId: "PAT100",
      doctorId: "DOC200",
      date: "2025-12-01",
      time: "10:00",
      reason: "Routine checkup",
    });

    const res = await request(app).get("/api/appointments");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });

  test("should fetch appointment by ID", async () => {
    const newAppointment = await Appointment.create({
      patientId: "PAT100",
      doctorId: "DOC200",
      date: "2025-12-01",
      time: "10:00",
      reason: "Routine checkup",
    });

    const res = await request(app).get(`/api/appointments/${newAppointment.appointmentId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.appointmentId).toBe(newAppointment.appointmentId);
  });

  test("should update appointment", async () => {
    const newAppointment = await Appointment.create({
      patientId: "PAT100",
      doctorId: "DOC200",
      date: "2025-12-01",
      time: "10:00",
      reason: "Routine checkup",
    });

    const res = await request(app)
      .put(`/api/appointments/${newAppointment.appointmentId}`)
      .send({ reason: "Updated reason" });

    expect(res.statusCode).toBe(200);
    expect(res.body.appointment.reason).toBe("Updated reason");
  });

  test("should delete appointment", async () => {
    const newAppointment = await Appointment.create({
      patientId: "PAT100",
      doctorId: "DOC200",
      date: "2025-12-01",
      time: "10:00",
      reason: "Routine checkup",
    });

    const res = await request(app)
      .delete(`/api/appointments/${newAppointment.appointmentId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Appointment deleted successfully");
  });
});
