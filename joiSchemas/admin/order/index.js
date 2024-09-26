const Joi = require("joi")

const updateTheOrderSchema = Joi.object({
    status: Joi.string().valid('completed', 'shipped', 'cancelled'),
    paymentStatus: Joi.string().valid('paid', 'unpaid', 'refunded')
});

const validateUpdateTheOrder = (body) => updateTheOrderSchema.validate(body);


module.exports = {
    validateUpdateTheOrder
}