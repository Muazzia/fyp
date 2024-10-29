const Joi = require("joi")


const createUserSchema = Joi.object({
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

const validateCreateUser = (body) => createUserSchema.validate(body);


const userLoginSchema = Joi.object({
    email: Joi.string().email().max(255).required(),
    password: Joi.string().max(255).required()
})

const validateUserLogin = (body) => userLoginSchema.validate(body)

const resetPasswordSchema = Joi.object({
    oldPassword: Joi.string().min(8).max(255).required(),
    newPassword: Joi.string().min(8).max(255).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('newPassword')),
})

const validateResetPassword = (body) => resetPasswordSchema.validate(body);

const forgotPasswordSchema = Joi.object({
    email: Joi.string().required().email().max(255),
});

const validateForgotPassword = (body) => forgotPasswordSchema.validate(body);

const newPasswordSchema = Joi.object({
    otp: Joi.string().min(6).max(255).required(),
    newPassword: Joi.string().min(8).max(255).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('newPassword')),
});

const validateNewPassword = (body) => newPasswordSchema.validate(body)

module.exports = {
    validateCreateUser,
    validateUserLogin,
    validateResetPassword,
    validateForgotPassword,
    validateNewPassword
}