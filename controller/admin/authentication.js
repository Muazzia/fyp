const { validateAdminLogin, validateCreateAdmin } = require("../../joiSchemas/admin/authentication");
const bcrypt = require("bcrypt")
const User = require("../../models/user");
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


module.exports = {
    createAdmin,
    adminLogin
}