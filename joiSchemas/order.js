const Joi = require("joi");

const createOrderSchema = Joi.object({
    productsIds: Joi.array()
        .items(Joi.string().min(1).required())  // Each item in the array must be a non-empty string
        .required(),
    shippingAddress: Joi.string().max(255).required()
});

const validateCreateOrder = (body) => createOrderSchema.validate(body)

module.exports = {
    validateCreateOrder
}