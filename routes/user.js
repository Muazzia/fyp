const express = require("express");
const { createUser, login, resetPassword, newPassword, forgotPassword } = require("../controller/user");
const { checkJWT } = require("../middleware/authentication");
const userRouter = express.Router();



userRouter.post("/", createUser)
userRouter.post("/login", login)

userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/new-password", newPassword)
userRouter.post("/reset-password", checkJWT, resetPassword)


module.exports = userRouter