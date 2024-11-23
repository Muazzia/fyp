const express = require("express");
const { uploadMultipleFields } = require("../../../middleware/multer");
const {
  createStoryAdver,
} = require("../../../controller/admin/storyAdvertisment/storyAdvestisement");
const storyAdvertisement = express.Router();

// storyAdvertisement.get("/", getAllOrdersOfAUser);
// storyAdvertisement.get("/:id", getAOrderDetail);

storyAdvertisement.post(
  "/",
  uploadMultipleFields({
    fields: [
      { name: "companyImage", maxCount: 1 },
      { name: "storyImage", maxCount: 1 },
    ],
  }),
  createStoryAdver
);
// storyAdvertisement.delete("/:id", deleteAOrder);

module.exports = storyAdvertisement;
