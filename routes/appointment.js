const express = require("express");
const appointment = express.Router();

const { createAppointment, deleteAppointment, getAllAppointments } = require("../controller/appointment");


appointment.post("/", createAppointment);
appointment.delete("/:id", deleteAppointment);
appointment.get("/", getAllAppointments)

// uploadImages({ fieldName: "profilePic", isSinlge: true }) removed because can't send data atm
// appointment.post("/", createDoctor)
// appointment.post("/login", doctorLogin)

module.exports = appointment