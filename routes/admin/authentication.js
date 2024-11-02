const express = require("express");
const { adminLogin, createAdmin, forgotPassword, newPassword } = require("../../controller/admin/authentication");
const { checkJWT, adminCheckJWT } = require("../../middleware/authentication");
const { resetPassword } = require("../../controller/user");

const adminAuthenticationRouter = express.Router();



adminAuthenticationRouter.post("/signup", createAdmin);
adminAuthenticationRouter.post("/login", adminLogin)

adminAuthenticationRouter.post("/forgot-password", forgotPassword);
adminAuthenticationRouter.post("/new-password", newPassword)
adminAuthenticationRouter.post("/reset-password", adminCheckJWT, resetPassword)

module.exports = adminAuthenticationRouter