const Joi = require("joi")


const createAppointmentSchema = Joi.object({
    appointmentDate: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .messages({
            'string.pattern.base': 'Date must be in the format YYYY-MM-DD',
            'any.required': 'Date is required',
        }),
    timeSlot: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/) // Matches HH:MM format
        .required()
        .messages({
            'string.base': 'timeSlot must be a string.',
            'string.pattern.base': 'timeSlot must be in HH:MM format.',
            'any.required': 'timeSlot is required.'
        }),
    doctorId: Joi.string().max(255).required(),
});

const validateCreateAppointment = (body) => createAppointmentSchema.validate(body);

module.exports = { validateCreateAppointment };