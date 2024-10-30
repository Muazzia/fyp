const Joi = require("joi")

const createProductSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().max(1000).required(),
    price: Joi.number().max(999999999).required(),
    category: Joi.string().max(255).required(),
    skinCondition: Joi.array().items(Joi.string().max(255)).min(1).required(),
    stock: Joi.number().max(9999999).required()
});

const validateCreateProduct = (body) => createProductSchema.validate(body);


const updateProductSchema = Joi.object({
    name: Joi.string().min(3).max(255),
    description: Joi.string().max(1000),
    price: Joi.number().max(999999999),
    category: Joi.string().max(255),
    skinCondition: Joi.array().items(Joi.string()).min(1),
    stock: Joi.number().max(9999999)
});

const validateUpdateProduct = (body) => updateProductSchema.validate(body)


module.exports = { validateCreateProduct, validateUpdateProduct }