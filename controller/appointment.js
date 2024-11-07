const { validateCreateAppointment } = require("../joiSchemas/appointment");
const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");
const User = require("../models/user");
const { resWrapper, isValidUuid } = require("../utils")

const createAppointment = async (req, res) => {
    const { error, value: { appointmentDate, timeSlot, doctorId } } = validateCreateAppointment(req.body)
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message));

    const userId = req.userId;

    if (!isValidUuid(userId, res)) return;
    if (!isValidUuid(doctorId, res)) return;

    const user = await User.findByPk(userId);
    const doctor = await Doctor.findByPk(doctorId);

    if (!user) return res.status(404).send(resWrapper("User Id is not Valid", 404, null, "User Id is not Valid"))
    if (!doctor) return res.status(404).send(resWrapper("Doctor Id is not Valid", 404, null, "Doctor Id is not Valid"))

    const appointDate = new Date(appointmentDate)


    const chkAppointment = await Appointment.findOne({
        where: {
            doctorId,
            appointmentDate,
            timeSlot
        }
    });

    if (chkAppointment) return res.status(400).send(resWrapper("Time Slot Is Not Available", 400, null, "Time Slot Is Not Available"))


    // /////////////////

    const todayDate = new Date();
    const givenDate = appointDate;

    todayDate.setHours(0, 0, 0, 0);
    givenDate.setHours(0, 0, 0, 0);

    if (givenDate < todayDate) return res.status(400).send(resWrapper("Date must be of today's are forward", 400, null, "Date Error"))

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = daysOfWeek[appointDate.getDay()].toLowerCase();

    const chkDocAvail = doctor.availableDays.includes(day);

    if (!chkDocAvail) return res.status(400).send(resWrapper("Appointment Date is Invalid", 400, null, "Appointment Date is Invalid"));


    const chkTimeSlotAvail = doctor.availableTimeSlots.includes(timeSlot);
    if (!chkTimeSlotAvail) return res.status(400).send(resWrapper("Invalid Time Slot", 400, null, "Invalid Time Slot"))

    const appointment = await Appointment.create({
        userId,
        doctorId,
        timeSlot,
        appointmentDate
    });

    const temp = await Appointment.findByPk(appointment.id);

    return res.status(200).send(resWrapper("Appointment Created Successfully", 200, temp));
};

const deleteAppointment = async (req, res) => {
    const appointmentId = req.params.id;
    const userId = req.userId;

    const appointment = await Appointment.findOne({
        where: {
            userId,
            id: appointmentId
        }
    });

    if (!appointment) return res.status(404).send(resWrapper("Appointment not found", 404, null, "Appoint does not exist"))



    if (appointment.status !== "scheduled") return res.status(400).send(resWrapper("Appointment can't be cancelled", 400, null, "Appointment cancell error"));


    await appointment.destroy();
    return res.status(200).send(resWrapper("Appointment Cancelled", 200, appointment));
}

const getAllAppointments = async (req, res) => {
    const userId = req.userId;

    const appointments = await Appointment.findAll({
        where: {
            userId
        },

        include: [{ model: Doctor, attributes: { exclude: ["password", "availableTimeSlots", "availableDays", ""] }, as: "doctor" }]
    });

    return res.status(200).send(resWrapper("All Appointments received", 200, appointments));
}

module.exports = { createAppointment, deleteAppointment, getAllAppointments }