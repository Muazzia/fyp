const express = require("express");
const { createDoctor, doctorLogin, getAllDoctors, getASingleDoctor, getTimeSlotOfADoctorByDate } = require("../controller/doctor");
const { checkJWT } = require("../middleware/authentication");
const doctorRouter = express.Router();



// uploadImages({ fieldName: "profilePic", isSinlge: true }) removed because can't send data atm
doctorRouter.post("/", createDoctor)
doctorRouter.post("/login", doctorLogin)

doctorRouter.get("/", checkJWT, getAllDoctors)
doctorRouter.get("/:id", checkJWT, getASingleDoctor)

doctorRouter.get("/time/:id/:date", checkJWT, getTimeSlotOfADoctorByDate)




module.exports = doctorRouter