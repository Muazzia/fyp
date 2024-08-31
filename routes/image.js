const express = require("express");
const { uploadImages } = require("../middleware/multer");
const { uploadScanImage } = require("../controller/image");
const imageRouter = express.Router();


imageRouter.post("/", uploadImages({ fieldName: "image", isSinlge: true }), uploadScanImage)
// imageRouter.post("/", uploadImages({ fieldName: "profilePic", isSinlge: true }), createUser)
// imageRouter.post("/login", login)

module.exports = imageRouter