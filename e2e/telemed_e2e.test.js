// e2e/telemed_e2e.test.js
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Import apps
const patientApp = require("../patient_service/src/app");
const doctorApp = require("../doctor_service/src/app");
const appointmentApp = require("../appoinment_service/src/app");
const notificationApp = require("../notification_service/src/app");

// Import DB connectors
const patientDB = require("../patient_service/src/utils/db");
const doctorDB = require("../doctor_service/src/utils/db");
const appointmentDB = require("../appoinment_service/src/utils/db");
const notificationDB = require("../notification_service/src/utils/db");

let mongoServer;
let patient, doctor, appointment, notification;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect all services to the same in-memory DB
  await patientDB.connect(uri);
  await doctorDB.connect(uri);
  await appointmentDB.connect(uri);
  await notificationDB.connect(uri);
});

afterAll(async () => {
  // Disconnect all services
  await patientDB.disconnect();
  await doctorDB.disconnect();
  await appointmentDB.disconnect();
  await notificationDB.disconnect();

  // Stop in-memory server
  await mongoServer.stop();
});

describe("Telemed E2E Workflow", () => {
  test("Register a patient", async () => {
    const res = await request(patientApp)
      .post("/api/patients/register")
      .send({ name: "John Doe", email: "john@example.com", password: "1234" });

    expect(res.statusCode).toBe(201);
    expect(res.body.patient).toHaveProperty("patientId"); // match your service
    patient = res.body.patient;
  });

  test("Register a doctor", async () => {
    const res = await request(doctorApp)
      .post("/api/doctors/register")
      .send({ name: "Dr. Smith", email: "smith@example.com", password: "1234" });

    expect(res.statusCode).toBe(201);
    expect(res.body.doctor).toHaveProperty("id"); // match your service
    doctor = res.body.doctor;
  });

  test("Create an appointment", async () => {
    const res = await request(appointmentApp)
      .post("/api/appointments/book")
      .send({
        patientId: patient.patientId,
        doctorId: doctor.id,
        date: "2025-12-01",
        time: "10:00",
        reason: "Checkup",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.appointment).toHaveProperty("appointmentId");
    appointment = res.body.appointment;
  });

 test("Send a notification", async () => {
  const res = await request(notificationApp)
    .post("/api/notifications/send")
    .send({
      userId: patient.patientId,
      message: `Appointment confirmed with ${doctor.name} on ${appointment.date} at ${appointment.time}`
    });

  expect(res.statusCode).toBe(200);
  expect(res.body.notification).toHaveProperty("_id"); // <- updated to match API
  notification = res.body.notification;
});

test("Mark notification as read", async () => {
  const res = await request(notificationApp)
    .put(`/api/notifications/${notification._id}/read`); // use _id here as well

  expect(res.statusCode).toBe(200);
  expect(res.body.isRead).toBe(true);
});
 
  test("Delete the appointment", async () => {
    const res = await request(appointmentApp)
      .delete(`/api/appointments/${appointment.appointmentId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Appointment deleted successfully");
  });
});
