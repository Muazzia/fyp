const express = require("express");
const { adminLogin, createAdmin } = require("../../controller/admin/authentication");

const adminAuthenticationRouter = express.Router();



adminAuthenticationRouter.post("/signup", createAdmin);
adminAuthenticationRouter.post("/login", adminLogin)

module.exports = adminAuthenticationRouter