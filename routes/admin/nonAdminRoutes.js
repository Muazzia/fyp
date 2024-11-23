const express = require("express");
const {
  getAllproducts,
  getAProduct,
  getFeaturedProducts,
} = require("../../controller/admin/product");
const { checkJWT } = require("../../middleware/authentication");
const {
  getAllStoryAdver,
} = require("../../controller/admin/storyAdvertisment/storyAdvestisement");
const nonAdminRoutes = express.Router();

// products
nonAdminRoutes.get("/product", checkJWT, getAllproducts);
nonAdminRoutes.get("/product/:id", checkJWT, getAProduct);
nonAdminRoutes.get("/featured/product", checkJWT, getFeaturedProducts);
nonAdminRoutes.get("/story-advertisement", checkJWT, getAllStoryAdver);

module.exports = nonAdminRoutes;
