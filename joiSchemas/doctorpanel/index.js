const Joi = require("joi");

const updateDoctorSchema = Joi.object({
  firstName: Joi.string().max(255),
  lastName: Joi.string().max(255),
  phoneNumber: Joi.string()
    .pattern(/^[0-9]{1,11}$/)
    .min(10)
    .max(11)
    .messages({
      "string.pattern.base":
        "phoneNumber must be a numeric string with a maximum length of 11",
      "string.max": "phoneNumber must have a maximum length of 11",
    }),
  specialization: Joi.string().max(255),
  availableDays: Joi.array().items(
    Joi.string().valid(
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday"
    )
  ),
  availableTimeSlots: Joi.array().items(
    Joi.string()
      .pattern(/^([01]\d|2[0-3])\-([01]\d|2[0-3])$/)
      .message({
        "string.pattern.base": "Values must in 24 hour format",
      })
  ),
  clinicAddress: Joi.string().max(255),
  fees: Joi.string().max(255),
  services: Joi.array().items(Joi.string().max(255)),
});

const validateUpdateDoctor = (body) => updateDoctorSchema.validate(body);

const updateAppointmentSchema = Joi.object({
  status: Joi.string().valid("cancelled", "completed").required(),
  reason: Joi.string().optional().max(255),
});

const validateUpdateAppointmentSchema = (body) =>
  updateAppointmentSchema.validate(body);

module.exports = {
  validateUpdateDoctor,
  validateUpdateAppointmentSchema,
};
