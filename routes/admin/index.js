const express = require("express");
const productRouter = require("./product");
const { adminCheckJWT } = require("../../middleware/authentication");
const adminAuthenticationRouter = require("./authentication");
const adminOrderRouter = require("./orders");
const adminRouter = express.Router();


adminRouter.use("/", adminAuthenticationRouter)
adminRouter.use("/orders", adminCheckJWT, adminOrderRouter)
adminRouter.use("/product", adminCheckJWT, productRouter)


module.exports = adminRouter 