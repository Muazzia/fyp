const express = require("express");
const { createAProduct, deleteAProduct, updateAProduct, getAllproducts } = require("../../controller/admin/product");
const { uploadImages } = require("../../middleware/multer");
const productRouter = express.Router();


productRouter.post("/", uploadImages({ fieldName: "image", isSinlge: true }), createAProduct);
productRouter.put("/:id", uploadImages({ fieldName: "image", isRequired: false, isSinlge: true }), updateAProduct);
productRouter.delete("/:id", deleteAProduct)
productRouter.get("/", getAllproducts)



module.exports = productRouter