const express = require("express");
const { getAllproducts, getAProduct } = require("../../controller/admin/product");
const { checkJWT } = require("../../middleware/authentication");
const nonAdminRoutes = express.Router();

// products
nonAdminRoutes.get("/product", checkJWT, getAllproducts)
nonAdminRoutes.get("/product/:id", checkJWT, getAProduct)


module.exports = nonAdminRoutes 