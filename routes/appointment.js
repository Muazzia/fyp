const express = require("express");
const appointment = express.Router();

const { createAppointment } = require("../controller/appointment");


appointment.post("/", createAppointment);

// uploadImages({ fieldName: "profilePic", isSinlge: true }) removed because can't send data atm
// appointment.post("/", createDoctor)
// appointment.post("/login", doctorLogin)

module.exports = appointment