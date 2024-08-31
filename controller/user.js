const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/user");
const { validateCreateUser, validateUserLogin } = require("../joiSchemas/user");
const { uploadSingleToCloudinary } = require("../utils/cloudinary");
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

    const { isSuccess, data, error: cloudError } = await uploadSingleToCloudinary(req.file, "user")
    console.log(isSuccess)
    if (!isSuccess) return res.status(400).send(resWrapper("Failed to upload image", 400, null, cloudError));

    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) return res.status(400).send(resWrapper("Error While Saving. Trying Again", 400, null, "Please Try Again Later"))

    const user = await User.create({ firstName, lastName, email, password: hashedPassword, profilePic: data, phoneNumber });

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

module.exports = {
    createUser,
    login
}