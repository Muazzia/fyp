const {
  validateUpdateDoctor,
  validateUpdateAppointmentSchema,
} = require("../../joiSchemas/doctorpanel");
const {
  validateForgotPassword,
  validateNewPassword,
  validateResetPassword,
} = require("../../joiSchemas/user");
const Appointment = require("../../models/appointment");
const Doctor = require("../../models/doctor");
const DoctorPasswordResetOtp = require("../../models/doctorPasswordResetOtp");
const User = require("../../models/user");
const {
  resWrapper,
  isValidUuid,
  convertTimeRangesToSlots,
} = require("../../utils");
const { uploadSingleToCloudinary } = require("../../utils/cloudinary");
const { sendEmail } = require("../../utils/nodemailer");
const bcrypt = require("bcrypt");

const includeObj = {
  attributes: {
    exclude: ["password"],
  },
};

const updateDoctor = async (req, res) => {
  const id = req.userId;

  const { error, value } = validateUpdateDoctor(req.body);
  if (error)
    return res
      .status(400)
      .send(resWrapper(error.message, 400, null, error.message));

  if (!isValidUuid(id, res)) return;

  const doctor = await Doctor.findByPk(id);
  if (!doctor)
    return res
      .status(400)
      .send(resWrapper("Doctor Not Found", 404, null, "Id Is Not Valid"));

  if (value.availableTimeSlots) {
    const timeSlots = convertTimeRangesToSlots(value.availableTimeSlots);

    await doctor.update({ ...value, availableTimeSlots: timeSlots });
  } else {
    await doctor.update({ ...value });
  }

  const temp = await Doctor.findByPk(doctor.id, {
    ...includeObj,
  });

  return res.status(200).send(resWrapper("Doctor Updated", 200, temp));
};

const getAllAppointments = async (req, res) => {
  const doctorId = req.userId;

  const appointment = await Appointment.findAll({
    where: {
      doctorId,
    },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "firstName", "lastName", "email", "profilePic"],
      },
    ],
  });

  return res
    .status(200)
    .send(resWrapper("All Appointments Retreived", 200, appointment));
};

const updateStatusOfAppointment = async (req, res) => {
  const appId = req.params.id;
  const doctorId = req.userId;

  if (!isValidUuid(appId, res)) return;
  if (!isValidUuid(doctorId, res)) return;

  const { error, value } = validateUpdateAppointmentSchema(req.body);
  if (error)
    return res
      .status(400)
      .send(resWrapper(error.message, 400, null, error.message));

  // const combinePromise=await Promise.all([])
  const appointment = await Appointment.findOne({
    where: {
      id: appId,
      doctorId,
    },
  });
  if (!appointment)
    return res
      .status(404)
      .send(resWrapper("Appointment Not Found", 404, null, "Id is not Valid"));

  if (appointment.status === "cancelled")
    return res
      .status(400)
      .send(
        resWrapper(
          "Can't Update Status Once Appointment is Cancelled",
          400,
          null,
          "Can't Update Staus Once Appointment Is Cancelled"
        )
      );

  const user = await User.findByPk(appointment.userId);
  if (!user)
    return res
      .status(404)
      .send(resWrapper("User Not Found", 404, null, "User"));

  await sendEmail({
    to: user.email,
    text:
      "Your Appointment has been cancelled due to:" + value?.reason ||
      "Availability Issue of the doctor",
  });

  await appointment.update({ status: value.status });
  return res
    .status(200)
    .send(resWrapper("Appointment Updated", 200, appointment));
};

const resetPassword = async (req, res) => {
  const doctorId = req.userId;

  const {
    error,
    value: { oldPassword, newPassword },
  } = validateResetPassword(req.body);
  if (error)
    return res
      .status(400)
      .send(resWrapper(error.message, 400, null, error.message));

  const doctor = await Doctor.findByPk(doctorId);
  if (!doctor)
    return res
      .status(400)
      .send(
        resWrapper("Doctor Not Found", 400, null, "Doctor Id is not Valid")
      );

  const passChk = await bcrypt.compare(oldPassword, doctor.password);
  if (!passChk)
    return res
      .status(400)
      .send(
        resWrapper("Old Password Incorrect", 400, null, "Authorization Error")
      );

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  if (!hashedPassword)
    return res
      .status(400)
      .send(
        resWrapper(
          "Error While Saving. Trying Again",
          400,
          null,
          "Please Try Again Later"
        )
      );

  await doctor.update({ password: hashedPassword });

  const temp = await Doctor.findByPk(doctor.id, {
    ...includeObj,
  });

  return res.status(201).send(resWrapper("Password Updated", 201, temp));
};

const forgotPassword = async (req, res) => {
  const {
    error,
    value: { email },
  } = validateForgotPassword(req.body);
  if (error)
    return res
      .status(400)
      .send(resWrapper(error.message, 400, null, error.message));

  const doctor = await Doctor.findOne({ where: { email } });
  if (!doctor)
    return res
      .status(404)
      .json(
        resWrapper("Doctor not found", 400, null, "Doctor email is not Valid")
      );

  // Step 2: Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
  const expiration = Date.now() + 300000; // 5 minutes expiration

  // Step 3: Save OTP to the database (overwrite any existing OTP for this user)
  await DoctorPasswordResetOtp.destroy({ where: { doctorId: doctor.id } }); // Optional: clean up old OTPs
  await DoctorPasswordResetOtp.create({
    doctorId: doctor.id,
    otp,
    expiration,
  });

  // Step 4: Send OTP via email
  const response = await sendEmail({
    to: doctor.email,
    subject: "Password Reset OTP.",
    text: `Your OTP for password reset is: ${otp}. It is valid for 5 minutes.`,
  });

  if (response.error)
    return res
      .status(400)
      .send(resWrapper(response.error, 400, null, response.error));

  return res
    .status(200)
    .send(resWrapper("Password Reset Email Sent", 200, "Email Sent"));
};

const newPassword = async (req, res) => {
  const {
    error,
    value: { otp, newPassword },
  } = validateNewPassword(req.body);
  if (error)
    return res
      .status(400)
      .send(resWrapper(error.message, 400, null, error.message));

  // Step 1: Find OTP in the database
  const resetEntry = await DoctorPasswordResetOtp.findOne({
    where: {
      otp: otp.trim(),
    },
  });
  if (!resetEntry)
    return res
      .status(400)
      .json(
        resWrapper(
          "Invalid or expired OTP",
          400,
          null,
          "Invalid or expired OTP"
        )
      );

  // Step 2: Check if OTP is expired
  if (resetEntry.expiration < Date.now()) {
    return res
      .status(400)
      .json(resWrapper("OTP has expired", 400, null, "OTP has expired"));
  }

  // Step 3: Update the user's password
  const doctor = await Doctor.findByPk(resetEntry.doctorId);
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  doctor.password = hashedPassword;
  await doctor.save();

  // Step 4: Clean up the used OTP
  await resetEntry.destroy();

  res
    .status(200)
    .send(
      resWrapper(
        "Password reset successful",
        200,
        null,
        "Password reset successful"
      )
    );
};

const uploadProfilePic = async (req, res) => {
  const {
    isSuccess,
    data,
    error: cloudError,
  } = await uploadSingleToCloudinary(req.file, "doctor");
  if (!isSuccess)
    return res
      .status(400)
      .send(resWrapper("Failed to upload image", 400, null, cloudError));

  const doctorId = req.userId;
  const doctor = await Doctor.findByPk(doctorId, {
    ...includeObj,
  });

  await doctor.update({ profilePic: data });

  return res.status(200).send(resWrapper("Pic Uploaded", 200, doctor));
};

module.exports = {
  updateDoctor,
  getAllAppointments,
  updateStatusOfAppointment,
  resetPassword,
  forgotPassword,
  newPassword,
  uploadProfilePic,
};
