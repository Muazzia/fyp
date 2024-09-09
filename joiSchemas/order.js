const Joi = require("joi");

const createOrderSchema = Joi.object({
    productsIds: Joi.array().items(
        Joi.object({
            id: Joi.string().uuid().required(),
            count: Joi.number().integer().min(1).required()
        })
    ).required(),
    shippingAddress: Joi.string().max(255).required()
});

const validateCreateOrder = (body) => createOrderSchema.validate(body)

module.exports = {
    validateCreateOrder
}