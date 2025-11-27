// tests/unit/notificationcontroller.test.js
const Notification = require("../../src/models/notificationmodel");
const controller = require("../../src/controllers/notificationcontroller");

// Mock the Mongoose model
jest.mock("../../src/models/notificationmodel");

describe("Notification Controller Unit Tests", () => {
  let mockResponse;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create a simple mock response object
    mockResponse = () => {
      const res = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };
  });

  test("should send notification", async () => {
    const req = { body: { userId: "USER123", message: "Hello" } };
    const res = mockResponse();

    const fakeNotification = { _id: "1", ...req.body };
    Notification.create.mockResolvedValue(fakeNotification);

    await controller.sendNotification(req, res);

    expect(Notification.create).toHaveBeenCalledWith(req.body);
    expect(res.json).toHaveBeenCalledWith({
      message: "Notification sent",
      notification: fakeNotification,
    });
  });

  test("should get all notifications", async () => {
    const req = {};
    const res = mockResponse();

    const fakeData = [{ _id: "1", message: "Test" }];
    Notification.find.mockResolvedValue(fakeData);

    await controller.getNotifications(req, res);

    expect(Notification.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(fakeData);
  });

  test("should mark notification as read", async () => {
    const req = { params: { id: "1" } };
    const res = mockResponse();

    const updatedNotification = { _id: "1", isRead: true };
    Notification.findByIdAndUpdate.mockResolvedValue(updatedNotification);

    await controller.markAsRead(req, res);

    expect(Notification.findByIdAndUpdate).toHaveBeenCalledWith(
      "1",
      { isRead: true },
      { new: true }
    );
    expect(res.json).toHaveBeenCalledWith(updatedNotification);
  });

  test("should delete notification", async () => {
    const req = { params: { id: "1" } };
    const res = mockResponse();

    Notification.findByIdAndDelete.mockResolvedValue({});

    await controller.deleteNotification(req, res);

    expect(Notification.findByIdAndDelete).toHaveBeenCalledWith("1");
    expect(res.json).toHaveBeenCalledWith({ message: "Notification deleted" });
  });
});
