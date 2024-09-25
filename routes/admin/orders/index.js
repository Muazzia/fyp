const express = require("express");
const { getAllOrders, getAOrderDetail } = require("../../../controller/admin/order");
const adminOrderRouter = express.Router();


adminOrderRouter.get("/", getAllOrders);
adminOrderRouter.get("/:id", getAOrderDetail)


module.exports = adminOrderRouter