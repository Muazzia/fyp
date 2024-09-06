const express = require("express");
const { createAProduct, deleteAProduct } = require("../../controller/admin/product");
const productRouter = express.Router();


productRouter.post("/", createAProduct);
productRouter.put("/:id",);
productRouter.delete("/:id", deleteAProduct)



module.exports = productRouter