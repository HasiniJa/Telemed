const express = require("express");
const router = express.Router();
const controller = require("../controllers/appointmentcontroller");

router.post("/book", controller.bookAppointment);
router.get("/", controller.getAppointments);
router.put("/:id", controller.updateAppointment);
router.delete("/:id", controller.deleteAppointment);

module.exports = router;
