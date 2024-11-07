const express = require("express");
const { updateDoctor, getAllAppointments, updateStatusOfAppointment, forgotPassword, newPassword, resetPassword } = require("../../controller/doctorpanel");
const { chkDoctorJwt } = require("../../middleware/authentication");
const doctorPanelRoutes = express.Router();



doctorPanelRoutes.put("/", chkDoctorJwt, updateDoctor)

// all appointments
doctorPanelRoutes.get("/appointments", chkDoctorJwt, getAllAppointments)

// can cancel appointment
doctorPanelRoutes.put("/appointments/:id", chkDoctorJwt, updateStatusOfAppointment);

doctorPanelRoutes.post("/auth/forgot-password", forgotPassword);
doctorPanelRoutes.post("/auth/new-password", newPassword)
doctorPanelRoutes.post("/auth/reset-password", chkDoctorJwt, resetPassword)


module.exports = doctorPanelRoutes