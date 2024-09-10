const bcrypt = require("bcrypt")
const { resWrapper, generateJwtToken } = require("../utils");
const { validateCreateDoctor, validateDoctorLogin } = require("../joiSchemas/doctor");
const Doctor = require("../models/doctor");

const includeObj = {
    attributes: {
        exclude: ["password"]
    }
}


const convertTimeRangesToSlots = (timeRanges, sessionDurationMinutes) => {
    const timeSlots = [];

    for (let timeRange of timeRanges) {
        const [start, end] = timeRange.split("-");

        for (let hour = start; hour < end; hour++) {
            timeSlots.push(`${String(hour).padStart(2, '0')}:00`);
            timeSlots.push(`${String(hour).padStart(2, '0')}:30`);
        }
    }

    return timeSlots;
}



const createDoctor = async (req, res) => {
    const { error, value: { firstName, lastName, email, password, specialization, phoneNumber, availableDays, availableTimeSlots } } = validateCreateDoctor(req.body)
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

    const doctor = await Doctor.create({ firstName, lastName, email, password: hashedPassword, phoneNumber, availableDays, availableTimeSlots: timeSlots, specialization });

    const temp = await Doctor.findByPk(doctor.id, {
        ...includeObj
    });

    return res.status(201).send(resWrapper("Doctor Created", 201, temp))



    // const { error, value: { firstName, lastName, email, password, phoneNumber } } = validateCreateUser(req.body);
    // if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message));

    // const oldUser = await User.findOne({
    //     where: {
    //         email
    //     }
    // });
    // if (oldUser) return res.status(400).send(resWrapper("User With Email ALready Exist", 400, null, "Email With User Already Exist"));





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

    const passChk = await bcrypt.compare(password, user.password);
    if (!passChk) return res.status(400).send(resWrapper("Email or Password Incorrect", 400, null, "Authorization Error"))

    const token = generateJwtToken(user);

    const { password: _, ...doctorWithoutPassword } = doctor.toJSON();
    return res.status(200).send(resWrapper("Logged In", 200, { doctor: doctorWithoutPassword, token }));
}

module.exports = {
    createDoctor,
    doctorLogin
}