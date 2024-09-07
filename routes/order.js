const express = require("express");
const orderRouter = express.Router();

const { getAllOrdersOfAUser, getAOrderDetail, deleteAOrder, createAnOrder } = require("../controller/order");

orderRouter.get("/", getAllOrdersOfAUser);
orderRouter.get("/:id", getAOrderDetail);

orderRouter.post("/", createAnOrder);
orderRouter.delete("/:id", deleteAOrder);

module.exports = orderRouter;