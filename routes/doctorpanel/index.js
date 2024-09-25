const express = require("express");
const { updateDoctor, getAllAppointments, updateStatusOfAppointment } = require("../../controller/doctorpanel");
const doctorPanelRoutes = express.Router();



doctorPanelRoutes.put("/", updateDoctor)

// all appointments
doctorPanelRoutes.get("/appointments", getAllAppointments)

// can cancel appointment
doctorPanelRoutes.put("/appointments/:id", updateStatusOfAppointment);


module.exports = doctorPanelRoutes