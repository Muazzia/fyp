const Joi = require("joi")

const createProductSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().max(1000).required(),
    price: Joi.number().max(999999999),
    category: Joi.string().max(255).required(),
    skinCondition: Joi.array().items(Joi.string()).min(1).required(),
});

const validateCreateProduct = (body) => createProductSchema.validate(body);

module.exports = { validateCreateProduct }