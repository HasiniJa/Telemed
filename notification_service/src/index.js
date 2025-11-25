const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./utils/db");
const notificationRoutes = require("./routes/notificationroutes");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Root route to verify server is running
app.get("/", (req, res) => {
  res.send("Notification Service is running!");
});

// Mount notification routes
app.use("/notifications", notificationRoutes);

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});
