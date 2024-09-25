const { validateUpdateDoctor, validateUpdateAppointmentSchema } = require("../../joiSchemas/doctorpanel");
const Appointment = require("../../models/appointment");
const Doctor = require("../../models/doctor");
const { resWrapper, isValidUuid, convertTimeRangesToSlots } = require("../../utils");

const includeObj = {
    attributes: {
        exclude: ["password"]
    }
}


const updateDoctor = async (req, res) => {
    const id = req.userId;

    const { error, value } = validateUpdateDoctor(req.body)
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message))

    if (!isValidUuid(id, res)) return;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) return res.status(400).send(resWrapper("Doctor Not Found", 404, null, "Id Is Not Valid"))

    if (value.availableTimeSlots) {
        const timeSlots = convertTimeRangesToSlots(value.availableTimeSlots);

        await doctor.update({ ...value, availableTimeSlots: timeSlots });
    } else {
        await doctor.update({ ...value });
    }

    const temp = await Doctor.findByPk(doctor.id, {
        ...includeObj
    });

    return res.status(200).send(resWrapper("Doctor Updated", 200, temp));
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


const updateStatusOfAppointment = async (req, res) => {
    const appId = req.params.id;
    const doctorId = req.userId;

    if (!isValidUuid(appId, res)) return;
    if (!isValidUuid(doctorId, res)) return;

    const { error, value } = validateUpdateAppointmentSchema(req.body);
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message))

    // const combinePromise=await Promise.all([])
    const appointment = await Appointment.findOne({
        where: {
            id: appId,
            doctorId
        }
    });
    if (!appointment) return res.status(404).send(resWrapper("Appointment Not Found", 404, null, "Id is not Valid"))

    if (appointment.status === "cancelled") return res.status(400).send(resWrapper("Can't Update Status Once Appointment is Cancelled", 400, null, "Can't Update Staus Once Appointment Is Cancelled"))

    await appointment.update({ ...value });
    return res.status(200).send(resWrapper("Appointment Updated", 200, appointment))
}



module.exports = {
    updateDoctor,
    getAllAppointments,
    updateStatusOfAppointment
};