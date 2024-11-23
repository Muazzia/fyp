const Joi = require("joi");

const createStoryAdvertisement = Joi.object({
  companyName: Joi.string().max(255).required(),
  isViewd: Joi.boolean(),
});

const validateCreateStoryAdvestisement = (body) =>
  createStoryAdvertisement.validate(body);

module.exports = {
  validateCreateStoryAdvestisement,
};
