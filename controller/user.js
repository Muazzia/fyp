const bcrypt = require("bcrypt")
const User = require("../models/user");
const { validateCreateUser, validateUserLogin, validateResetPassword } = require("../joiSchemas/user");
const { resWrapper, generateJwtToken } = require("../utils");

const includeObj = {
    attributes: {
        exclude: ["password"]
    }
}

const createUser = async (req, res) => {
    const { error, value: { firstName, lastName, email, password, phoneNumber } } = validateCreateUser(req.body)
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message));

    const oldUser = await User.findOne({
        where: {
            email
        }
    });
    if (oldUser) return res.status(400).send(resWrapper("User With Email ALready Exist", 400, null, "Email With User Already Exist"));

    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) return res.status(400).send(resWrapper("Error While Saving. Trying Again", 400, null, "Please Try Again Later"))

    const user = await User.create({ firstName, lastName, email, password: hashedPassword, phoneNumber });

    const temp = await User.findByPk(user.id, {
        ...includeObj
    });

    return res.status(201).send(resWrapper("User Created", 201, temp))
}

const login = async (req, res) => {
    const { error, value: { email, password } } = validateUserLogin(req.body)
    if (error) return res.status(400).send(resWrapper(error.message, 400, null, error.message));

    // return res.send(error)
    // const { email, password } = { "email": true, "password": false };
    const user = await User.findOne({
        where: {
            email
        },
    });


    if (!user) return res.status(400).send(resWrapper("Email or Password Incorrect", 400, null, "Authorization Error"));

    const passChk = await bcrypt.compare(password, user.password);
    if (!passChk) return res.status(400).send(resWrapper("Email or Password Incorrect", 400, null, "Authorization Error"))

    const token = generateJwtToken(user);

    const { password: _, ...userWithoutPassword } = user.toJSON();
    return res.status(200).send(resWrapper("Logged In", 200, { user: userWithoutPassword, token }));
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
    createUser,
    login,
    resetPassword
}