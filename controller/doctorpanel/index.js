const { validateUpdateDoctor } = require("../../joiSchemas/doctorpanel");
const Appointment = require("../../models/appointment");
const Doctor = require("../../models/doctor");
const { resWrapper, isValidUuid, convertTimeRangesToSlots } = require("../../utils");
const bcrypt = require("bcrypt")



const updateDoctor = async (req, res) => {
    const id = req.doctorId;

    const { error, value } = validateUpdateDoctor(req.body)
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message))

    if (!isValidUuid(id, res)) return;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) return res.status(400).send(resWrapper("Doctor Not Found", 404, null, "Id Is Not Valid"))

    if (value.availableTimeSlots) {
        const timeSlots = convertTimeRangesToSlots(value.availableTimeSlots);

        await Doctor.update({ ...value, availableTimeSlots: timeSlots });
    } else {
        await Doctor.update({ ...value });
    }

    const temp = await Doctor.findByPk(doctor.id, {
        ...includeObj
    });

    return res.status(200).send(resWrapper("Product Updated", 200, temp));
}

const getAllAppointments = async (req, res) => {
    const doctorId = req.userId;

    const appointment = await Appointment.findAll({
        where: {
            doctorId
        }
    });

    return res.status(200).send(resWrapper("All Appointments Retreived", 200, appointment));
}




module.exports = {
    updateDoctor,
    getAllAppointments
};