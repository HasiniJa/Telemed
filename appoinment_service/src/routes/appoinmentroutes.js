const express = require("express");
const router = express.Router();
const controller = require("../controllers/appoinmentcontroller");

router.post("/book", controller.createAppointment); // <-- change
router.get("/", controller.getAllAppointments); // <-- change
router.get("/:id", controller.getAppointmentById); // <-- optional add
router.put("/:id", controller.updateAppointment);
router.delete("/:id", controller.deleteAppointment);

module.exports = router;
