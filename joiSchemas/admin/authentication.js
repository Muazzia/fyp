const Joi = require("joi")


const createAdminSchema = Joi.object({
    firstName: Joi.string().required().max(255),
    lastName: Joi.string().required().max(255),
    email: Joi.string().required().email().max(255),
    password: Joi.string().min(8).max(255).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
    phoneNumber: Joi.string()
        .pattern(/^[0-9]{1,11}$/)
        .min(10)
        .max(11)
        .messages({
            'string.pattern.base': 'phoneNumber must be a numeric string with a maximum length of 11',
            'string.max': 'phoneNumber must have a maximum length of 11',
        }),
})

const validateCreateAdmin = (body) => createAdminSchema.validate(body);


const adminLoginSchema = Joi.object({
    email: Joi.string().email().max(255).required(),
    password: Joi.string().max(255).required()
})

const validateAdminLogin = (body) => adminLoginSchema.validate(body)


module.exports = {
    validateCreateAdmin,
    validateAdminLogin
}