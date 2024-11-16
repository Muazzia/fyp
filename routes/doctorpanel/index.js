const express = require("express");
const {
  updateDoctor,
  getAllAppointments,
  updateStatusOfAppointment,
  forgotPassword,
  newPassword,
  resetPassword,
  uploadProfilePic,
} = require("../../controller/doctorpanel");
const { chkDoctorJwt } = require("../../middleware/authentication");
const { uploadImages } = require("../../middleware/multer");
const doctorPanelRoutes = express.Router();

doctorPanelRoutes.put("/", chkDoctorJwt, updateDoctor);

// all appointments
doctorPanelRoutes.get("/appointments", chkDoctorJwt, getAllAppointments);

// can cancel appointment
doctorPanelRoutes.put(
  "/appointments/:id",
  chkDoctorJwt,
  updateStatusOfAppointment
);

doctorPanelRoutes.post("/auth/forgot-password", forgotPassword);
doctorPanelRoutes.post("/auth/new-password", newPassword);
doctorPanelRoutes.post("/auth/reset-password", chkDoctorJwt, resetPassword);

doctorPanelRoutes.patch(
  "/profile",
  chkDoctorJwt,
  uploadImages({ fieldName: "profilePic", isRequired: true, isSinlge: true }),
  uploadProfilePic
);

module.exports = doctorPanelRoutes;
