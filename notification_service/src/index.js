const express = require("express");
const connectDB = require("./utils/db");
const routes = require("./routes/notification_routes");

require("dotenv").config();
connectDB();

const app = express();
app.use(express.json());

app.use("/notifications", routes);

app.listen(process.env.PORT, () =>
  console.log(`Notification Service running on port ${process.env.PORT}`)
);
