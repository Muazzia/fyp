const express = require("express");
const productRouter = require("./product");
const { adminCheckJWT } = require("../../middleware/authentication");
const adminAuthenticationRouter = require("./authentication");
const adminRouter = express.Router();


adminRouter.use("/", adminAuthenticationRouter)
adminRouter.use("/product", adminCheckJWT, productRouter)


module.exports = adminRouter 