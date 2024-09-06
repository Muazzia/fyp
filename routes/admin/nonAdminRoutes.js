const express = require("express");
const { getAllproducts, getAProduct } = require("../../controller/admin/product");
const nonAdminRoutes = express.Router();

// products
nonAdminRoutes.get("/product", getAllproducts)
nonAdminRoutes.get("/product/:id", getAProduct)


module.exports = nonAdminRoutes 