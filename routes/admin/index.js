const express = require("express");
const productRouter = require("./product");
const { adminCheckJWT } = require("../../middleware/authentication");
const adminAuthenticationRouter = require("./authentication");
const adminOrderRouter = require("./orders");
const storyAdvertisement = require("./storyAdvertisment/storyAdvertisment");
const adminRouter = express.Router();

adminRouter.use("/", adminAuthenticationRouter);
adminRouter.use("/orders", adminCheckJWT, adminOrderRouter);
adminRouter.use("/product", adminCheckJWT, productRouter);
adminRouter.use("/story-advertisement", storyAdvertisement);

module.exports = adminRouter;
