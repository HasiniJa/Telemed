const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../../src/app"); // Your app.js
const Notification = require("../../src/models/notificationmodel");

let mongoServer;
let notificationId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Notification.deleteMany();
});

describe("Notification Routes Integration Tests", () => {
  test("should send a new notification", async () => {
    const res = await request(app)
      .post("/api/notifications/send")
      .send({
        userId: "USER1",
        message: "Test notification",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.notification).toHaveProperty("_id");
    expect(res.body.notification.userId).toBe("USER1");

    notificationId = res.body.notification._id; // save for later tests
  });

  test("should get all notifications", async () => {
    // First, create one notification
    await Notification.create({ userId: "USER2", message: "Another test" });

    const res = await request(app).get("/api/notifications");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].userId).toBe("USER2");
  });

  test("should mark notification as read", async () => {
    const notification = await Notification.create({
      userId: "USER3",
      message: "Mark me read",
      isRead: false,
    });

    const res = await request(app).put(`/api/notifications/${notification._id}/read`);

    expect(res.statusCode).toBe(200);
    expect(res.body.isRead).toBe(true);
  });

  test("should delete a notification", async () => {
    const notification = await Notification.create({
      userId: "USER4",
      message: "Delete me",
    });

    const res = await request(app).delete(`/api/notifications/${notification._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Notification deleted");
  });
});
