const {
  validateCreateStoryAdvestisement,
} = require("../../../joiSchemas/storyAdvertisement");
const StoryAdvertisement = require("../../../models/storyAdvertisement");
const { resWrapper } = require("../../../utils");
const { uploadSingleToCloudinary } = require("../../../utils/cloudinary");

const createStoryAdver = async (req, res) => {
  const {
    error,
    value: { companyName },
  } = validateCreateStoryAdvestisement(req.body);
  if (error)
    return res
      .status(400)
      .send(resWrapper(error.message, 400, null, error.message));

  if (!req.files || Object.keys(req.files).length === 0) {
    return res
      .status(400)
      .send(resWrapper("No images provided", 400, null, "No files uploaded"));
  }

  //

  const uploadedImages = {};

  try {
    // Iterate through each field (e.g., "frontImage", "sideImage")
    for (const key of Object.keys(req.files)) {
      const fileArray = req.files[key]; // Multer stores files for each field as an array
      const results = [];

      for (const file of fileArray) {
        const {
          isSuccess,
          data,
          error: cloudError,
        } = await uploadSingleToCloudinary(file, "storyAdvertisment");

        if (!isSuccess) {
          return res
            .status(400)
            .send(
              resWrapper(
                `Failed to upload image for key ${key}`,
                400,
                null,
                cloudError
              )
            );
        }

        results.push(data); // Store the Cloudinary URL or public ID
      }

      uploadedImages[key] = results; // Map results to the field key
    }
    // Store each result in the database
    const storyAdv = await StoryAdvertisement.create({
      companyName,
      storyImage: uploadedImages.storyImage[0],
      companyImage: uploadedImages.companyImage[0],
    });

    return res
      .status(201)
      .send(resWrapper("Story Advertisment", 201, storyAdv));
  } catch (err) {
    console.error("Error during image processing:", err);
    return res
      .status(500)
      .send(
        resWrapper("Internal server error", 500, null, "Something went wrong")
      );
  }
  //
};

const getAllStoryAdver = async (req, res) => {
  try {
    const getAll = await StoryAdvertisement.findAll();
    return res.status(200).send(resWrapper("Story Advertisment", 200, getAll));
  } catch (err) {
    return res
      .status(500)
      .send(
        resWrapper("Internal server error", 500, null, "Something went wrong")
      );
  }
};

module.exports = {
  createStoryAdver,
  getAllStoryAdver,
};
