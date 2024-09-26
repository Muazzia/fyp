const express = require("express");
const { getAllOrders, getAOrderDetail, updateTheOrder } = require("../../../controller/admin/order");
const adminOrderRouter = express.Router();


adminOrderRouter.get("/", getAllOrders);
adminOrderRouter.get("/:id", getAOrderDetail)

adminOrderRouter.put("/:id", updateTheOrder)


module.exports = adminOrderRouter