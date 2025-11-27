// tests/unit/appoinmentcontroller.test.js
const Appointment = require("../../src/models/appoimentmodel");
const controller = require("../../src/controllers/appoinmentcontroller");

// Mock the Appointment model
jest.mock("../../src/models/appoimentmodel");

// Helper function to mock Express response
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Appointment Controller Unit Tests", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create appointment (201)", async () => {
    const req = {
      body: {
        patientId: "PAT100",
        doctorId: "DOC200",
        date: "2025-12-01",
        time: "10:00",
        reason: "Checkup",
      },
    };

    const res = mockResponse();

    const mockAppointmentInstance = {
      ...req.body,
      appointmentId: 1,
      save: jest.fn().mockResolvedValue({
        ...req.body,
        appointmentId: 1,
      }),
    };

    Appointment.mockImplementation(() => mockAppointmentInstance);

    await controller.createAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        appointment: expect.objectContaining({
          patientId: "PAT100",
          doctorId: "DOC200",
          date: "2025-12-01",
          time: "10:00",
          reason: "Checkup",
          appointmentId: 1,
        }),
        message: "Appointment created successfully",
      })
    );
  });

  test("should return all appointments", async () => {
    const fakeAppointments = [
      { appointmentId: 1, patientId: "PAT100", doctorId: "DOC200", date: "2025-12-01", time: "10:00", reason: "Checkup" },
    ];

    Appointment.find.mockResolvedValue(fakeAppointments);

    const req = {};
    const res = mockResponse();

    await controller.getAllAppointments(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeAppointments);
  });

  test("should return appointment by ID", async () => {
    const fakeAppointment = { appointmentId: 1, patientId: "PAT100" };
    Appointment.findOne.mockResolvedValue(fakeAppointment);

    const req = { params: { id: 1 } };
    const res = mockResponse();

    await controller.getAppointmentById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeAppointment);
  });

  test("should return 404 when appointment not found by ID", async () => {
    Appointment.findOne.mockResolvedValue(null);

    const req = { params: { id: 999 } };
    const res = mockResponse();

    await controller.getAppointmentById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Appointment not found" });
  });

  test("should update appointment", async () => {
    const updatedAppointment = { appointmentId: 1, reason: "Updated reason" };
    Appointment.findOneAndUpdate.mockResolvedValue(updatedAppointment);

    const req = { params: { id: 1 }, body: { reason: "Updated reason" } };
    const res = mockResponse();

    await controller.updateAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Appointment updated successfully",
      appointment: updatedAppointment,
    });
  });

  test("should return 404 when updating non-existing appointment", async () => {
    Appointment.findOneAndUpdate.mockResolvedValue(null);

    const req = { params: { id: 999 }, body: { reason: "Updated reason" } };
    const res = mockResponse();

    await controller.updateAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Appointment not found" });
  });

  test("should delete appointment", async () => {
    Appointment.findOneAndDelete.mockResolvedValue({ appointmentId: 1 });

    const req = { params: { id: 1 } };
    const res = mockResponse();

    await controller.deleteAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Appointment deleted successfully" });
  });

  test("should return 404 when deleting non-existing appointment", async () => {
    Appointment.findOneAndDelete.mockResolvedValue(null);

    const req = { params: { id: 999 } };
    const res = mockResponse();

    await controller.deleteAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Appointment not found" });
  });
});
