const express = require("express");
const { createUser, login } = require("../controller/user");
const userRouter = express.Router();



userRouter.post("/", createUser)
userRouter.post("/login", login)

module.exports = userRouter