const express = require("express");
const productRouter = require("./product");
const adminRouter = express.Router();


adminRouter.use("/product", productRouter)


module.exports = adminRouter 