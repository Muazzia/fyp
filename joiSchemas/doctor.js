const Joi = require("joi")



const createDoctorSchema = Joi.object({
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
        }).required(),
    specialization: Joi.string().max(255).required(),
    availableDays: Joi.array().items(Joi.string().valid("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday")).required(),
    availableTimeSlots: Joi.array().items(Joi.string().pattern(/^([01]\d|2[0-3])\-([01]\d|2[0-3])$/).message({
        'string.pattern.base': 'Values must in 24 hour format'
    })).required()
});


const validateCreateDoctor = (body) => createDoctorSchema.validate(body);


const doctorLoginSchema = Joi.object({
    email: Joi.string().email().max(255).required(),
    password: Joi.string().max(255).required()
})

const validateDoctorLogin = (body) => doctorLoginSchema.validate(body)

const getTimeSlotOfADoctorByDateSchema = Joi.object({
    date: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .messages({
            'string.pattern.base': 'Date must be in the format YYYY-MM-DD',
            'any.required': 'Date is required',
        }),
});

const validateGetTimeSlotOfADoctorByDate = (body) => getTimeSlotOfADoctorByDateSchema.validate(body);

module.exports = {
    validateCreateDoctor,
    validateDoctorLogin,
    validateGetTimeSlotOfADoctorByDate
}