const { validateAdminLogin, validateCreateAdmin } = require("../../joiSchemas/admin/authentication");
const bcrypt = require("bcrypt")
const User = require("../../models/user");
const { validateResetPassword, validateForgotPassword, validateNewPassword } = require("../../joiSchemas/user");
const PasswordResetOtp = require("../../models/passwordResetOtp");
const { sendEmail } = require("../../utils/nodemailer");



const { resWrapper, generateAdminJwtToken } = require("../../utils");

const includeObj = {
    attributes: {
        exclude: ["password"]
    }
}


const createAdmin = async (req, res) => {
    const { error, value: { firstName, lastName, email, password, phoneNumber } } = validateCreateAdmin(req.body)
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message));

    const oldUser = await User.findOne({
        where: {
            email
        }
    });
    if (oldUser) return res.status(400).send(resWrapper("User With Email ALready Exist", 400, null, "Email With User Already Exist"));

    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) return res.status(400).send(resWrapper("Error While Saving. Trying Again", 400, null, "Please Try Again Later"))

    const user = await User.create({ firstName, lastName, email, password: hashedPassword, phoneNumber, isAdmin: true });

    const temp = await User.findByPk(user.id, {
        ...includeObj
    });

    return res.status(201).send(resWrapper("Admin Created", 201, temp))
}

const adminLogin = async (req, res) => {
    const { error, value: { email, password } } = validateAdminLogin(req.body)
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message));

    const user = await User.findOne({
        where: {
            email
        },
    });
    if (!user) return res.status(400).send(resWrapper("Email or Password Incorrect", 400, null, "Authorization Error"));

    if (!user.isAdmin) return res.status(403).send(resWrapper("You Are Not Admin", 403, null, "Unauthorize Call"))

    const passChk = await bcrypt.compare(password, user.password);
    if (!passChk) return res.status(400).send(resWrapper("Email or Password Incorrect", 400, null, "Authorization Error"));


    const token = generateAdminJwtToken(user);

    const { password: _, ...userWithoutPassword } = user.toJSON();
    return res.status(200).send(resWrapper("Logged In", 200, { user: userWithoutPassword, token }));
}

const forgotPassword = async (req, res) => {
    const { error, value: { email } } = validateForgotPassword(req.body)
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message))


    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json(resWrapper('User not found', 400, null, "User email is not Valid"));

    if (!user.isAdmin) return res.status(400).send(resWrapper("You are not adming", 400, null, "You are not adming"));


    // Step 2: Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    const expiration = Date.now() + 300000; // 5 minutes expiration

    // Step 3: Save OTP to the database (overwrite any existing OTP for this user)
    await PasswordResetOtp.destroy({ where: { userId: user.id } }); // Optional: clean up old OTPs
    await PasswordResetOtp.create({
        userId: user.id,
        otp,
        expiration,
    });

    // Step 4: Send OTP via email
    const response = await sendEmail({ to: user.email, subject: "Password Reset OTP.", text: `Your OTP for password reset is: ${otp}. It is valid for 5 minutes.` })

    if (response.error) return res.status(400).send(resWrapper(response.error, 400, null, response.error))

    return res.status(200).send(resWrapper("Password Reset Email Sent", 200, "Email Sent"))
}


const newPassword = async (req, res) => {
    const { error, value: { otp, newPassword } } = validateNewPassword(req.body);
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message))

    // Step 1: Find OTP in the database
    const resetEntry = await PasswordResetOtp.findOne({
        where: {
            otp: otp.trim()
        }
    });
    if (!resetEntry) return res.status(400).json(resWrapper('Invalid or expired OTP', 400, null, 'Invalid or expired OTP'));

    // Step 2: Check if OTP is expired
    if (resetEntry.expiration < Date.now()) {
        return res.status(400).json(resWrapper('OTP has expired', 400, null, 'OTP has expired'));
    }

    // Step 3: Update the user's password
    const user = await User.findByPk(resetEntry.userId);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Step 4: Clean up the used OTP
    await resetEntry.destroy();

    res.status(200).send(resWrapper('Password reset successful', 200, null,));
}

const resetPassword = async (req, res) => {
    const userId = req.userId;

    const { error, value: { oldPassword, newPassword } } = validateResetPassword(req.body)
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message));

    const user = await User.findByPk(userId);
    if (!user) return res.status(400).send(resWrapper("User Not Found", 400, null, "User Id is not Valid"));

    const passChk = await bcrypt.compare(oldPassword, user.password);
    if (!passChk) return res.status(400).send(resWrapper("Old Password Incorrect", 400, null, "Authorization Error"))

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    if (!hashedPassword) return res.status(400).send(resWrapper("Error While Saving. Trying Again", 400, null, "Please Try Again Later"))

    await user.update({ password: hashedPassword })

    const temp = await User.findByPk(user.id, {
        ...includeObj
    });

    return res.status(201).send(resWrapper("Password Updated", 201, temp))
}

module.exports = {
    createAdmin,
    adminLogin,
    forgotPassword,
    newPassword,
    resetPassword

}