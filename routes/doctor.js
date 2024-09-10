const express = require("express");
const { createDoctor, doctorLogin } = require("../controller/doctor");
const doctorRouter = express.Router();



// uploadImages({ fieldName: "profilePic", isSinlge: true }) removed because can't send data atm
doctorRouter.post("/", createDoctor)
doctorRouter.post("/login", doctorLogin)

module.exports = doctorRouter