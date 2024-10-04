const bcrypt = require("bcrypt")
const { Op } = require("sequelize")
const { resWrapper, isValidUuid, convertTimeRangesToSlots, generateDoctorJwtToken } = require("../utils");
const { validateCreateDoctor, validateDoctorLogin, validateGetTimeSlotOfADoctorByDate } = require("../joiSchemas/doctor");
const Doctor = require("../models/doctor");
const Appointment = require("../models/appointment");


const includeObj = {
    attributes: {
        exclude: ["password", "availableTimeSlots", "availableDays"]
    }
}





const createDoctor = async (req, res) => {
    const { error, value: { firstName, lastName, email, password, specialization, phoneNumber, availableDays, availableTimeSlots, education, services } } = validateCreateDoctor(req.body)
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message));

    const oldDoctor = await Doctor.findOne({
        where: {
            email
        }
    });
    if (oldDoctor) return res.status(400).send(resWrapper("Doctor With Email ALready Exist", 400, null, "Email With Doctor Already Exist"));

    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) return res.status(400).send(resWrapper("Error While Saving. Trying Again", 400, null, "Please Try Again Later"))



    const timeSlots = convertTimeRangesToSlots(availableTimeSlots, 30);

    const doctor = await Doctor.create({ firstName, lastName, email, password: hashedPassword, phoneNumber, availableDays, availableTimeSlots: timeSlots, specialization, education, services });

    const temp = await Doctor.findByPk(doctor.id, {
        ...includeObj
    });

    return res.status(201).send(resWrapper("Doctor Created", 201, temp))
}

const doctorLogin = async (req, res) => {
    const { error, value: { email, password } } = validateDoctorLogin(req.body)
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message));

    const doctor = await Doctor.findOne({
        where: {
            email
        },
    });


    if (!doctor) return res.status(400).send(resWrapper("Email or Password Incorrect", 400, null, "Authorization Error"));

    const passChk = await bcrypt.compare(password, doctor.password);
    if (!passChk) return res.status(400).send(resWrapper("Email or Password Incorrect", 400, null, "Authorization Error"))

    const token = generateDoctorJwtToken(doctor);

    const { password: _, ...doctorWithoutPassword } = doctor.toJSON();
    return res.status(200).send(resWrapper("Logged In", 200, { doctor: doctorWithoutPassword, token }));
}

const getAllDoctors = async (req, res) => {
    const { name, specialization } = req.query;

    let doctor;
    if (Object.keys(req.query).length) {
        let whereClause = {};

        if (name) {
            whereClause[Op.or] = [
                { firstName: { [Op.iLike]: `%${name}%` } },
                { lastName: { [Op.iLike]: `%${name}%` } }
            ];
        }

        // Filter by specialization
        if (specialization) {
            whereClause.specialization = { [Op.contains]: [`${specialization}`] };
        }


        doctor = await Doctor.findAll({
            where: whereClause,
            ...includeObj
        });

    } else {
        doctor = await Doctor.findAll({
            ...includeObj,
        });
    }

    return res.status(200).send(resWrapper("All Doctors Fetched", 200, doctor))
}

const getASingleDoctor = async (req, res) => {
    const id = req.params.id;
    if (!isValidUuid(id, res)) return;

    const doctor = await Doctor.findByPk(id, {
        ...includeObj
    });

    if (!doctor) return res.status(400).send(resWrapper("Id is not Valid", 400, null, "Doctor not Found"));

    return res.status(200).send(resWrapper("Doctor Reterived", 200, doctor));
}

const getTimeSlotOfADoctorByDate = async (req, res) => {
    const id = req.params.id;
    if (!isValidUuid(id, res)) return;

    const paramsDate = req.params.date;

    const { error, value: { date } } = validateGetTimeSlotOfADoctorByDate({ date: paramsDate })
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message))

    const doctor = await Doctor.findByPk(id, {
        attributes: {
            exclude: ["password"]
        }
    });
    if (!doctor) return res.status(400).send(resWrapper("Id is not Valid", 400, null, "Doctor not Found"));

    const docDate = new Date(date);


    const todayDate = new Date();
    const givenDate = docDate;
    todayDate.setHours(0, 0, 0, 0);
    givenDate.setHours(0, 0, 0, 0);

    if (givenDate < todayDate) return res.status(400).send(resWrapper("Date must be of today's are forward", 400, null, "Date Error"))

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = daysOfWeek[docDate.getDay()].toLowerCase();

    const chkDocAvail = doctor.availableDays.includes(day);

    if (!chkDocAvail) return res.status(200).send(resWrapper("No Time Slot Available", 200, []));

    const allAppointmentsOnThisDay = await Appointment.findAll({
        where: {
            doctorId: id,
            appointmentDate: date
        },
        attributes: ["timeSlot"]
    })

    if (allAppointmentsOnThisDay.length === 0) return res.status(200).send(resWrapper("Reterived All Time Slots", 200, doctor.availableTimeSlots));


    const bookedTimeSlots = allAppointmentsOnThisDay.map(appointment => appointment.timeSlot);
    const remainingTimeSlots = doctor.availableTimeSlots.filter(timeSlot => !bookedTimeSlots.includes(timeSlot));


    return res.status(200).send(resWrapper("Reterived All Time Slots", 200, remainingTimeSlots))
}

module.exports = {
    createDoctor,
    doctorLogin,
    getAllDoctors,
    getASingleDoctor,
    getTimeSlotOfADoctorByDate,
}