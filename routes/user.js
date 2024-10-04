const express = require("express");
const { createUser, login, resetPassword } = require("../controller/user");
const { checkJWT } = require("../middleware/authentication");
const userRouter = express.Router();



userRouter.post("/", createUser)
userRouter.post("/login", login)

userRouter.post("/reset-password", checkJWT, resetPassword)

module.exports = userRouter