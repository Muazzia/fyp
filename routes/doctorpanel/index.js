const express = require("express");
const { updateDoctor } = require("../../controller/doctorpanel");
const doctorPanelRoutes = express.Router();



doctorPanelRoutes.put("/", updateDoctor)


module.exports = doctorPanelRoutes